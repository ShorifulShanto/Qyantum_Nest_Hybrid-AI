import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const GEMINI_GUIDE_INSTRUCTION =
  'You are Quantum Nest AI, an expert astronomy, astrophysics, and Earth-science mission guide. Provide clear, concise, scientifically accurate answers (2-4 sentences for quick questions) in plain text.';

const FAST_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-4-hydrogen',
] as const;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  if (!apiKey) {
    res.write(`data: ${JSON.stringify({ error: 'Server GEMINI_API_KEY is not configured.' })}\n\n`);
    return res.end();
  }

  const ai = new GoogleGenAI({ apiKey });

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
    } catch {
      // try next candidate model
    }
  }

  res.write(`data: ${JSON.stringify({ error: 'No response generated' })}\n\n`);
  return res.end();
}
