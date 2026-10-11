import React from 'react';
import { MathFormula } from '../MathFormula';

interface CircularMotionSceneProps {
  currentTime: number; // 20 to 26
  startTime: number;   // 20
  duration: number;    // 6
}

export const CircularMotionScene: React.FC<CircularMotionSceneProps> = ({
  currentTime,
  startTime,
  duration,
}) => {
  const localTime = Math.max(0, Math.min(duration, currentTime - startTime));
  const progress = localTime / duration;

  // Circular motion parameters:
  // Radius r = 140 px, angular velocity omega = 2.4 rad/s
  // mass m = 2.0 kg, speed v = omega * r = const
  const radius = 145;
  const omega = 2.4; // rad/s
  const currentAngle = localTime * omega - Math.PI / 2; // start from top
  const centerX = 460;
  const centerY = 215;

  // Orbiting particle coordinates
  const orbX = centerX + radius * Math.cos(currentAngle);
  const orbY = centerY + radius * Math.sin(currentAngle);

  // Inward radial unit vector pointing to center
  const radialUx = -Math.cos(currentAngle);
  const radialUy = -Math.sin(currentAngle);

  // Tangential velocity unit vector (perpendicular to radius in direction of motion)
  const tanUx = -Math.sin(currentAngle);
  const tanUy = Math.cos(currentAngle);

  // Scaled vector lengths for SVG display
  const acArrowLen = 78;
  const vtArrowLen = 88;

  // Tangential velocity endpoint
  const vtEndX = orbX + tanUx * vtArrowLen;
  const vtEndY = orbY + tanUy * vtArrowLen;

  // Centripetal acceleration endpoint (towards center)
  const acEndX = orbX + radialUx * acArrowLen;
  const acEndY = orbY + radialUy * acArrowLen;

  // Right-angle symbol between tangential velocity and radial vector
  const rightAngleSize = 12;
  const raCornerX = orbX + tanUx * rightAngleSize + radialUx * rightAngleSize;
  const raCornerY = orbY + tanUy * rightAngleSize + radialUy * rightAngleSize;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Header Info */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SCENE 04 / 08 · RADIAL DYNAMICS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Uniform Circular Motion & Centripetal Acceleration
          </h2>
        </div>

        {/* Live Kinematic HUD */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-2 font-mono text-xs shadow-lg backdrop-blur-md">
          <div>
            <span className="text-slate-400">Radius r: </span>
            <span className="text-sky-300 font-bold">12.0 m</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">Speed |v|: </span>
            <span className="text-cyan-300 font-bold">18.5 m/s (const)</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">a_c: </span>
            <span className="text-emerald-400 font-bold">28.5 m/s² (inward)</span>
          </div>
        </div>
      </div>

      {/* Main Orbit Simulation Area */}
      <div className="relative flex-1 w-full my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 920 430"
          className="w-full h-full max-h-[440px] overflow-visible drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]"
        >
          <defs>
            <marker id="arrow-ac" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="arrow-vt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#00f0ff" />
            </marker>
            <filter id="glow-orbit" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Central Origin Crosshairs */}
          <line x1={centerX - 180} y1={centerY} x2={centerX + 180} y2={centerY} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
          <line x1={centerX} y1={centerY - 180} x2={centerX} y2={centerY + 180} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

          {/* Glowing Circular Orbital Path */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(0, 240, 255, 0.25)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Center Pivot Point */}
          <circle cx={centerX} cy={centerY} r="6" fill="#06b6d4" filter="url(#glow-orbit)" />
          <circle cx={centerX} cy={centerY} r="14" fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="1" />
          <text x={centerX} y={centerY - 18} fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
            Center Pivot (r = 0)
          </text>

          {/* Radius Dashed Line to Orb */}
          <line
            x1={centerX}
            y1={centerY}
            x2={orbX}
            y2={orbY}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={(centerX + orbX) / 2 - 12}
            y={(centerY + orbY) / 2 - 6}
            fill="#cbd5e1"
            fontSize="11"
            fontFamily="JetBrains Mono"
          >
            r
          </text>

          {/* 90-Degree Orthogonal Indicator */}
          <path
            d={`M ${orbX + tanUx * rightAngleSize} ${orbY + tanUy * rightAngleSize} L ${raCornerX} ${raCornerY} L ${orbX + radialUx * rightAngleSize} ${orbY + radialUy * rightAngleSize}`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* 1. Tangential Velocity Vector v_t */}
          <line
            x1={orbX}
            y1={orbY}
            x2={vtEndX}
            y2={vtEndY}
            stroke="#00f0ff"
            strokeWidth="3.5"
            markerEnd="url(#arrow-vt)"
          />
          <text
            x={vtEndX + tanUx * 10}
            y={vtEndY + tanUy * 10}
            fill="#00f0ff"
            fontSize="12"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            v_t (Tangential)
          </text>

          {/* 2. Inward Centripetal Acceleration / Force Vector a_c / F_c */}
          <line
            x1={orbX}
            y1={orbY}
            x2={acEndX}
            y2={acEndY}
            stroke="#10b981"
            strokeWidth="3.5"
            markerEnd="url(#arrow-ac)"
          />
          <text
            x={acEndX + radialUx * 8}
            y={acEndY + radialUy * 8}
            fill="#10b981"
            fontSize="12"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            a_c (Radial Inward)
          </text>

          {/* Orbiting Particle Body */}
          <circle
            cx={orbX}
            cy={orbY}
            r="10"
            fill="#ffffff"
            stroke="#00f0ff"
            strokeWidth="3"
            filter="url(#glow-orbit)"
          />

          {/* Explanatory Callout Card (Left) */}
          <g transform="translate(60, 100)">
            <rect x="-10" y="-10" width="220" height="95" rx="8" fill="rgba(15,23,42,0.85)" stroke="rgba(6,182,212,0.3)" />
            <text x="100" y="14" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
              SPEED VS VELOCITY
            </text>
            <text x="100" y="36" fill="#f8fafc" fontSize="11" fontFamily="Inter" textAnchor="middle">
              Speed |v| remains constant,
            </text>
            <text x="100" y="52" fill="#38bdf8" fontSize="11" fontFamily="Inter" textAnchor="middle">
              but direction constantly turns.
            </text>
            <text x="100" y="70" fill="#10b981" fontSize="11" fontFamily="Inter" textAnchor="middle">
              ∴ Inward acceleration exists!
            </text>
          </g>
        </svg>
      </div>

      {/* Equations Strip (Bottom) */}
      <div className="z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MathFormula
          latex="a_c = \frac{v^2}{r} = \omega^2 r"
          label="Centripetal Acceleration"
          unit="m/s²"
          glowColor="#10b981"
          highlight={progress >= 0.1 && progress < 0.5}
        />
        <MathFormula
          latex="F_c = m a_c = \frac{m v^2}{r}"
          label="Centripetal Force"
          unit="N"
          glowColor="#00f0ff"
          highlight={progress >= 0.5 && progress < 0.85}
        />
        <MathFormula
          latex="T = \frac{2\pi r}{v} = \frac{2\pi}{\omega}"
          label="Period of Orbit"
          unit="s"
          glowColor="#38bdf8"
          highlight={progress >= 0.85}
        />
      </div>
    </div>
  );
};
