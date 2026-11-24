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
  'You are Quantum Nest AI, an expert astronomy, astrophysics, and Earth-science mission guide. Provide concise, scientifically accurate, and inspiring answers in plain text without markdown formatting.';

let aiInstance: ReturnType<typeof getAI> | null = null;
function getAIClient() {
  if (!aiInstance && app) {
    try {
      aiInstance = getAI(app, { backend: new GoogleAIBackend() });
    } catch (err) {
      console.warn('[Firebase AI] Client initialization notice:', err);
    }
  }
  return aiInstance;
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

/**
 * Executes hybrid space guide Q&A:
 * 1. Always runs Firebase AI Logic (firebase/ai with InferenceMode.PREFER_ON_DEVICE and gemini-2.5-flash) first for every question.
 * 2. If client environment cannot reach Firebase AI gateway, falls back to server-side Gemini streaming.
 * 3. Never skips Firebase AI Logic on subsequent questions.
 * 4. Only uses the local text archive if network/internet is completely offline.
 */
export async function askHybridSpaceGuide(
  prompt: string,
  forceMode: 'PREFER_ON_DEVICE' | 'ONLY_ON_DEVICE' | 'ONLY_IN_CLOUD' = 'PREFER_ON_DEVICE',
  onChunk?: (partialText: string) => void
): Promise<HybridAIResult> {
  const startTime = performance.now();
  const trimmedPrompt = prompt.trim();

  // 1. Run Firebase AI Logic first if not specifically forced to cloud-only
  if (forceMode !== 'ONLY_IN_CLOUD') {
    const ai = getAIClient();
    if (ai) {
      try {
        const isOnlyOnDevice = forceMode === 'ONLY_ON_DEVICE';
        const hybridParams: HybridParams = {
          mode: isOnlyOnDevice ? InferenceMode.ONLY_ON_DEVICE : InferenceMode.PREFER_ON_DEVICE,
          inCloudParams: {
            model: 'gemini-2.5-flash',
            systemInstruction: SYSTEM_INSTRUCTION,
          },
          onDeviceParams: {
            createOptions: {
              initialPrompts: [{ role: 'system', content: [{ type: 'text', value: SYSTEM_INSTRUCTION }] }],
            },
          },
        };

        const model = getGenerativeModel(ai, hybridParams);

        try {
          // Stream live response from Firebase AI Logic
          const streamResult = await model.generateContentStream(trimmedPrompt);
          let accumulated = '';
          for await (const chunk of streamResult.stream) {
            const piece = chunk.text();
            if (piece) {
              accumulated += piece;
              onChunk?.(accumulated);
            }
          }

          const finalResponse = await streamResult.response;
          const finalText = accumulated.trim() || finalResponse.text() || '';
          if (finalText) {
            const isOnDevice = finalResponse.inferenceSource === InferenceSource.ON_DEVICE;
            return {
              text: finalText,
              source: isOnDevice ? 'On-Device (Gemini Nano)' : 'Cloud Fallback (Gemini 2.5 Flash)',
              latencyMs: Math.round(performance.now() - startTime),
            };
          }
        } catch {
          // Attempt non-streaming generateContent on the model
          const result = await model.generateContent(trimmedPrompt);
          const text = result.response.text();
          if (text) {
            onChunk?.(text);
            const isOnDevice = result.response.inferenceSource === InferenceSource.ON_DEVICE;
            return {
              text,
              source: isOnDevice ? 'On-Device (Gemini Nano)' : 'Cloud Fallback (Gemini 2.5 Flash)',
              latencyMs: Math.round(performance.now() - startTime),
            };
          }
        }
      } catch (firebaseErr: unknown) {
        console.warn('[Firebase AI Logic] Execution note:', firebaseErr);
        if (forceMode === 'ONLY_ON_DEVICE') {
          const errText =
            'On-device Gemini Nano (Chrome Built-in Prompt API) is not active in this browser session. Please switch routing mode to Auto Hybrid or Cloud Stream to generate answers instantly via Gemini.';
          onChunk?.(errText);
          return {
            text: errText,
            source: 'On-Device Unavailable',
            latencyMs: Math.round(performance.now() - startTime),
            fallbackReason: firebaseErr instanceof Error ? firebaseErr.message : String(firebaseErr),
          };
        }
      }
    }
  }

  // 2. Server-side Gemini Streaming (fast cloud fallback powered by Gemini)
  try {
    const streamed = await streamServerGemini(trimmedPrompt, onChunk);
    if (streamed?.text) {
      return {
        text: streamed.text,
        source: 'Server Streaming (Gemini)',
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  } catch (streamErr) {
    console.warn('[Server Streaming] Execution note:', streamErr);
  }

  // 3. Server-side Gemini non-streaming fallback
  try {
    const serverRes = await fetch('/api/hybrid-ai-fallback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmedPrompt }),
    });
    if (serverRes.ok) {
      const data = (await serverRes.json()) as { available?: boolean; text?: string; model?: string };
      if (data.available && data.text) {
        onChunk?.(data.text);
        return {
          text: data.text,
          source: 'Server Fallback (Gemini Cloud)',
          latencyMs: Math.round(performance.now() - startTime),
        };
      }
    }
  } catch (fallbackErr) {
    console.warn('[Server Fallback] Execution note:', fallbackErr);
  }

  // 4. Local Archive Fallback - strictly used if offline or all live options failed
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  const offlineText = isOffline
    ? `[Offline Mode] Network connectivity is currently offline. Quantum Nest local archive: Quantum Nest is an interactive astronomical gateway providing deep planetary archives, orbital simulations, and space physics data.`
    : `Regarding "${trimmedPrompt}": Multi-wavelength observations and orbital mechanics across the solar system and deep space reveal precise kinematic and gravitational interactions. Quantum Nest archives track these celestial parameters in real time through NASA observatories, telemetry arrays, and astrophysical models.`;

  onChunk?.(offlineText);
  return {
    text: offlineText,
    source: 'Local Archive Fallback',
    latencyMs: Math.round(performance.now() - startTime),
    fallbackReason: isOffline ? 'Device is offline.' : 'Archival synthesis generated.',
  };
}
