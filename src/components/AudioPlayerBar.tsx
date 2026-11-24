import React, { useEffect, useRef, useState } from 'react';
import { SpaceSound } from '../types';
import { Play, Pause, X, Volume2, VolumeX, Radio } from 'lucide-react';
import { getAudioAnalyser, setCosmicVolume } from '../services/synthAudio';

interface AudioPlayerBarProps {
  currentSound: SpaceSound | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentSound,
  isPlaying,
  onTogglePlay,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    setCosmicVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Audio Visualizer frequency rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dataArray = new Uint8Array(64);

    const render = () => {
      const analyser = getAudioAnalyser();
      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Flatline or subtle resting oscillation when paused
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = isPlaying ? 10 + Math.random() * 20 : 2;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / dataArray.length) * 1.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const val = dataArray[i];
        const barHeight = (val / 255) * canvas.height;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#5DA9FF');
        grad.addColorStop(1, '#8B5CF6');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth + 1;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  if (!currentSound) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 max-w-4xl mx-auto z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="glass-card rounded-2xl p-3 px-5 border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4">
        {/* Track Metadata */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full cosmic-gradient flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(93,169,255,0.4)] hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5DA9FF] flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                {currentSound.category}
              </span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-[10px] font-mono text-[#94A3B8]">{currentSound.duration || 'Live Synthesized'}</span>
            </div>
            <p className="text-sm font-bold text-white truncate font-headline">{currentSound.title}</p>
          </div>
        </div>

        {/* Live Frequency Spectrum Canvas */}
        <div className="hidden sm:block flex-1 max-w-[200px] h-8 bg-black/40 rounded-lg p-1 border border-white/5">
          <canvas ref={canvasRef} width={200} height={32} className="w-full h-full" />
        </div>

        {/* Volume & Close */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-[#94A3B8] hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 accent-[#5DA9FF] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
            title="Stop playback"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
