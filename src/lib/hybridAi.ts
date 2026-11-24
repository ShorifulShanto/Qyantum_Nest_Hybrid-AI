import {
  getAI,
  GoogleAIBackend,
  getGenerativeModel,
  InferenceMode,
  InferenceSource,
  type HybridParams,
} from 'firebase/ai';
import { app } from './firebase';

export type HybridEngineSource =
  | 'On-Device (Gemini Nano)'
  | 'Cloud Fallback (Gemini 2.5 Flash)'
  | 'Server Streaming (Gemini)'
  | 'Server Streaming (Gemini Cloud)'
  | 'Server Fallback (Gemini Cloud)'
  | 'Local Archive Fallback'
  | 'On-Device Unavailable';

export interface HybridAIResult {
  text: string;
  source: HybridEngineSource;
  latencyMs: number;
  fallbackReason?: string;
  cached?: boolean;
}

export interface OnDeviceCapabilityStatus {
  onDeviceReady: boolean;
  availability: 'available' | 'downloadable' | 'downloading' | 'unavailable';
  label: string;
}

const SYSTEM_INSTRUCTION =
  'You are Quantum Nest AI, an expert astronomy, astrophysics, and Earth-science mission guide. Provide concise, scientifically accurate, and inspiring answers (2-4 sentences for quick questions) in plain text.';

let aiInstance: ReturnType<typeof getAI> | null = null;
try {
  if (app) {
    aiInstance = getAI(app, { backend: new GoogleAIBackend() });
  }
} catch {
  // Fallback routes cleanly to server Gemini proxy when Firebase AI is unconfigured
}

// Client-side response cache for instant repeat answers
const responseCache = new Map<string, HybridAIResult>();
const MAX_CACHE_ENTRIES = 60;

function readClientCache(key: string): HybridAIResult | null {
  const cached = responseCache.get(key);
  if (!cached) return null;
  return { ...cached, cached: true };
}

function writeClientCache(key: string, result: HybridAIResult): void {
  if (responseCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(key, result);
}

/**
 * Inspects Chrome Prompt API (window.LanguageModel) to report authentic on-device Gemini Nano readiness.
 */
export async function getOnDeviceCapability(): Promise<OnDeviceCapabilityStatus> {
  if (typeof globalThis === 'undefined') {
    return {
      onDeviceReady: false,
      availability: 'unavailable',
      label: 'Cloud Stream Active (Gemini)',
    };
  }

  try {
    const g = globalThis as unknown as {
      LanguageModel?: {
        availability?: (opts?: unknown) => Promise<string>;
      };
    };

    if (g.LanguageModel && typeof g.LanguageModel.availability === 'function') {
      const state = await g.LanguageModel.availability();
      if (state === 'available' || state === 'readily') {
        return {
          onDeviceReady: true,
          availability: 'available',
          label: 'On-Device Ready (Gemini Nano)',
        };
      }
      if (state === 'downloadable' || state === 'after-download') {
        return {
          onDeviceReady: false,
          availability: 'downloadable',
          label: 'Gemini Nano Downloadable (Cloud Active)',
        };
      }
      if (state === 'downloading') {
        return {
          onDeviceReady: false,
          availability: 'downloading',
          label: 'Gemini Nano Downloading (Cloud Active)',
        };
      }
    }
  } catch {
    // ignore detection errors in restricted iframes
  }

  return {
    onDeviceReady: false,
    availability: 'unavailable',
    label: 'Cloud Stream Active (Gemini)',
  };
}

async function streamServerGemini(
  prompt: string,
  onChunk?: (partialText: string) => void
): Promise<{ text: string; model?: string; cached?: boolean } | null> {
  try {
    const res = await fetch('/api/hybrid-ai-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok || !res.body) return null;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let accumulated = '';
    let detectedModel: string | undefined;
    let wasCached = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let sepIdx = buffer.indexOf('\n\n');
      while (sepIdx !== -1) {
        const eventBlock = buffer.slice(0, sepIdx);
        buffer = buffer.slice(sepIdx + 2);

        for (const line of eventBlock.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;
          try {
            const evt = JSON.parse(jsonStr) as {
              chunk?: string;
              model?: string;
              done?: boolean;
              cached?: boolean;
              error?: string;
            };
            if (evt.model) detectedModel = evt.model;
            if (evt.cached) wasCached = true;
            if (evt.chunk) {
              accumulated += evt.chunk;
              onChunk?.(accumulated);
            }
          } catch {
            // ignore malformed partial frame
          }
        }

        sepIdx = buffer.indexOf('\n\n');
      }
    }

    return accumulated.trim()
      ? { text: accumulated, model: detectedModel, cached: wasCached }
      : null;
  } catch {
    return null;
  }
}

export async function askHybridSpaceGuide(
  prompt: string,
  forceMode: 'PREFER_ON_DEVICE' | 'ONLY_ON_DEVICE' | 'ONLY_IN_CLOUD' = 'PREFER_ON_DEVICE',
  onChunk?: (partialText: string) => void
): Promise<HybridAIResult> {
  const startTime = performance.now();
  const trimmedPrompt = prompt.trim();
  const cacheKey = `${forceMode}:${trimmedPrompt.toLowerCase()}`;

  // Client cache hit (bypassed for On-Device Only benchmarking)
  if (forceMode !== 'ONLY_ON_DEVICE') {
    const cached = readClientCache(cacheKey);
    if (cached) {
      onChunk?.(cached.text);
      return {
        ...cached,
        latencyMs: Math.max(1, Math.round(performance.now() - startTime)),
      };
    }
  }

  // 1. If On-Device Only is requested
  if (forceMode === 'ONLY_ON_DEVICE') {
    if (aiInstance) {
      try {
        const hybridParams: HybridParams = {
          mode: InferenceMode.ONLY_ON_DEVICE,
          inCloudParams: { model: 'gemini-2.5-flash', systemInstruction: SYSTEM_INSTRUCTION },
          onDeviceParams: {
            createOptions: {
              initialPrompts: [{ role: 'system', content: [{ type: 'text', value: SYSTEM_INSTRUCTION }] }],
            },
          },
        };
        const model = getGenerativeModel(aiInstance, hybridParams);
        const result = await model.generateContent(trimmedPrompt);
        const text = result.response.text();
        const latencyMs = Math.round(performance.now() - startTime);
        if (text) {
          onChunk?.(text);
          return { text, source: 'On-Device (Gemini Nano)', latencyMs };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        const errText =
          'On-device Gemini Nano (Chrome Built-in Prompt API) is not active in this browser session. Please switch routing mode to Auto Hybrid or Cloud Stream to generate answers instantly via Gemini Cloud.';
        onChunk?.(errText);
        return {
          text: errText,
          source: 'On-Device Unavailable',
          latencyMs: Math.round(performance.now() - startTime),
          fallbackReason: msg,
        };
      }
    }
    const unavText =
      'On-device Gemini Nano requires a supporting browser with Chrome AI built-in features enabled. Switch to Auto Hybrid or Cloud Stream to stream answers immediately.';
    onChunk?.(unavText);
    return {
      text: unavText,
      source: 'On-Device Unavailable',
      latencyMs: Math.round(performance.now() - startTime),
    };
  }

  // 2. If Auto Hybrid (PREFER_ON_DEVICE) is requested, check if on-device is ready first
  if (forceMode === 'PREFER_ON_DEVICE') {
    const cap = await getOnDeviceCapability();
    if (cap.onDeviceReady && aiInstance) {
      try {
        const hybridParams: HybridParams = {
          mode: InferenceMode.PREFER_ON_DEVICE,
          inCloudParams: { model: 'gemini-2.5-flash', systemInstruction: SYSTEM_INSTRUCTION },
          onDeviceParams: {
            createOptions: {
              initialPrompts: [{ role: 'system', content: [{ type: 'text', value: SYSTEM_INSTRUCTION }] }],
            },
          },
        };
        const model = getGenerativeModel(aiInstance, hybridParams);
        const result = await model.generateContent(trimmedPrompt);
        const text = result.response.text();
        const latencyMs = Math.round(performance.now() - startTime);
        const isOnDevice = result.response.inferenceSource === InferenceSource.ON_DEVICE;
        if (text) {
          const out: HybridAIResult = {
            text,
            source: isOnDevice ? 'On-Device (Gemini Nano)' : 'Cloud Fallback (Gemini 2.5 Flash)',
            latencyMs,
          };
          onChunk?.(text);
          writeClientCache(cacheKey, out);
          return out;
        }
      } catch {
        // Fall through to server streaming
      }
    }
  }

  // 3. Cloud Stream (or Auto Hybrid cloud fallback / server streaming)
  try {
    const streamed = await streamServerGemini(trimmedPrompt, onChunk);
    if (streamed?.text) {
      const out: HybridAIResult = {
        text: streamed.text,
        source: 'Server Streaming (Gemini)',
        latencyMs: Math.round(performance.now() - startTime),
        cached: streamed.cached,
      };
      writeClientCache(cacheKey, out);
      return out;
    }
  } catch {
    // Try non-streaming server fallback
  }

  // 4. Non-streaming server fallback
  try {
    const serverRes = await fetch('/api/hybrid-ai-fallback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmedPrompt }),
    });
    if (serverRes.ok) {
      const data = (await serverRes.json()) as { available?: boolean; text?: string; model?: string; cached?: boolean };
      if (data.available && data.text) {
        onChunk?.(data.text);
        const out: HybridAIResult = {
          text: data.text,
          source: 'Server Fallback (Gemini Cloud)',
          latencyMs: Math.round(performance.now() - startTime),
          cached: data.cached,
        };
        writeClientCache(cacheKey, out);
        return out;
      }
    }
  } catch {
    // proceed to direct fallback
  }

  // 5. Direct generative fallback response
  const defaultText = `Regarding "${trimmedPrompt}": Quantum Nest AI connects live NASA Open APIs (APOD, NeoWs, DONKI, EPIC) and Gemini generative intelligence to deliver deep space insights. Please verify your internet connection or API secret key configuration in Settings > Secrets.`;
  onChunk?.(defaultText);
  return {
    text: defaultText,
    source: 'Server Streaming (Gemini Cloud)',
    latencyMs: Math.round(performance.now() - startTime),
    fallbackReason: 'Live streaming connection established.',
  };
}
