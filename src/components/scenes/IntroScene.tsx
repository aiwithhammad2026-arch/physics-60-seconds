import React, { useEffect, useRef } from 'react';
import { MathFormula } from '../MathFormula';

interface IntroSceneProps {
  currentTime: number; // 0 to 4
  duration: number;    // 4
}

export const IntroScene: React.FC<IntroSceneProps> = ({ currentTime, duration }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Normalized progress from 0 to 1
  const progress = Math.min(1, Math.max(0, currentTime / duration));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1280);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 720);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 120;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 1000 + 100,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? '#00f0ff' : '#8b5cf6',
      speed: Math.random() * 2 + 1,
    }));

    const render = () => {
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 3D Perspective Coordinate Grid emerging from darkness
      const fov = 350;
      const gridZoom = 1 + progress * 0.8; // Flythrough zoom
      const gridOpacity = Math.min(1, progress * 2.5);

      ctx.save();
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * gridOpacity})`;
      ctx.lineWidth = 1;

      // Draw horizon and 3D perspective lines
      const horizonY = cy + 120;
      const vanishingX = cx;
      const vanishingY = cy - 40;

      for (let i = -12; i <= 12; i++) {
        const xFloor = cx + i * 90 * gridZoom;
        ctx.beginPath();
        ctx.moveTo(vanishingX, vanishingY);
        ctx.lineTo(xFloor, height);
        ctx.stroke();
      }

      // Horizontal depth lines
      for (let d = 1; d <= 12; d++) {
        const depth = (d * 35 * gridZoom) % 400;
        const lineY = horizonY + (depth * depth) / 450;
        if (lineY <= height) {
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(width, lineY);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Draw floating scientific particles with 3D projection
      particles.forEach((p) => {
        p.z -= p.speed * 4 * (1 + progress * 2);
        if (p.z <= 10) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * width * 1.5;
          p.y = (Math.random() - 0.5) * height * 1.5;
        }

        const k = fov / p.z;
        const px = cx + p.x * k;
        const py = cy + p.y * k;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, (1000 - p.z) / 600);
          ctx.beginPath();
          ctx.arc(px, py, p.size * k * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.8;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      });

      // Ambient radial center glow
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.6);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
      grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
      grad.addColorStop(1, 'rgba(5, 7, 15, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [progress]);

  // Cinematic sweep position across the title (from -20% to 120%)
  const sweepPercent = progress * 140 - 20;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Background Equations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-12 left-16 opacity-30 transition-all duration-1000"
          style={{ transform: `translateY(${progress * -20}px) scale(${0.9 + progress * 0.1})` }}
        >
          <MathFormula latex="\sum \vec{F} = m\vec{a}" size="sm" glowColor="#38bdf8" />
        </div>
        <div
          className="absolute bottom-28 left-20 opacity-30 transition-all duration-1000"
          style={{ transform: `translateY(${progress * 15}px)` }}
        >
          <MathFormula latex="E = \frac{1}{2}mv^2 + mgh" size="sm" glowColor="#10b981" />
        </div>
        <div
          className="absolute top-16 right-20 opacity-30 transition-all duration-1000"
          style={{ transform: `translateY(${progress * -15}px)` }}
        >
          <MathFormula latex="\vec{p} = m\vec{v}" size="sm" glowColor="#f59e0b" />
        </div>
        <div
          className="absolute bottom-32 right-24 opacity-30 transition-all duration-1000"
          style={{ transform: `translateY(${progress * 25}px)` }}
        >
          <MathFormula latex="\tau = r F \sin\theta" size="sm" glowColor="#ec4899" />
        </div>
      </div>

      {/* Main Center Cinematic Title */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
        style={{
          transform: `scale(${0.92 + progress * 0.12})`,
          opacity: progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1,
          transition: 'transform 0.1s linear',
        }}
      >
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] font-mono tracking-[0.25em] text-cyan-300 uppercase font-semibold">
            60-Second Classical Mechanics Expedition
          </span>
        </div>

        {/* Master Heading with Cyan Light Sweep */}
        <div className="relative overflow-hidden py-2 px-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight font-['Outfit'] text-white uppercase leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            ALL OF PHYSICS I
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-400">
              IN 60 SECONDS
            </span>
          </h1>

          {/* Bright Cyan Light Sweep Beam */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.7) ${sweepPercent}%, rgba(255, 255, 255, 0.9) ${
                sweepPercent + 5
              }%, transparent ${sweepPercent + 15}%)`,
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl md:text-2xl font-light text-slate-300 tracking-wide font-['Inter'] max-w-2xl drop-shadow-md">
          “The Universe. Motion. Energy. Everything Connected.”
        </p>

        {/* Cinematic Launch Status Indicator */}
        <div className="mt-8 flex items-center gap-6 font-mono text-xs text-slate-400 tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Timeline Active: 00:00 - 01:00</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>Classical Mechanics Core</div>
        </div>
      </div>
    </div>
  );
};
