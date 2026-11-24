import React, { useState, useEffect, useRef } from 'react';
import {
  askHybridSpaceGuide,
  getOnDeviceCapability,
  HybridEngineSource,
  OnDeviceCapabilityStatus,
} from '../lib/hybridAi';
import { BackButton } from '../components/BackButton';
import {
  Cpu,
  Cloud,
  Sparkles,
  Send,
  Loader2,
  X,
  RotateCcw,
  Trash2,
  Zap,
  ShieldCheck,
} from 'lucide-react';

interface ChatTurn {
  id: string;
  prompt: string;
  answer: string;
  source?: HybridEngineSource;
  latencyMs?: number;
  fallbackReason?: string;
  cached?: boolean;
  isStreaming?: boolean;
}

interface AiGuidePageProps {
  onBack: () => void;
}

const DEFAULT_SUGGESTIONS: string[] = [
  'Explain today’s NASA APOD & deep-sky imaging',
  'Compare Mars & Kepler-452b habitability',
  'Summarize Earth’s magnetosphere & CME alerts',
  'How are black hole sound waves sonified?',
  'What does NASA/JPL Eyes track in real time?',
];

export const AiGuidePage: React.FC<AiGuidePageProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [routingMode, setRoutingMode] = useState<
    'PREFER_ON_DEVICE' | 'ONLY_ON_DEVICE' | 'ONLY_IN_CLOUD'
  >('PREFER_ON_DEVICE');
  const [capability, setCapability] = useState<OnDeviceCapabilityStatus>({
    onDeviceReady: false,
    availability: 'unavailable',
    label: 'Checking Hybrid Runtime...',
  });
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [suggestionsHidden, setSuggestionsHidden] = useState<boolean>(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    getOnDeviceCapability().then((status) => {
      if (active) setCapability(status);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns.length, turns[turns.length - 1]?.answer]);

  const handleDismissSuggestion = (item: string) => {
    setSuggestions((prev) => prev.filter((s) => s !== item));
  };

  const handleDismissAllSuggestions = () => {
    setSuggestionsHidden(true);
  };

  const handleRestoreSuggestions = () => {
    setSuggestions(DEFAULT_SUGGESTIONS);
    setSuggestionsHidden(false);
  };

  const handleSend = async (customPrompt?: string) => {
    const q = (customPrompt !== undefined ? customPrompt : prompt).trim();
    if (!q || loading) return;

    if (customPrompt === undefined) {
      setPrompt('');
    }

    const turnId = `turn-${Date.now()}`;
    setTurns((prev) => [
      ...prev,
      {
        id: turnId,
        prompt: q,
        answer: '',
        isStreaming: true,
      },
    ]);
    setLoading(true);

    try {
      const result = await askHybridSpaceGuide(q, routingMode, (partialText) => {
        setTurns((prev) =>
          prev.map((t) => (t.id === turnId ? { ...t, answer: partialText } : t))
        );
      });

      setTurns((prev) =>
        prev.map((t) =>
          t.id === turnId
            ? {
                ...t,
                answer: result.text,
                source: result.source,
                latencyMs: result.latencyMs,
                fallbackReason: result.fallbackReason,
                cached: result.cached,
                isStreaming: false,
              }
            : t
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const routingOptions: Array<{
    key: 'PREFER_ON_DEVICE' | 'ONLY_ON_DEVICE' | 'ONLY_IN_CLOUD';
    label: string;
    desc: string;
  }> = [
    {
      key: 'PREFER_ON_DEVICE',
      label: 'Auto Hybrid',
      desc: 'Runs on-device Gemini Nano first, then streams cloud Gemini fallback.',
    },
    {
      key: 'ONLY_ON_DEVICE',
      label: 'On-Device Only',
      desc: 'Strictly tests Chrome Built-in Gemini Nano with zero cloud calls.',
    },
    {
      key: 'ONLY_IN_CLOUD',
      label: 'Cloud Stream',
      desc: 'Routes directly through Gemini cloud streaming for fast answers.',
    },
  ];

  const getSourceColor = (source?: HybridEngineSource) => {
    switch (source) {
      case 'On-Device (Gemini Nano)':
        return 'text-emerald-300';
      case 'Cloud Fallback (Gemini 2.5 Flash)':
      case 'Server Streaming (Gemini)':
      case 'Server Fallback (Gemini Cloud)':
        return 'text-[#38BDF8]';
      case 'On-Device Unavailable':
        return 'text-amber-300';
      default:
        return 'text-[#A78BFA]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <BackButton onBack={onBack} label="Back" />
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 uppercase tracking-widest pt-1">
            <Cpu className="w-4 h-4" />
            <span>Firebase AI Logic · App Check · SSE Streaming</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold font-headline text-white">
            Hybrid AI Space Guide
          </h1>
        </div>

        {/* Authentic Runtime Telemetry Line (Zero Pill Enclosure) */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#94A3B8]">
          <span className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                capability.onDeviceReady ? 'bg-emerald-400' : 'bg-[#38BDF8]'
              }`}
            />
            <span className="text-white">{capability.label}</span>
          </span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>App Check Guarded</span>
          </span>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Rail */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Inference Routing Selector */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#5DA9FF]">
                Inference Routing Mode
              </h2>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <div className="space-y-2">
              {routingOptions.map((opt) => {
                const active = routingMode === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setRoutingMode(opt.key)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#5DA9FF]/15 border-[#5DA9FF]/50 text-white'
                        : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold">{opt.label}</span>
                      {opt.key === 'ONLY_IN_CLOUD' ? (
                        <Cloud className="w-3.5 h-3.5 text-[#38BDF8]" />
                      ) : (
                        <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dismissible Suggested Queries Panel */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#A78BFA]">
                Suggested Prompts
              </h2>
              {!suggestionsHidden && suggestions.length > 0 ? (
                <button
                  type="button"
                  onClick={handleDismissAllSuggestions}
                  className="text-[11px] font-mono text-[#94A3B8] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  title="Dismiss all suggestions"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Dismiss All</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRestoreSuggestions}
                  className="text-[11px] font-mono text-[#5DA9FF] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              )}
            </div>

            {suggestionsHidden || suggestions.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center space-y-2">
                <p className="text-xs text-[#94A3B8]">
                  Prompt suggestions dismissed for focus mode.
                </p>
                <button
                  type="button"
                  onClick={handleRestoreSuggestions}
                  className="text-xs font-mono text-[#5DA9FF] hover:underline cursor-pointer"
                >
                  Show Suggestions Again
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((item) => (
                  <div
                    key={item}
                    className="group flex items-stretch rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleSend(item)}
                      disabled={loading}
                      className="flex-1 text-left px-3 py-2.5 text-xs text-[#CBD5E1] hover:text-white disabled:opacity-50 cursor-pointer leading-snug"
                    >
                      {item}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismissSuggestion(item)}
                      aria-label={`Dismiss suggestion: ${item}`}
                      title="Cross out / dismiss suggestion"
                      className="px-2.5 flex items-center justify-center text-[#94A3B8] hover:text-rose-300 hover:bg-white/5 border-l border-white/10 cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation Action */}
          {turns.length > 0 && (
            <button
              type="button"
              onClick={() => setTurns([])}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#94A3B8] hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Conversation ({turns.length})</span>
            </button>
          )}
        </aside>

        {/* Right Conversation Stream & Input Stage */}
        <section className="lg:col-span-8 glass-card rounded-2xl border border-white/10 flex flex-col min-h-[560px] lg:min-h-[640px] overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 p-5 lg:p-6 overflow-y-auto space-y-6">
            {turns.length === 0 ? (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-4 py-8">
                <div className="w-12 h-12 rounded-2xl bg-[#5DA9FF]/15 border border-[#5DA9FF]/30 flex items-center justify-center text-[#5DA9FF]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold font-headline text-white">
                  Ask Anything About the Cosmos
                </h2>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Powered by low-latency Gemini token streaming, response caching, and Firebase AI Logic hybrid routing between on-device Gemini Nano and cloud Gemini models.
                </p>
              </div>
            ) : (
              turns.map((turn) => (
                <div key={turn.id} className="space-y-3">
                  {/* Explorer Prompt */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#5DA9FF]/15 border border-[#5DA9FF]/30 px-4 py-3 text-sm text-white">
                      {turn.prompt}
                    </div>
                  </div>

                  {/* AI Streaming Response */}
                  <div className="rounded-2xl rounded-tl-sm bg-[#050816]/85 border border-white/10 p-4 lg:p-5 space-y-3">
                    {turn.isStreaming && !turn.answer ? (
                      <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Streaming cosmic response...</span>
                      </div>
                    ) : (
                      <p className="text-sm text-[#E2E8F0] leading-relaxed whitespace-pre-wrap">
                        {turn.answer}
                      </p>
                    )}

                    {/* Telemetry Footer */}
                    {turn.source && (
                      <div className="pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#94A3B8] tabular-nums">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`font-bold ${getSourceColor(turn.source)}`}>
                            {turn.source}
                          </span>
                          {turn.cached && (
                            <>
                              <span className="text-white/20">·</span>
                              <span className="text-emerald-300">Cached</span>
                            </>
                          )}
                          {turn.fallbackReason && (
                            <>
                              <span className="text-white/20">·</span>
                              <span className="text-[#94A3B8]">{turn.fallbackReason}</span>
                            </>
                          )}
                        </div>
                        {typeof turn.latencyMs === 'number' && (
                          <span className="text-white font-semibold">{turn.latencyMs} ms</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={threadEndRef} />
          </div>

          {/* Prompt Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 lg:p-5 bg-[#050816]/90 border-t border-white/10"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about exoplanets, solar flares, dark matter, Mars, or comets..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#5DA9FF] transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="px-5 py-3 rounded-xl cosmic-gradient text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-40 cursor-pointer shrink-0 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Ask Guide</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
