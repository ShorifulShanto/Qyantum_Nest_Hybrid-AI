import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Lightweight in-memory TTL cache to avoid redundant NASA API requests
const responseCache = new Map<string, { expiresAt: number; payload: unknown }>();
function getCached<T>(key: string): T | null {
  const hit = responseCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return hit.payload as T;
}
function setCached(key: string, payload: unknown, ttlMs = 5 * 60 * 1000) {
  responseCache.set(key, { expiresAt: Date.now() + ttlMs, payload });
}

function toHttps(url?: string): string | undefined {
  if (!url) return undefined;
  return url.replace(/^http:\/\//i, 'https://');
}

function shiftDate(isoDate: string, daysDelta: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) {
    const fallback = new Date();
    fallback.setUTCDate(fallback.getUTCDate() + daysDelta);
    return fallback.toISOString().split('T')[0];
  }
  d.setUTCDate(d.getUTCDate() + daysDelta);
  return d.toISOString().split('T')[0];
}

// -----------------------------------------------------------------------------
// API: NASA Astronomy Picture of the Day (APOD) + Recent Strip
// -----------------------------------------------------------------------------
app.get('/api/nasa/apod', async (req, res) => {
  const requestedDate =
    typeof req.query.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
      ? req.query.date
      : new Date().toISOString().split('T')[0];
  const includeRecent = req.query.recent === 'true';

  const cacheKey = `apod:${requestedDate}:${includeRecent}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  let capture: Record<string, unknown> | null = null;
  // NASA APOD can lag behind UTC midnight or return 500 on unpublished dates; step back up to 5 days
  for (let offset = 0; offset <= 5; offset++) {
    const candidateDate = shiftDate(requestedDate, -offset);
    try {
      const url = `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(NASA_KEY)}&date=${candidateDate}`;
      const r = await fetch(url, { signal: AbortSignal.timeout(7000) });
      if (r.ok) {
        const json = (await r.json()) as Record<string, unknown>;
        if (json && json.url && json.title) {
          capture = json;
          break;
        }
      }
    } catch {
      // try previous day
    }
  }

  let recent: unknown[] = [];
  if (includeRecent) {
    const baseDate = typeof capture?.date === 'string' ? capture.date : shiftDate(requestedDate, -2);
    const start = shiftDate(baseDate, -6);
    try {
      const rangeUrl = `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(
        NASA_KEY
      )}&start_date=${start}&end_date=${baseDate}`;
      const r = await fetch(rangeUrl, { signal: AbortSignal.timeout(8000) });
      if (r.ok) {
        const arr = await r.json();
        if (Array.isArray(arr)) {
          recent = arr.reverse().slice(0, 6);
        }
      }
    } catch {
      // ignore recent strip failure
    }
  }

  if (!capture) {
    return res.status(502).json({
      error: 'NASA APOD upstream temporarily unavailable',
      requestedDate,
    });
  }

  const payload = { capture, recent, requestedDate };
  setCached(cacheKey, payload, 15 * 60 * 1000);
  return res.json(payload);
});

// -----------------------------------------------------------------------------
// API: NASA Near-Earth Object Web Service (NeoWs)
// -----------------------------------------------------------------------------
app.get('/api/nasa/asteroids', async (_req, res) => {
  const cached = getCached('neows');
  if (cached) return res.json(cached);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = shiftDate(today, -1);

  try {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${yesterday}&end_date=${today}&api_key=${encodeURIComponent(
      NASA_KEY
    )}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(9000) });
    if (!r.ok) {
      return res.status(502).json({ error: `NASA NeoWs returned ${r.status}` });
    }

    const data = (await r.json()) as {
      near_earth_objects?: Record<string, Array<Record<string, unknown>>>;
    };

    const flattened: Array<Record<string, unknown>> = [];
    if (data.near_earth_objects) {
      Object.values(data.near_earth_objects).forEach((dayList) => {
        flattened.push(...dayList);
      });
    }

    const asteroids = flattened.slice(0, 9).map((neo) => {
      const approach = (neo.close_approach_data as Array<Record<string, unknown>> | undefined)?.[0] || {};
      const velocity = approach.relative_velocity as { kilometers_per_second?: string } | undefined;
      const miss = approach.miss_distance as { lunar?: string; kilometers?: string } | undefined;
      const est = (neo.estimated_diameter as {
        meters?: { estimated_diameter_min?: number; estimated_diameter_max?: number };
      })?.meters;

      const minM = est?.estimated_diameter_min ? Math.round(est.estimated_diameter_min) : null;
      const maxM = est?.estimated_diameter_max ? Math.round(est.estimated_diameter_max) : null;
      const lunarVal = miss?.lunar ? Number(miss.lunar).toFixed(2) : null;
      const kmVal = miss?.kilometers ? Math.round(Number(miss.kilometers)).toLocaleString() : null;

      return {
        id: String(neo.id || neo.neo_reference_id || Math.random()),
        name: String(neo.name || 'Unknown NEO').replace(/[()]/g, ''),
        hazardous: Boolean(neo.is_potentially_hazardous_asteroid),
        speed: velocity?.kilometers_per_second
          ? `${Number(velocity.kilometers_per_second).toFixed(1)} km/s`
          : 'N/A',
        distance:
          lunarVal && kmVal ? `${lunarVal} LD (${kmVal} km)` : kmVal ? `${kmVal} km` : 'Tracked',
        size: minM !== null && maxM !== null ? `${minM} - ${maxM} meters` : 'Estimated',
        closeApproachDate: String(approach.close_approach_date_full || approach.close_approach_date || today),
      };
    });

    const payload = { asteroids, count: asteroids.length, source: 'NASA NeoWs Live Feed' };
    setCached('neows', payload, 10 * 60 * 1000);
    return res.json(payload);
  } catch {
    return res.status(502).json({ error: 'NASA NeoWs upstream request failed' });
  }
});

// -----------------------------------------------------------------------------
// API: NASA DONKI Space Weather Notifications
// -----------------------------------------------------------------------------
app.get('/api/nasa/weather', async (_req, res) => {
  const cached = getCached('donki');
  if (cached) return res.json(cached);

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = shiftDate(endDate, -30);

  try {
    const url = `https://api.nasa.gov/DONKI/notifications?startDate=${startDate}&endDate=${endDate}&type=all&api_key=${encodeURIComponent(
      NASA_KEY
    )}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(9000) });
    if (!r.ok) {
      return res.status(502).json({ error: `NASA DONKI returned ${r.status}` });
    }

    const list = (await r.json()) as Array<{
      messageType?: string;
      messageID?: string;
      messageIssueTime?: string;
      messageBody?: string;
    }>;

    const events = (Array.isArray(list) ? list : []).slice(0, 8).map((item) => {
      const body = item.messageBody || '';
      const summaryMatch = body.match(/##\s*Summary:\s*([\s\S]*?)(?:\n##|$)/i);
      const cleanMsg = (summaryMatch ? summaryMatch[1] : body.replace(/##[^\n]*\n?/g, ''))
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 260);

      let severity: 'Routine' | 'Moderate' | 'High' | 'Severe' = 'Routine';
      if (/X-class|X\d|G4|G5|Extreme|Severe/i.test(body)) severity = 'Severe';
      else if (/M-class|G2|G3|Strong|Earth-directed|CME/i.test(body) || item.messageType === 'FLR') severity = 'High';
      else if (item.messageType === 'CME' || item.messageType === 'IPS' || item.messageType === 'RBE') severity = 'Moderate';

      return {
        id: item.messageID || String(Math.random()),
        type: `NASA DONKI · ${item.messageType || 'Space Weather'} Alert`,
        date: item.messageIssueTime ? item.messageIssueTime.replace('T', ' ').replace('Z', ' UTC') : endDate,
        message: cleanMsg || 'Solar & geomagnetic telemetry advisory recorded by NASA CCMC DONKI.',
        severity,
      };
    });

    const payload = { events, source: 'NASA CCMC DONKI Live' };
    setCached('donki', payload, 10 * 60 * 1000);
    return res.json(payload);
  } catch {
    return res.status(502).json({ error: 'NASA DONKI upstream request failed' });
  }
});

// -----------------------------------------------------------------------------
// API: NASA EPIC (Earth Polychromatic Imaging Camera - DSCOVR)
// -----------------------------------------------------------------------------
app.get('/api/nasa/epic', async (_req, res) => {
  const cached = getCached('epic');
  if (cached) return res.json(cached);

  try {
    const r = await fetch('https://epic.gsfc.nasa.gov/api/natural', {
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) {
      return res.status(502).json({ error: `NASA EPIC returned ${r.status}` });
    }
    const items = (await r.json()) as Array<{
      identifier: string;
      caption: string;
      image: string;
      date?: string;
      centroid_coordinates?: { lat: number; lon: number };
      dscovr_j2000_position?: { x: number; y: number; z: number };
    }>;

    const frames = (Array.isArray(items) ? items : []).slice(0, 8).map((item) => {
      // identifier format: YYYYMMDDHHMMSS
      const id = item.identifier || '';
      const yyyy = id.slice(0, 4);
      const mm = id.slice(4, 6);
      const dd = id.slice(6, 8);
      const pos = item.dscovr_j2000_position;
      const distKm = pos ? Math.round(Math.hypot(pos.x, pos.y, pos.z)) : undefined;

      return {
        identifier: id,
        caption: item.caption || 'NASA DSCOVR EPIC Full-Disk Earth Observation',
        date: item.date || `${yyyy}-${mm}-${dd}`,
        imageUrl: `https://epic.gsfc.nasa.gov/archive/natural/${yyyy}/${mm}/${dd}/jpg/${item.image}.jpg`,
        centroid: {
          lat: Number((item.centroid_coordinates?.lat ?? 0).toFixed(2)),
          lon: Number((item.centroid_coordinates?.lon ?? 0).toFixed(2)),
        },
        dscovrDistanceKm: distKm,
      };
    });

    const payload = { frames, source: 'NASA DSCOVR / EPIC Live' };
    setCached('epic', payload, 15 * 60 * 1000);
    return res.json(payload);
  } catch {
    return res.status(502).json({ error: 'NASA EPIC upstream request failed' });
  }
});

// -----------------------------------------------------------------------------
// API: NASA Image, Video & Audio Library Search (images-api.nasa.gov)
// -----------------------------------------------------------------------------
app.get('/api/nasa/media', async (req, res) => {
  const q = typeof req.query.q === 'string' && req.query.q.trim() ? req.query.q.trim() : 'solar system';
  const mediaType =
    typeof req.query.media_type === 'string' && req.query.media_type.trim()
      ? req.query.media_type.trim()
      : 'image,video';
  const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 8));

  const cacheKey = `media:${q.toLowerCase()}:${mediaType}:${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const searchUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(
      q
    )}&media_type=${encodeURIComponent(mediaType)}`;
    const r = await fetch(searchUrl, { signal: AbortSignal.timeout(9000) });
    if (!r.ok) {
      return res.status(502).json({ error: `NASA Media Library returned ${r.status}` });
    }

    const json = (await r.json()) as {
      collection?: {
        items?: Array<{
          href?: string;
          data?: Array<{
            nasa_id?: string;
            title?: string;
            description?: string;
            media_type?: 'image' | 'video' | 'audio';
            date_created?: string;
            center?: string;
            keywords?: string[];
          }>;
          links?: Array<{ href?: string; rel?: string; render?: string }>;
        }>;
      };
    };

    const rawItems = (json.collection?.items || []).slice(0, limit);

    const resolvedItems = await Promise.all(
      rawItems.map(async (entry) => {
        const meta = entry.data?.[0];
        if (!meta) return null;

        const thumbUrl = toHttps(
          entry.links?.find((l) => l.render === 'image' || l.rel === 'preview')?.href
        );

        let mediaUrl = thumbUrl;
        if ((meta.media_type === 'video' || meta.media_type === 'audio') && entry.href) {
          try {
            const colRes = await fetch(toHttps(entry.href)!, { signal: AbortSignal.timeout(5000) });
            if (colRes.ok) {
              const assets = (await colRes.json()) as string[];
              if (meta.media_type === 'video') {
                const mp4 =
                  assets.find((u) => /~medium\.mp4$/i.test(u)) ||
                  assets.find((u) => /~small\.mp4$/i.test(u)) ||
                  assets.find((u) => /~mobile\.mp4$/i.test(u)) ||
                  assets.find((u) => /\.mp4$/i.test(u));
                if (mp4) mediaUrl = toHttps(mp4);
              } else if (meta.media_type === 'audio') {
                const audioFile =
                  assets.find((u) => /\.mp3$/i.test(u)) ||
                  assets.find((u) => /\.m4a$/i.test(u)) ||
                  assets.find((u) => /\.wav$/i.test(u));
                if (audioFile) mediaUrl = toHttps(audioFile);
              }
            }
          } catch {
            // keep fallback thumbUrl
          }
        }

        return {
          nasaId: meta.nasa_id || String(Math.random()),
          title: meta.title || 'NASA Archival Capture',
          description: (meta.description || '').replace(/<[^>]+>/g, '').slice(0, 320),
          mediaType: meta.media_type || 'image',
          dateCreated: (meta.date_created || '').split('T')[0],
          center: meta.center || 'NASA',
          thumbUrl,
          mediaUrl,
          keywords: meta.keywords?.slice(0, 4) || [],
        };
      })
    );

    const items = resolvedItems.filter(Boolean);
    const payload = { items, query: q, source: 'NASA Image & Video Library' };
    setCached(cacheKey, payload, 15 * 60 * 1000);
    return res.json(payload);
  } catch {
    const fallbackItems = [
      {
        nasaId: 'PIA24101',
        title: 'Deep Space Nebula & Stellar Nursery',
        description: 'Multi-wavelength archival composite revealing active star formation and stellar winds within the Milky Way galactic arm.',
        mediaType: 'image',
        dateCreated: '2026-01-15',
        center: 'NASA Goddard Space Flight Center',
        thumbUrl: 'https://images-assets.nasa.gov/image/PIA24101/PIA24101~small.jpg',
        mediaUrl: 'https://images-assets.nasa.gov/image/PIA24101/PIA24101~medium.jpg',
        keywords: ['Nebula', 'JWST', 'Stars', 'Astronomy'],
      },
      {
        nasaId: 'PIA02653',
        title: 'Blue Marble Earth from Orbit',
        description: 'Full-disk snapshot of Earth captured by deep-space Earth observation satellites highlighting atmospheric cloud dynamics and oceans.',
        mediaType: 'image',
        dateCreated: '2026-02-10',
        center: 'NASA HQ',
        thumbUrl: 'https://images-assets.nasa.gov/image/PIA02653/PIA02653~small.jpg',
        mediaUrl: 'https://images-assets.nasa.gov/image/PIA02653/PIA02653~medium.jpg',
        keywords: ['Earth', 'DSCOVR', 'Atmosphere', 'Orbit'],
      },
      {
        nasaId: 'PIA15162',
        title: 'Saturn Ring System & Auroras',
        description: 'High-contrast orbital perspective of Saturn’s majestic ring plane and polar ultraviolet auroral emissions.',
        mediaType: 'image',
        dateCreated: '2026-01-20',
        center: 'JPL-Caltech',
        thumbUrl: 'https://images-assets.nasa.gov/image/PIA15162/PIA15162~small.jpg',
        mediaUrl: 'https://images-assets.nasa.gov/image/PIA15162/PIA15162~medium.jpg',
        keywords: ['Saturn', 'Rings', 'Cassini', 'Gas Giant'],
      },
    ];
    return res.json({ items: fallbackItems, query: q, source: 'NASA Archival Fallback Library' });
  }
});

// -----------------------------------------------------------------------------
// API: Server-side Gemini Helper (Singleton + Fast Cache + Low Latency + SSE)
// -----------------------------------------------------------------------------
const GEMINI_GUIDE_INSTRUCTION =
  'You are Quantum Nest AI, an expert astronomy, astrophysics, and Earth-science mission guide. Provide clear, concise, scientifically accurate answers (2-4 sentences for quick questions) in plain text.';

let cachedGenAiClient: GoogleGenAI | null = null;
function getServerGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  if (!cachedGenAiClient) {
    cachedGenAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedGenAiClient;
}

const FAST_MODELS = ['gemini-3.1-flash-lite', 'gemini-4-hydrogen'] as const;

async function callServerGemini(
  prompt: string,
  systemInstruction: string
): Promise<{ text: string; model: string } | null> {
  const ai = getServerGenAI();
  if (!ai) return null;

  for (const model of FAST_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          abortSignal: AbortSignal.timeout(12000),
          ...(model === 'gemini-4-hydrogen'
            ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
            : {}),
        },
      });
      if (response.text) return { text: response.text, model };
    } catch (err: unknown) {
      const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      console.warn(`[HybridAI] ${model} fallback notice:`, msg);
      if (model === FAST_MODELS[FAST_MODELS.length - 1]) {
        throw err;
      }
    }
  }

  return null;
}

app.post('/api/hybrid-ai-stream', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  const ai = getServerGenAI();
  if (!ai) {
    res.write(`data: ${JSON.stringify({ error: 'Server GEMINI_API_KEY is not configured.' })}\n\n`);
    return res.end();
  }

  for (const model of FAST_MODELS) {
    try {
      const stream = await ai.models.generateContentStream({
        model,
        contents: prompt,
        config: {
          systemInstruction: GEMINI_GUIDE_INSTRUCTION,
          abortSignal: AbortSignal.timeout(12000),
          ...(model === 'gemini-4-hydrogen'
            ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
            : {}),
        },
      });

      let fullText = '';
      for await (const chunk of stream) {
        const piece = chunk.text;
        if (piece) {
          fullText += piece;
          res.write(`data: ${JSON.stringify({ chunk: piece, model })}\n\n`);
        }
      }

      if (fullText.trim()) {
        res.write(`data: ${JSON.stringify({ done: true, model })}\n\n`);
        return res.end();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      console.warn(`[HybridAI Stream] ${model} notice:`, msg);
      if (model === FAST_MODELS[FAST_MODELS.length - 1]) {
        res.write(`data: ${JSON.stringify({ error: `Server Gemini stream error (${msg.slice(0, 120)})` })}\n\n`);
        return res.end();
      }
    }
  }

  res.write(`data: ${JSON.stringify({ error: 'No response generated' })}\n\n`);
  return res.end();
});

app.post('/api/hybrid-ai-fallback', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await callServerGemini(prompt, GEMINI_GUIDE_INSTRUCTION);
    if (!result) {
      return res.status(503).json({
        available: false,
        error: 'Server GEMINI_API_KEY is not configured.',
      });
    }
    return res.json({
      available: true,
      text: result.text,
      model: result.model,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return res.status(502).json({
      available: false,
      error: `Server Gemini fallback temporarily unavailable (${msg.slice(0, 140)})`,
    });
  }
});

app.post('/api/cosmic-search', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  const cacheKey = `search:${query.trim().toLowerCase()}`;
  const cached = getCached<{ analysis: string; source: string }>(cacheKey);
  if (cached) {
    return res.json({ success: true, ...cached });
  }

  try {
    const result = await callServerGemini(
      `Provide a concise, authoritative scientific analysis (2 short paragraphs) regarding this cosmic query: "${query}". Include physical properties, observational history, relevant NASA missions (JWST, Hubble, Chandra, Voyager, Cassini), and current astrophysical consensus. Plain text only.`,
      'You are the Quantum Nest Deep Space Archival AI.'
    );

    if (result?.text) {
      const payload = { analysis: result.text, source: `Gemini Server (${result.model})` };
      setCached(cacheKey, payload, 15 * 60 * 1000);
      return res.json({
        success: true,
        ...payload,
      });
    }
  } catch {
    console.warn('Gemini API call failed, returning NASA archival synthesis.');
  }

  return res.json({
    success: true,
    source: 'Archival Synthesis',
    analysis: `Deep space archival synthesis for "${query}": Multi-wavelength NASA observatories including Hubble, JWST, Chandra, and DSN radio arrays track electromagnetic emission, orbital kinematics, and atmospheric spectra across nearby planets and deep extragalactic fields.`,
  });
});

// Setup Vite in Dev or serve dist in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quantum Nest server running at http://localhost:${PORT}`);
  });
}

startServer();
