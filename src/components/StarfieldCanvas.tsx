import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export const StarfieldCanvas: React.FC<{ density?: number }> = ({ density = 150 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const colors = ['#FFFFFF', '#E0F2FE', '#BAE6FD', '#DDD6FE', '#FEF08A'];
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 10000) * (density / 100);
      for (let i = 0; i < count; i++) {
        const baseAlpha = 0.2 + Math.random() * 0.7;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() < 0.85 ? Math.random() * 1.2 + 0.3 : Math.random() * 2 + 1.2,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: 0.005 + Math.random() * 0.02,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initStars();

    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      opacity: 0,
      active: false,
    };

    const triggerShootingStar = () => {
      shootingStar = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: 80 + Math.random() * 60,
        speed: 12 + Math.random() * 8,
        angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
        opacity: 1,
        active: true,
      };
    };

    let timer = window.setInterval(() => {
      if (!shootingStar.active && Math.random() < 0.4) {
        triggerShootingStar();
      }
    }, 4500);

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Soft nebula background glow
      const grad = ctx.createRadialGradient(width * 0.7, height * 0.3, 10, width * 0.7, height * 0.3, width * 0.6);
      grad.addColorStop(0, 'rgba(93, 169, 255, 0.04)');
      grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)');
      grad.addColorStop(1, 'rgba(5, 8, 22, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      for (const s of stars) {
        s.alpha = s.baseAlpha + Math.sin(tick * s.twinkleSpeed) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(1, s.alpha));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.fill();

        // Subtle glow around brighter stars
        if (s.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = clampedAlpha * 0.15;
          ctx.fill();
        }
      }

      // Render shooting star
      if (shootingStar.active) {
        ctx.save();
        ctx.beginPath();
        const endX = shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.length;
        const endY = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length;

        const lineGrad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY);
        lineGrad.addColorStop(0, `rgba(255, 255, 255, 0)`);
        lineGrad.addColorStop(1, `rgba(224, 242, 254, ${shootingStar.opacity})`);

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        }
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearInterval(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
};
