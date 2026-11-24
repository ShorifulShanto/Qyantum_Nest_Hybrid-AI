import React, { useEffect, useRef, useState } from 'react';
import { Constellation } from '../types';
import { Sparkles, Grid3X3, Eye } from 'lucide-react';

interface StarAtlasCanvasProps {
  constellation: Constellation;
  onSelectStar?: (starName: string) => void;
}

export const StarAtlasCanvas: React.FC<StarAtlasCanvasProps> = ({
  constellation,
  onSelectStar,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showGlow, setShowGlow] = useState<boolean>(true);
  const [activeStar, setActiveStar] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const dpr = window.devicePixelRatio || 1;

      ctx.save();
      ctx.scale(dpr, dpr);
      const logicalW = w / dpr;
      const logicalH = h / dpr;

      ctx.clearRect(0, 0, logicalW, logicalH);

      // Deep space night sky gradient
      const skyGrad = ctx.createRadialGradient(logicalW / 2, logicalH / 2, 20, logicalW / 2, logicalH / 2, logicalW * 0.7);
      skyGrad.addColorStop(0, '#090D26');
      skyGrad.addColorStop(0.6, '#060919');
      skyGrad.addColorStop(1, '#03050F');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, logicalW, logicalH);

      // Celestial Coordinate Grid (RA/Dec)
      if (showGrid) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        // Horizontal latitude arcs
        for (let y = 40; y < logicalH; y += 50) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(logicalW, y);
          ctx.stroke();
        }
        // Vertical meridian lines
        for (let x = 40; x < logicalW; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, logicalH);
          ctx.stroke();
        }
      }

      // Convert constellation star percentage coordinates to pixels
      const starCoords = constellation.majorStars.map((s) => ({
        name: s.name,
        mag: s.mag,
        px: (s.x / 100) * (logicalW - 80) + 40,
        py: (s.y / 100) * (logicalH - 80) + 40,
      }));

      // Draw Constellation Connecting Lines
      ctx.save();
      ctx.strokeStyle = 'rgba(93, 169, 255, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      for (const [startIdx, endIdx] of constellation.lines) {
        const s1 = starCoords[startIdx];
        const s2 = starCoords[endIdx];
        if (s1 && s2) {
          ctx.beginPath();
          ctx.moveTo(s1.px, s1.py);
          ctx.lineTo(s2.px, s2.py);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Draw Constellation Myth Glow Overlay if enabled
      if (showGlow) {
        ctx.save();
        for (const s of starCoords) {
          const glow = ctx.createRadialGradient(s.px, s.py, 2, s.px, s.py, 28);
          glow.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
          glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.px, s.py, 28, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw Stars
      for (const s of starCoords) {
        const isHovered = activeStar === s.name;
        const radius = Math.max(3.5, 7.5 - s.mag * 1.2);

        // Core star
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = s.mag < 1.0 ? '#5DA9FF' : '#E0E7FF';
        ctx.shadowBlur = isHovered ? 20 : 12;

        ctx.beginPath();
        ctx.arc(s.px, s.py, radius, 0, Math.PI * 2);
        ctx.fill();

        // Cross diffraction spikes on brightest stars
        if (s.mag < 1.5) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          const spikeLen = radius * 2.5;
          ctx.beginPath();
          ctx.moveTo(s.px - spikeLen, s.py);
          ctx.lineTo(s.px + spikeLen, s.py);
          ctx.moveTo(s.px, s.py - spikeLen);
          ctx.lineTo(s.px, s.py + spikeLen);
          ctx.stroke();
        }

        ctx.restore();

        // Label star name & apparent magnitude
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isHovered ? '#5DA9FF' : '#E2E8F0';
        ctx.fillText(s.name, s.px, s.py - radius - 8);

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(`mag ${s.mag.toFixed(1)}`, s.px, s.py + radius + 14);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [constellation, showGrid, showGlow, activeStar]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const logicalW = rect.width;
    const logicalH = rect.height;

    let matched: string | null = null;
    for (const s of constellation.majorStars) {
      const px = (s.x / 100) * (logicalW - 80) + 40;
      const py = (s.y / 100) * (logicalH - 80) + 40;
      if (Math.hypot(mouseX - px, mouseY - py) < 18) {
        matched = s.name;
        break;
      }
    }
    setActiveStar(matched);
  };

  const handleClick = () => {
    if (activeStar && onSelectStar) {
      onSelectStar(activeStar);
    }
  };

  return (
    <div className="relative w-full h-[400px] lg:h-[480px] rounded-2xl glass-card overflow-hidden flex flex-col items-center justify-center border border-white/10 shadow-2xl">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="w-full h-full cursor-crosshair"
      />

      {/* Top Header Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-[#050816]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-[#94A3B8] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
          <span className="text-[#F8FAFC] font-bold">{constellation.name}</span>
          <span className="text-white/30">·</span>
          <span>{constellation.aka}</span>
        </div>

        <div className="bg-[#050816]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-[#94A3B8]">
          {constellation.hemisphere} Sky
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#050816]/85 backdrop-blur-xl p-2.5 px-4 rounded-xl border border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showGrid
                ? 'bg-[#5DA9FF]/15 border-[#5DA9FF]/40 text-[#5DA9FF]'
                : 'bg-white/5 border-white/10 text-[#94A3B8]'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>RA / Dec Grid</span>
          </button>

          <button
            onClick={() => setShowGlow(!showGlow)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showGlow
                ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#8B5CF6]'
                : 'bg-white/5 border-white/10 text-[#94A3B8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stellar Halo</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-[#94A3B8] flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-[#5DA9FF]" />
          <span>{activeStar ? `Inspecting: ${activeStar}` : 'Hover a star to inspect'}</span>
        </div>
      </div>
    </div>
  );
};
