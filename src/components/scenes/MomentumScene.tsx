import React, { useEffect, useRef } from 'react';
import { MathFormula } from '../MathFormula';
import { soundEngine } from '../../audio/soundEngine';

interface MomentumSceneProps {
  currentTime: number; // 34 to 41
  startTime: number;   // 34
  duration: number;    // 7
}

export const MomentumScene: React.FC<MomentumSceneProps> = ({
  currentTime,
  startTime,
  duration,
}) => {
  const localTime = Math.max(0, Math.min(duration, currentTime - startTime));
  const progress = localTime / duration;
  const soundTriggered = useRef(false);

  // Masses: m1 = 4.0 kg, m2 = 2.0 kg
  // Initial velocities: v1i = +6.0 m/s, v2i = -6.0 m/s
  // Total initial momentum: P_sys = 4.0 * 6.0 + 2.0 * (-6.0) = 24 - 12 = +12.0 kg*m/s
  const m1 = 4.0;
  const m2 = 2.0;
  const v1i = 6.0;
  const v2i = -6.0;
  const pTotal = m1 * v1i + m2 * v2i; // +12.0 kg m/s

  // Elastic collision final velocities:
  // v1f = ((m1 - m2) / (m1 + m2)) * v1i + ((2 * m2) / (m1 + m2)) * v2i
  // v1f = (2/6) * 6 + (4/6) * (-6) = 2 - 4 = -2.0 m/s
  // v2f = ((2 * m1) / (m1 + m2)) * v1i + ((m2 - m1) / (m1 + m2)) * v2i
  // v2f = (8/6) * 6 + (-2/6) * (-6) = 8 + 2 = +10.0 m/s
  const v1f = -2.0;
  const v2f = 10.0;
  // Verification: P_final = 4.0 * (-2.0) + 2.0 * (10.0) = -8 + 20 = +12.0 kg*m/s (Conserved!)

  // Collision happens at t = 3.2s into the 7-second scene (progress ~ 0.457)
  const collisionProgress = 0.45;
  const isPreCollision = progress < collisionProgress;
  const isImpact = Math.abs(progress - collisionProgress) < 0.05;

  // Trigger impact sound once
  useEffect(() => {
    if (isImpact && !soundTriggered.current) {
      soundEngine.playImpactBoom();
      soundTriggered.current = true;
    } else if (progress < 0.2) {
      soundTriggered.current = false;
    }
  }, [isImpact, progress]);

  // SVG Positions
  const centerX = 460;
  const yAxis = 210;
  let pos1X: number;
  let pos2X: number;
  let currentV1: number;
  let currentV2: number;

  if (isPreCollision) {
    const approachFraction = progress / collisionProgress;
    pos1X = 140 + approachFraction * (centerX - 45 - 140);
    pos2X = 780 - approachFraction * (780 - (centerX + 45));
    currentV1 = v1i;
    currentV2 = v2i;
  } else {
    const postFraction = (progress - collisionProgress) / (1 - collisionProgress);
    pos1X = (centerX - 45) + postFraction * (-220);
    pos2X = (centerX + 45) + postFraction * 320;
    currentV1 = v1f;
    currentV2 = v2f;
  }

  const p1 = m1 * currentV1;
  const p2 = m2 * currentV2;

  // Impact flash expansion
  const flashRadius = isImpact ? (0.05 - Math.abs(progress - collisionProgress)) * 1400 : 0;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Header Info */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>SCENE 06 / 08 · IMPULSE & CONSERVATION OF MOMENTUM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Elastic Collision & Impulse Exchange (p = mv)
          </h2>
        </div>

        {/* Live Momentum HUD */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-2 font-mono text-xs shadow-lg backdrop-blur-md">
          <div>
            <span className="text-slate-400">Total P: </span>
            <span className="text-emerald-400 font-bold">+{pTotal.toFixed(1)} kg·m/s (CONSERVED)</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">p₁: </span>
            <span className="text-cyan-300 font-bold">{p1 > 0 ? `+${p1.toFixed(1)}` : p1.toFixed(1)}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">p₂: </span>
            <span className="text-violet-300 font-bold">{p2 > 0 ? `+${p2.toFixed(1)}` : p2.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Main Collision Arena SVG */}
      <div className="relative flex-1 w-full my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 920 420"
          className="w-full h-full max-h-[440px] overflow-visible drop-shadow-[0_0_30px_rgba(0,0,0,0.85)]"
        >
          <defs>
            <marker id="arrow-p1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#00f0ff" />
            </marker>
            <marker id="arrow-p2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc" />
            </marker>
            <filter id="glow-sphere" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Linear Rail Guideline */}
          <line x1="80" y1={yAxis} x2="840" y2={yAxis} stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
          <line x1={centerX} y1={yAxis - 80} x2={centerX} y2={yAxis + 80} stroke="rgba(245,158,11,0.2)" strokeDasharray="4 4" />
          <text x={centerX} y={yAxis - 90} fill="#f59e0b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
            Impact Point (Δt → 0)
          </text>

          {/* Impact Shockwave Ring (Triggers at collision) */}
          {flashRadius > 0 && (
            <g>
              <circle
                cx={centerX}
                cy={yAxis}
                r={flashRadius}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4"
                opacity={0.8}
              />
              <circle
                cx={centerX}
                cy={yAxis}
                r={flashRadius * 0.5}
                fill="rgba(255,255,255,0.4)"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text x={centerX} y={yAxis + 100} fill="#fbbf24" fontSize="14" fontWeight="bold" fontFamily="Space Grotesk" textAnchor="middle">
                IMPULSE J = Δp = ∫ F dt
              </text>
            </g>
          )}

          {/* Sphere 1 (Mass m1 = 4.0 kg, Cyan) */}
          <g>
            <circle
              cx={pos1X}
              cy={yAxis}
              r="34"
              fill="rgba(10, 25, 45, 0.9)"
              stroke="#00f0ff"
              strokeWidth="3.5"
              filter="url(#glow-sphere)"
            />
            <text x={pos1X} y={yAxis - 5} fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="Space Grotesk" textAnchor="middle">
              m₁ = {m1}kg
            </text>
            <text x={pos1X} y={yAxis + 14} fill="#00f0ff" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
              {currentV1 > 0 ? `+${currentV1.toFixed(1)}` : currentV1.toFixed(1)} m/s
            </text>

            {/* Momentum Vector Arrow for Sphere 1 */}
            <line
              x1={pos1X}
              y1={yAxis - 55}
              x2={pos1X + currentV1 * 12}
              y2={yAxis - 55}
              stroke="#00f0ff"
              strokeWidth="3"
              markerEnd="url(#arrow-p1)"
            />
            <text x={pos1X + currentV1 * 6} y={yAxis - 65} fill="#00f0ff" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
              p₁ = {p1 > 0 ? `+${p1.toFixed(1)}` : p1.toFixed(1)}
            </text>
          </g>

          {/* Sphere 2 (Mass m2 = 2.0 kg, Violet) */}
          <g>
            <circle
              cx={pos2X}
              cy={yAxis}
              r="25"
              fill="rgba(25, 10, 45, 0.9)"
              stroke="#c084fc"
              strokeWidth="3.5"
              filter="url(#glow-sphere)"
            />
            <text x={pos2X} y={yAxis - 4} fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="Space Grotesk" textAnchor="middle">
              m₂ = {m2}kg
            </text>
            <text x={pos2X} y={yAxis + 14} fill="#c084fc" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
              {currentV2 > 0 ? `+${currentV2.toFixed(1)}` : currentV2.toFixed(1)} m/s
            </text>

            {/* Momentum Vector Arrow for Sphere 2 */}
            <line
              x1={pos2X}
              y1={yAxis - 55}
              x2={pos2X + currentV2 * 12}
              y2={yAxis - 55}
              stroke="#c084fc"
              strokeWidth="3"
              markerEnd="url(#arrow-p2)"
            />
            <text x={pos2X + currentV2 * 6} y={yAxis - 65} fill="#c084fc" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
              p₂ = {p2 > 0 ? `+${p2.toFixed(1)}` : p2.toFixed(1)}
            </text>
          </g>

          {/* Elastic vs Inelastic Callout (Bottom Right) */}
          <g transform="translate(670, 310)">
            <rect x="-10" y="-10" width="230" height="75" rx="8" fill="rgba(15,23,42,0.85)" stroke="rgba(245,158,11,0.3)" />
            <text x="105" y="14" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
              ELASTIC VS INELASTIC
            </text>
            <text x="105" y="34" fill="#10b981" fontSize="11" fontFamily="Inter" textAnchor="middle">
              Elastic: Kinetic Energy Conserved
            </text>
            <text x="105" y="52" fill="#94a3b8" fontSize="10" fontFamily="Inter" textAnchor="middle">
              Momentum always conserved in isolation!
            </text>
          </g>
        </svg>
      </div>

      {/* Equations Strip (Bottom) */}
      <div className="z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MathFormula
          latex="\vec{p} = m \vec{v}"
          label="Linear Momentum"
          unit="kg·m/s"
          glowColor="#00f0ff"
          highlight={progress < 0.35}
        />
        <MathFormula
          latex="\vec{J} = \Delta \vec{p} = \int \vec{F}\,dt"
          label="Impulse Theorem"
          unit="N·s"
          glowColor="#f59e0b"
          highlight={progress >= 0.35 && progress < 0.65}
        />
        <MathFormula
          latex="\vec{p}_{\text{before}} = \vec{p}_{\text{after}}"
          label="Momentum Conservation"
          unit="kg·m/s"
          glowColor="#10b981"
          highlight={progress >= 0.65}
        />
      </div>
    </div>
  );
};
