import React, { useEffect, useRef } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface FinalBrandingSceneProps {
  currentTime: number; // 53 to 60 (7 seconds total)
  startTime: number;   // 53
  duration: number;    // 7
  onReplay: () => void;
}

export const FinalBrandingScene: React.FC<FinalBrandingSceneProps> = ({
  currentTime,
  startTime,
  duration,
  onReplay,
}) => {
  const localTime = Math.max(0, Math.min(duration, currentTime - startTime));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const soundTriggered = useRef(false);

  // Transition from Pillars Summary (0 to 2.5s) to Personal Branding (2.5s to 7s)
  const isBrandingPhase = localTime >= 2.5;
  const brandingProgress = Math.max(0, (localTime - 2.5) / 4.5);

  // Trigger triumphant crescendo audio at branding reveal
  useEffect(() => {
    if (isBrandingPhase && !soundTriggered.current) {
      soundEngine.playCrescendoReveal();
      soundTriggered.current = true;
    } else if (localTime < 1.0) {
      soundTriggered.current = false;
    }
  }, [isBrandingPhase, localTime]);

  // Canvas Neural Network Constellation and Orbital Rings
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

    // Neural network nodes
    const nodeCount = 55;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2.5 + 1.2,
      color: Math.random() > 0.5 ? '#00f0ff' : '#8b5cf6',
    }));

    let tRing = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tRing += 0.015;

      const cx = width / 2;
      const cy = height / 2;

      // Draw neural constellation connections
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 130)})`;
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = n.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // If in branding phase, draw glowing cyan orbital rings surrounding center
      if (isBrandingPhase) {
        const ringAlpha = Math.min(1, brandingProgress * 1.5);
        ctx.save();
        ctx.translate(cx, cy);

        // Ring 1 (tilted ellipse 1)
        ctx.save();
        ctx.rotate(tRing * 0.6);
        ctx.beginPath();
        ctx.ellipse(0, 0, 260, 110, 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.45 * ringAlpha})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f0ff';
        ctx.stroke();

        // Orbiting particle on Ring 1
        const orb1X = 260 * Math.cos(tRing * 2);
        const orb1Y = 110 * Math.sin(tRing * 2);
        ctx.beginPath();
        ctx.arc(orb1X, orb1Y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        // Ring 2 (counter-rotating tilted ellipse 2)
        ctx.save();
        ctx.rotate(-tRing * 0.8);
        ctx.beginPath();
        ctx.ellipse(0, 0, 240, 130, -0.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.4 * ringAlpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#a855f7';
        ctx.stroke();

        // Orbiting particle on Ring 2
        const orb2X = 240 * Math.cos(-tRing * 2.2);
        const orb2Y = 130 * Math.sin(-tRing * 2.2);
        ctx.beginPath();
        ctx.arc(orb2X, orb2Y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#c084fc';
        ctx.fill();
        ctx.restore();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isBrandingPhase, brandingProgress]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* PHASE 1: Five Central Pillars Assembly (53.0s - 55.5s) */}
      {!isBrandingPhase && (
        <div className="z-10 flex flex-col items-center text-center max-w-4xl animate-fade-in">
          <div className="text-cyan-400 font-mono text-xs uppercase tracking-[0.3em] font-semibold mb-4">
            GRAND UNIFICATION OF CLASSICAL MECHANICS
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-6 text-xl sm:text-2xl md:text-3xl font-black font-['Outfit'] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-violet-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <span>MOTION</span>
            <span className="text-slate-600">·</span>
            <span>FORCES</span>
            <span className="text-slate-600">·</span>
            <span>ENERGY</span>
            <span className="text-slate-600">·</span>
            <span>MOMENTUM</span>
            <span className="text-slate-600">·</span>
            <span>ROTATION</span>
          </div>

          <p className="text-lg sm:text-2xl font-light text-slate-200 font-['Inter'] max-w-2xl leading-relaxed mt-4">
            “Physics I builds the rules of mechanics through interactions and motion.”
          </p>
        </div>
      )}

      {/* PHASE 2: Personal Branding Screen (55.5s - 60.0s) */}
      {isBrandingPhase && (
        <div
          className="z-10 flex flex-col items-center text-center max-w-3xl px-6 transition-all duration-700"
          style={{
            opacity: Math.min(1, brandingProgress * 1.5),
            transform: `scale(${0.92 + brandingProgress * 0.08})`,
          }}
        >
          {/* Futuristic Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/40 bg-cyan-950/50 backdrop-blur-md mb-6 shadow-[0_0_25px_rgba(0,240,255,0.3)]">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span className="text-xs font-mono tracking-[0.25em] text-cyan-300 uppercase font-semibold">
              Future of Autonomous Intelligence
            </span>
          </div>

          {/* Exact Name: HAMMAD */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-['Outfit'] tracking-tight text-white uppercase leading-none drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]">
            HAMMAD
          </h1>

          {/* Exact Subtitle: AI ENGINEER */}
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Space_Grotesk'] tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 uppercase drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
            AI ENGINEER
          </h2>

          {/* Exact Supporting Tagline */}
          <p className="mt-5 text-base sm:text-xl font-light text-slate-300 font-['Inter'] tracking-wide max-w-xl leading-relaxed">
            “Building Intelligent Systems. Automating the Future.”
          </p>

          {/* Interactive Replay / Action Dock */}
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={onReplay}
              className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-sm font-bold tracking-wider uppercase transition-all duration-200 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" />
              <span>Replay 60s Journey</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
