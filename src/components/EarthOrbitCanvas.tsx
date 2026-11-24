import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Wind, Shield, Orbit } from 'lucide-react';

interface SolarParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export const EarthOrbitCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showSolarWind, setShowSolarWind] = useState<boolean>(true);
  const [showMagnetosphere, setShowMagnetosphere] = useState<boolean>(true);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId: number;
    let tick = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const particles: SolarParticle[] = Array.from({ length: 65 }, (_, idx) => ({
      x: (idx * 23) % 900,
      y: Math.random() * 440,
      vx: 1.8 + Math.random() * 1.4,
      vy: 0,
      size: 1.2 + Math.random() * 1.5,
      alpha: 0.35 + Math.random() * 0.55,
    }));

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      if (isPlaying && !prefersReducedMotion) {
        tick += 0.016;
      }

      // Deep space background
      const bg = ctx.createRadialGradient(w * 0.42, h * 0.5, 20, w * 0.42, h * 0.5, w * 0.75);
      bg.addColorStop(0, '#0C1738');
      bg.addColorStop(0.55, '#070C1E');
      bg.addColorStop(1, '#040612');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const earthX = w * 0.46;
      const earthY = h * 0.52;
      const earthR = Math.min(w, h) * 0.16;

      // Subtle solar illumination glow from left
      const sunGlow = ctx.createRadialGradient(0, earthY, 10, 0, earthY, w * 0.52);
      sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
      sunGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.04)');
      sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, w, h);

      // Magnetosphere bow shock & dipolar field lines
      if (showMagnetosphere) {
        ctx.save();
        // Bow shock parabola
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.38)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        const shockNoseX = earthX - earthR * 2.05;
        ctx.moveTo(earthX + earthR * 3.8, earthY - earthR * 2.9);
        ctx.quadraticCurveTo(shockNoseX - earthR * 0.55, earthY, earthX + earthR * 3.8, earthY + earthR * 2.9);
        ctx.stroke();

        // Inner magnetospheric lobes
        ctx.setLineDash([]);
        for (let lobe = 1; lobe <= 2; lobe++) {
          const lobeScale = lobe * 0.9 + 0.5;
          ctx.strokeStyle = lobe === 1 ? 'rgba(93, 169, 255, 0.32)' : 'rgba(139, 92, 246, 0.24)';
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.ellipse(earthX, earthY - earthR * lobeScale * 0.48, earthR * lobeScale * 1.15, earthR * lobeScale * 0.65, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(earthX, earthY + earthR * lobeScale * 0.48, earthR * lobeScale * 1.15, earthR * lobeScale * 0.65, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Solar wind deflection animation
      if (showSolarWind) {
        const bowX = earthX - earthR * 1.7;
        for (const p of particles) {
          if (isPlaying && !prefersReducedMotion) {
            p.x += p.vx;
            const dy = p.y - earthY;
            const distToCenter = Math.hypot(p.x - earthX, dy);
            if (p.x > bowX && p.x < earthX + earthR * 2.5 && distToCenter < earthR * 2.35) {
              p.vy = (dy >= 0 ? 1 : -1) * Math.max(0.7, (earthR * 2.35 - distToCenter) * 0.025);
            } else {
              p.vy *= 0.94;
            }
            p.y += p.vy;

            if (p.x > w + 10 || p.y < -10 || p.y > h + 10) {
              p.x = -10;
              p.y = earthY + (Math.random() - 0.5) * h * 0.85;
              p.vy = 0;
            }
          }

          ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(251, 191, 36, ${p.alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x - 10, p.y - p.vy * 1.5);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      // Orbit rings for ISS and Moon
      if (showOrbits) {
        // LEO / ISS ring
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(earthX, earthY, earthR * 1.48, earthR * 1.15, -0.25, 0, Math.PI * 2);
        ctx.stroke();

        const issAngle = tick * 1.9;
        const issX = earthX + Math.cos(issAngle) * earthR * 1.48 * Math.cos(-0.25) - Math.sin(issAngle) * earthR * 1.15 * Math.sin(-0.25);
        const issY = earthY + Math.cos(issAngle) * earthR * 1.48 * Math.sin(-0.25) + Math.sin(issAngle) * earthR * 1.15 * Math.cos(-0.25);

        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(issX, issY, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#BAE6FD';
        ctx.fillText('ISS', issX + 7, issY + 3);

        // Moon orbit
        const moonOrbitR = Math.min(w, h) * 0.38;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(earthX, earthY, moonOrbitR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        const moonAngle = tick * 0.42 - 0.6;
        const moonX = earthX + Math.cos(moonAngle) * moonOrbitR;
        const moonY = earthY + Math.sin(moonAngle) * moonOrbitR;
        ctx.fillStyle = '#CBD5E1';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('LUNA', moonX + 10, moonY + 3);
        ctx.restore();
      }

      // Earth atmospheric outer glow
      const atmoGlow = ctx.createRadialGradient(earthX, earthY, earthR * 0.85, earthX, earthY, earthR * 1.35);
      atmoGlow.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      atmoGlow.addColorStop(0.5, 'rgba(93, 169, 255, 0.16)');
      atmoGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = atmoGlow;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Earth sphere clipped with rotating 2D continents + day/night terminator
      ctx.save();
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
      ctx.clip();

      // Ocean gradient
      const ocean = ctx.createLinearGradient(earthX - earthR, earthY, earthX + earthR, earthY);
      ocean.addColorStop(0, '#1D7ED8');
      ocean.addColorStop(0.55, '#0F4C81');
      ocean.addColorStop(1, '#071733');
      ctx.fillStyle = ocean;
      ctx.fillRect(earthX - earthR, earthY - earthR, earthR * 2, earthR * 2);

      // Animated scrolling landmass bands (2D cylindrical projection drift)
      const drift = (tick * 22) % (earthR * 4);
      ctx.fillStyle = 'rgba(52, 211, 153, 0.42)';
      const blobs = [
        { ox: -0.6, oy: -0.25, rx: 0.36, ry: 0.24 },
        { ox: 0.15, oy: 0.1, rx: 0.28, ry: 0.32 },
        { ox: 0.95, oy: -0.15, rx: 0.35, ry: 0.28 },
        { ox: 1.75, oy: 0.22, rx: 0.25, ry: 0.18 },
      ];
      for (const b of blobs) {
        for (const wrap of [0, -earthR * 4, earthR * 4]) {
          const bx = earthX + b.ox * earthR + drift + wrap;
          const by = earthY + b.oy * earthR;
          ctx.beginPath();
          ctx.ellipse(bx, by, earthR * b.rx, earthR * b.ry, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Cloud bands
      ctx.fillStyle = 'rgba(248, 250, 252, 0.22)';
      const cloudDrift = (tick * 31) % (earthR * 4);
      for (let c = 0; c < 4; c++) {
        const cx = earthX - earthR * 1.2 + ((c * earthR * 0.95 + cloudDrift) % (earthR * 3.5)) - earthR * 0.6;
        const cy = earthY + (c - 1.5) * earthR * 0.36;
        ctx.beginPath();
        ctx.ellipse(cx, cy, earthR * 0.45, earthR * 0.08, -0.08, 0, Math.PI * 2);
        ctx.fill();
      }

      // Polar ice caps
      ctx.fillStyle = 'rgba(241, 245, 249, 0.72)';
      ctx.beginPath();
      ctx.ellipse(earthX, earthY - earthR * 0.92, earthR * 0.55, earthR * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(earthX, earthY + earthR * 0.94, earthR * 0.5, earthR * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Night hemisphere terminator shadow
      const shadow = ctx.createLinearGradient(earthX - earthR * 0.15, earthY, earthX + earthR, earthY);
      shadow.addColorStop(0, 'rgba(4, 8, 22, 0)');
      shadow.addColorStop(0.55, 'rgba(4, 8, 22, 0.45)');
      shadow.addColorStop(1, 'rgba(2, 4, 14, 0.92)');
      ctx.fillStyle = shadow;
      ctx.fillRect(earthX - earthR, earthY - earthR, earthR * 2, earthR * 2);

      // Polar Aurora ovals
      const auroraPulse = 0.45 + Math.sin(tick * 3) * 0.15;
      ctx.strokeStyle = `rgba(52, 211, 153, ${auroraPulse})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(earthX, earthY - earthR * 0.82, earthR * 0.34, earthR * 0.09, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // Axial tilt 23.44 deg line
      ctx.save();
      ctx.translate(earthX, earthY);
      ctx.rotate((23.44 * Math.PI) / 180);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, -earthR * 1.32);
      ctx.lineTo(0, earthR * 1.32);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, showSolarWind, showMagnetosphere, showOrbits]);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#050816]">
      <div className="relative w-full h-[360px] lg:h-[420px]">
        <canvas ref={canvasRef} className="w-full h-full block" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] font-mono text-[#CBD5E1]">
          <span className="bg-[#050816]/80 px-3 py-1.5 rounded-lg border border-white/10">
            2D Geodynamic & Magnetosphere Simulation
          </span>
          <span className="bg-[#050816]/80 px-3 py-1.5 rounded-lg border border-white/10 tabular-nums hidden sm:inline">
            Axial Tilt 23.44° · L1 Solar Wind Active
          </span>
        </div>
      </div>

      {/* Interactive Layer Controls */}
      <div className="px-4 py-3 bg-[#070B1C] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#5DA9FF]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#5DA9FF]" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowSolarWind(!showSolarWind)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              showSolarWind
                ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-[#94A3B8]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Solar Wind</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMagnetosphere(!showMagnetosphere)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              showMagnetosphere
                ? 'bg-[#5DA9FF]/15 border-[#5DA9FF]/40 text-[#5DA9FF]'
                : 'bg-white/5 border-white/10 text-[#94A3B8]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Magnetosphere</span>
          </button>

          <button
            type="button"
            onClick={() => setShowOrbits(!showOrbits)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              showOrbits
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-[#94A3B8]'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>ISS & Moon</span>
          </button>
        </div>

        <span className="text-[11px] text-[#94A3B8]">Real-time 2D Canvas Geodynamo</span>
      </div>
    </div>
  );
};
