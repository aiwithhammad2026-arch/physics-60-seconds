import React from 'react';
import { MathFormula } from '../MathFormula';

interface NewtonLawsSceneProps {
  currentTime: number; // 12 to 20
  startTime: number;   // 12
  duration: number;    // 8
}

export const NewtonLawsScene: React.FC<NewtonLawsSceneProps> = ({
  currentTime,
  startTime,
  duration,
}) => {
  const localTime = Math.max(0, Math.min(duration, currentTime - startTime));
  const progress = localTime / duration;

  // Physical mass and force dynamics simulation:
  // Mass m = 5 kg, g = 9.8 m/s^2 => Weight W = 49 N, Normal N = 49 N
  // mu_k = 0.25 => f_k = 0.25 * 49 = 12.25 N
  const mass = 5.0;
  const g = 9.8;
  const weight = mass * g; // 49 N
  const normal = weight;   // 49 N
  const mu_k = 0.25;
  const friction = mu_k * normal; // 12.25 N

  // Applied force profile over the 8 seconds:
  // 0-2s: Equilibrium (F_app = 0, stationary, 1st Law)
  // 2-5s: Active Push (F_app = 35 N > f_k, net force = 22.75 N, accelerates)
  // 5-8s: Push Released (F_app = 0, friction decelerates box to rest, 3rd law highlight)
  let fApp = 0;
  let netForce = 0;
  let accel = 0;
  let boxPxX = 220; // baseline horizontal position in SVG

  if (progress < 0.25) {
    // Stage 1: Equilibrium
    fApp = 0;
    netForce = 0;
    accel = 0;
    boxPxX = 220;
  } else if (progress < 0.65) {
    // Stage 2: Acceleration under unbalanced force
    const stageProgress = (progress - 0.25) / 0.4;
    fApp = 38.0;
    netForce = fApp - friction;
    accel = netForce / mass; // ~ 5.15 m/s^2
    boxPxX = 220 + stageProgress * stageProgress * 320;
  } else {
    // Stage 3: Coasting and stopping with friction
    const stageProgress = (progress - 0.65) / 0.35;
    fApp = 0;
    netForce = -friction;
    accel = -friction / mass;
    boxPxX = 540 + (1 - Math.pow(1 - stageProgress, 2)) * 140;
  }

  // Active law step
  const activeStep = progress < 0.3 ? 1 : progress < 0.7 ? 2 : 3;

  // Vector lengths
  const vectorScale = 2.2;
  const normalLen = normal * vectorScale * 0.75;
  const weightLen = weight * vectorScale * 0.75;
  const fAppLen = fApp * vectorScale * 1.5;
  const frictionLen = friction * vectorScale * 2.0;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Header Info */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-mono text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span>SCENE 03 / 08 · DYNAMICS & FORCES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Newton’s Laws of Motion & Friction
          </h2>
        </div>

        {/* Live Force Telemetry HUD */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-2 font-mono text-xs shadow-lg backdrop-blur-md">
          <div>
            <span className="text-slate-400">m: </span>
            <span className="text-white font-bold">{mass.toFixed(1)} kg</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">F_net: </span>
            <span className={`font-bold ${netForce > 0 ? 'text-violet-400' : netForce < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {netForce.toFixed(1)} N
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">a: </span>
            <span className="text-cyan-300 font-bold">{accel.toFixed(2)} m/s²</span>
          </div>
        </div>
      </div>

      {/* Main Free Body Diagram Simulation Area */}
      <div className="relative flex-1 w-full my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 920 440"
          className="w-full h-full max-h-[460px] overflow-visible drop-shadow-[0_0_25px_rgba(0,0,0,0.85)]"
        >
          <defs>
            <marker id="arrow-n" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="arrow-w" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#00f0ff" />
            </marker>
            <marker id="arrow-fapp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc" />
            </marker>
            <marker id="arrow-fric" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-net" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
            </marker>

            <pattern id="surface-hatch" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* Test Track Surface with Microscopic Texture */}
          <line x1="60" y1="290" x2="860" y2="290" stroke="#475569" strokeWidth="3" />
          <rect x="60" y="291" width="800" height="25" fill="url(#surface-hatch)" />
          <text x="70" y="332" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
            Contact Surface (Friction Coefficient μ_k = {mu_k})
          </text>

          {/* The Sliding Test Block (Center of Mass at (boxPxX, 240)) */}
          <g transform={`translate(${boxPxX - 55}, 190)`}>
            {/* Box Body */}
            <rect
              width="110"
              height="100"
              rx="10"
              fill="rgba(15, 23, 42, 0.9)"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              filter="drop-shadow(0 0 15px rgba(139, 92, 246, 0.3))"
            />
            {/* Mass Label */}
            <text x="55" y="45" fill="#f8fafc" fontSize="15" fontWeight="bold" fontFamily="Space Grotesk" textAnchor="middle">
              MASS
            </text>
            <text x="55" y="68" fill="#c084fc" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle">
              m = {mass} kg
            </text>
            {/* Center of Mass Dot */}
            <circle cx="55" cy="50" r="3.5" fill="#00f0ff" />
          </g>

          {/* Free Body Diagram Vectors Emerging from Center of Mass (boxPxX, 240) */}
          {/* 1. Normal Force N (Upward) */}
          <line
            x1={boxPxX}
            y1="240"
            x2={boxPxX}
            y2={240 - normalLen}
            stroke="#10b981"
            strokeWidth="3.5"
            markerEnd="url(#arrow-n)"
          />
          <text x={boxPxX + 12} y={240 - normalLen + 15} fill="#10b981" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">
            N = mg ({normal.toFixed(0)} N)
          </text>

          {/* 2. Weight / Gravity W = mg (Downward) */}
          <line
            x1={boxPxX}
            y1="240"
            x2={boxPxX}
            y2={240 + weightLen}
            stroke="#00f0ff"
            strokeWidth="3.5"
            markerEnd="url(#arrow-w)"
          />
          <text x={boxPxX + 12} y={240 + weightLen - 5} fill="#00f0ff" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">
            W = mg ({weight.toFixed(0)} N)
          </text>

          {/* 3. Applied Force F_app (Rightward) */}
          {fApp > 0 && (
            <g>
              <line
                x1={boxPxX}
                y1="240"
                x2={boxPxX + fAppLen}
                y2="240"
                stroke="#c084fc"
                strokeWidth="4"
                markerEnd="url(#arrow-fapp)"
              />
              <text x={boxPxX + fAppLen + 10} y="244" fill="#c084fc" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">
                F_app ({fApp.toFixed(0)} N)
              </text>
            </g>
          )}

          {/* 4. Kinetic Friction f_k = mu_k * N (Leftward opposing motion) */}
          {frictionLen > 0 && (
            <g>
              <line
                x1={boxPxX}
                y1="290"
                x2={boxPxX - frictionLen}
                y2="290"
                stroke="#f59e0b"
                strokeWidth="3.5"
                markerEnd="url(#arrow-fric)"
              />
              <text x={boxPxX - frictionLen - 10} y="294" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="end">
                f_k = μ_k N ({friction.toFixed(1)} N)
              </text>
            </g>
          )}

          {/* 5. Net Force Indicator (When unbalanced) */}
          {Math.abs(netForce) > 1 && (
            <g transform={`translate(${boxPxX}, 130)`}>
              <rect x="-60" y="-18" width="120" height="32" rx="6" fill="rgba(15,23,42,0.85)" stroke="#a855f7" strokeWidth="1.5" />
              <text x="0" y="3" fill="#e9d5ff" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                ΣF = {netForce > 0 ? `+${netForce.toFixed(1)}` : netForce.toFixed(1)} N
              </text>
            </g>
          )}

          {/* Newton's 3rd Law Interaction Demonstration Callout (Bottom Right) */}
          <g transform="translate(680, 50)">
            <rect x="-10" y="-10" width="220" height="75" rx="8" fill="rgba(15,23,42,0.9)" stroke="rgba(168,85,247,0.4)" />
            <text x="100" y="14" fill="#c084fc" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
              ACTION = REACTION
            </text>
            <text x="100" y="35" fill="#f8fafc" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle">
              F_box-on-floor = - F_floor-on-box
            </text>
            <text x="100" y="52" fill="#94a3b8" fontSize="10" fontFamily="Inter" textAnchor="middle">
              Opposite forces on different bodies
            </text>
          </g>
        </svg>
      </div>

      {/* Equations Strip (Bottom) */}
      <div className="z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <MathFormula
          latex="\sum \vec{F} = 0 \implies \vec{a} = 0"
          label="1st Law (Inertia)"
          glowColor="#10b981"
          highlight={activeStep === 1}
        />
        <MathFormula
          latex="\sum \vec{F} = m\vec{a}"
          label="2nd Law (Dynamics)"
          glowColor="#c084fc"
          highlight={activeStep === 2}
        />
        <MathFormula
          latex="\vec{F}_{AB} = -\vec{F}_{BA}"
          label="3rd Law (Interaction)"
          glowColor="#38bdf8"
          highlight={activeStep === 3}
        />
        <MathFormula
          latex="f_k = \mu_k N"
          label="Kinetic Friction"
          glowColor="#f59e0b"
          highlight={progress >= 0.4 && progress < 0.8}
        />
      </div>
    </div>
  );
};
