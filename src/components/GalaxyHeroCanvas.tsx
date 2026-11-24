import React, { useEffect, useRef } from 'react';

interface GalaxyParticle {
  angle: number;
  radius: number;
  arm: number;
  size: number;
  speed: number;
  color: string;
  alpha: number;
}

interface TwinkleStar {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export const GalaxyHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;
    let time = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Create Milky Way spiral particles
    const particleCount = 1200;
    const particles: GalaxyParticle[] = [];
    const colors = [
      '#38BDF8', // Cyan
      '#818CF8', // Indigo
      '#C084FC', // Purple
      '#F472B6', // Pink
      '#FBBF24', // Gold
      '#FFFFFF', // White
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 450 + 10;
      // 4 distinct spiral arms
      const armIndex = Math.floor(Math.random() * 4);
      const arm = (armIndex * Math.PI * 2) / 4;
      const angle = Math.random() * Math.PI * 2;
      
      particles.push({
        angle,
        radius,
        arm,
        size: Math.random() * 2.2 + 0.5,
        speed: (1 / (radius + 30)) * 18,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    // Create background twinkling stars
    const starCount = 200;
    const backgroundStars: TwinkleStar[] = [];
    for (let i = 0; i < starCount; i++) {
      backgroundStars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      time += 0.015;
      rotation += 0.0012;

      const centerX = w * 0.68;
      const centerY = h * 0.52;

      // Render background twinkling starfield
      for (const s of backgroundStars) {
        const currentAlpha = 0.2 + 0.8 * Math.abs(Math.sin(time * s.twinkleSpeed * 20 + s.twinkleOffset));
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = currentAlpha * 0.6;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulsing Milky Way core calculation
      const pulseFactor = 1 + Math.sin(time * 1.5) * 0.12;
      const coreRadius = 160 * pulseFactor;

      // Multi-layer volumetric core gradients
      const outerGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, coreRadius * 2.2);
      outerGlow.addColorStop(0, 'rgba(147, 51, 234, 0.35)');
      outerGlow.addColorStop(0.4, 'rgba(56, 189, 248, 0.18)');
      outerGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      const innerCore = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, coreRadius);
      innerCore.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      innerCore.addColorStop(0.2, 'rgba(251, 191, 36, 0.75)');
      innerCore.addColorStop(0.6, 'rgba(236, 72, 153, 0.35)');
      innerCore.addColorStop(1, 'rgba(126, 34, 206, 0)');
      ctx.fillStyle = innerCore;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Render orbiting spiral arms
      for (const p of particles) {
        p.angle += p.speed * 0.015;
        // Logarithmic spiral angle calculation with arm offset
        const currentAngle = p.angle + rotation + p.arm + (p.radius * 0.0025);
        
        const spiralDist = p.radius;
        const x = centerX + Math.cos(currentAngle) * spiralDist;
        const y = centerY + Math.sin(currentAngle) * spiralDist * 0.52; // Elliptical tilt for galaxy perspective

        const distFromCenter = Math.hypot(x - centerX, (y - centerY) * 1.8);
        const fade = Math.max(0, 1 - distFromCenter / 480);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * fade * (0.8 + 0.2 * Math.sin(time + p.radius));
        ctx.beginPath();
        ctx.arc(x, y, p.size * (p.radius < 80 ? pulseFactor : 1), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 hero-overlay" />
    </div>
  );
};
