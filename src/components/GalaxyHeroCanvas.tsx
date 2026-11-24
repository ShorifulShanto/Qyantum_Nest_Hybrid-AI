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

export const GalaxyHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const particleCount = 700;
    const particles: GalaxyParticle[] = [];
    const colors = ['#38BDF8', '#8B5CF6', '#F472B6', '#E0E7FF', '#FBBF24', '#FFFFFF'];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 320 + 5;
      const arm = Math.floor(Math.random() * 2) * Math.PI; // 2 spiral arms
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        angle,
        radius,
        arm,
        size: Math.random() * 1.8 + 0.4,
        speed: (1 / (radius + 20)) * 14,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      rotation += 0.0018;

      const centerX = w * 0.65;
      const centerY = h * 0.5;

      // Galaxy core glow
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 140);
      coreGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      coreGrad.addColorStop(0.3, 'rgba(139, 92, 246, 0.25)');
      coreGrad.addColorStop(1, 'rgba(5, 8, 22, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
      ctx.fill();

      // Render orbiting spiral arms
      for (const p of particles) {
        p.angle += p.speed * 0.012;
        const currentAngle = p.angle + rotation + p.radius * 0.003;
        
        // Logarithmic spiral offset
        const spiralDist = p.radius;
        const x = centerX + Math.cos(currentAngle) * spiralDist;
        const y = centerY + Math.sin(currentAngle) * spiralDist * 0.55; // Elliptical perspective tilt

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (1 - p.radius / 340);
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
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
