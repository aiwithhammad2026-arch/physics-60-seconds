import React from 'react';
import { MathFormula } from '../MathFormula';

interface EnergySceneProps {
  currentTime: number; // 26 to 34
  startTime: number;   // 26
  duration: number;    // 8
}

export const EnergyScene: React.FC<EnergySceneProps> = ({
  currentTime,
  startTime,
  duration,
}) => {
  const localTime = Math.max(0, Math.min(duration, currentTime - startTime));
  const progress = localTime / duration;

  // Track simulation:
  // A ball rolling back and forth on a smooth Galileo valley track:
  // Height h(x) = h_max * cos^2(omega * t) or smooth harmonic coaster curve
  const totalMechanicalEnergy = 1000; // Joules (scaled normalized 1000 J)
  
  // Height fraction (from 0 to 1)
  // At peak height: U = 1000, K = 0
  // At lowest point: U = 0, K = 1000
  const heightFraction = 0.5 + 0.5 * Math.cos(progress * Math.PI * 3);
  const potentialEnergy = totalMechanicalEnergy * heightFraction;
  const kineticEnergy = totalMechanicalEnergy - potentialEnergy;
  const speed = Math.sqrt((2 * kineticEnergy) / 2.0); // m/s assuming m = 2.0 kg

  // Curve coordinates in SVG:
  // Valley track: x goes from 100 to 600, y = 320 - heightFraction * 200
  const trackCurveD = "M 80 120 C 200 340, 480 340, 600 120";

  // Current ball position along curve
  const phase = (Math.sin(progress * Math.PI * 3) + 1) / 2; // 0 to 1 back and forth
  const ballPxX = 100 + phase * 480;
  // Quadratic valley approximation for SVG
  const normalizedX = (ballPxX - 340) / 240; // -1 to +1
  const ballPxY = 320 - (1 - normalizedX * normalizedX) * 190;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Header Info */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SCENE 05 / 08 · WORK & CONSERVATION OF ENERGY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Work, Kinetic & Potential Energy Conservation
          </h2>
        </div>

        {/* Live Energy Telemetry HUD */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-2 font-mono text-xs shadow-lg backdrop-blur-md">
          <div>
            <span className="text-slate-400">Total E: </span>
            <span className="text-amber-300 font-bold">1000 J (Const)</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">K: </span>
            <span className="text-cyan-300 font-bold">{kineticEnergy.toFixed(0)} J</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">U: </span>
            <span className="text-violet-300 font-bold">{potentialEnergy.toFixed(0)} J</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">v: </span>
            <span className="text-emerald-400 font-bold">{speed.toFixed(1)} m/s</span>
          </div>
        </div>
      </div>

      {/* Main Track & Energy Bar Chart Split Layout */}
      <div className="relative flex-1 w-full my-2 flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Track Canvas (SVG) */}
        <div className="relative flex-1 w-full h-full max-h-[360px] flex items-center justify-center">
          <svg
            viewBox="0 0 680 380"
            className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(0,0,0,0.85)]"
          >
            <defs>
              <filter id="glow-energy-ball" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid guides */}
            <line x1="80" y1="320" x2="600" y2="320" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            <text x="605" y="324" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
              h = 0 (Datum)
            </text>

            <line x1="80" y1="130" x2="600" y2="130" stroke="rgba(168,85,247,0.2)" strokeDasharray="3 3" />
            <text x="605" y="134" fill="#a855f7" fontSize="10" fontFamily="JetBrains Mono">
              h_max (U = max, K = 0)
            </text>

            {/* Rollercoaster Track */}
            <path
              d={trackCurveD}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={trackCurveD}
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeOpacity="0.8"
            />

            {/* Height Indicator arrow from datum to ball */}
            <line
              x1={ballPxX}
              y1="320"
              x2={ballPxX}
              y2={ballPxY}
              stroke="rgba(192, 132, 252, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text
              x={ballPxX + 12}
              y={(ballPxY + 320) / 2}
              fill="#c084fc"
              fontSize="10"
              fontFamily="JetBrains Mono"
            >
              h = {(heightFraction * 10).toFixed(1)}m
            </text>

            {/* Glowing Ball */}
            <circle
              cx={ballPxX}
              cy={ballPxY}
              r="14"
              fill="#ffffff"
              stroke="#10b981"
              strokeWidth="3.5"
              filter="url(#glow-energy-ball)"
            />

            {/* Velocity vector arrow on ball */}
            {speed > 1 && (
              <line
                x1={ballPxX}
                y1={ballPxY}
                x2={ballPxX + (phase > 0.5 ? 1 : -1) * speed * 2}
                y2={ballPxY}
                stroke="#00f0ff"
                strokeWidth="3"
                markerEnd="url(#arrow-vt)"
              />
            )}
          </svg>
        </div>

        {/* Live Synchronized Energy Transfer Bar Chart */}
        <div className="w-full lg:w-72 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
              ENERGY ALLOCATION
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              CONSERVED
            </span>
          </div>

          <div className="space-y-4 my-3">
            {/* Kinetic Energy Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-cyan-400 font-bold">Kinetic (K = ½mv²)</span>
                <span className="text-white font-bold">{kineticEnergy.toFixed(0)} J</span>
              </div>
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-sky-300 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                  style={{ width: `${(kineticEnergy / totalMechanicalEnergy) * 100}%` }}
                />
              </div>
            </div>

            {/* Potential Energy Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-violet-400 font-bold">Potential (U = mgh)</span>
                <span className="text-white font-bold">{potentialEnergy.toFixed(0)} J</span>
              </div>
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-violet-300 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                  style={{ width: `${(potentialEnergy / totalMechanicalEnergy) * 100}%` }}
                />
              </div>
            </div>

            {/* Total Mechanical Energy Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-400 font-bold">Total E = K + U</span>
                <span className="text-amber-300 font-bold">{totalMechanicalEnergy} J</span>
              </div>
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full shadow-[0_0_14px_rgba(245,158,11,0.6)]"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 text-center">
            No friction: <span className="text-emerald-400 font-bold">W_nc = 0</span> ➔ ΔE = 0
          </div>
        </div>
      </div>

      {/* Equations Strip (Bottom) */}
      <div className="z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <MathFormula
          latex="W = \vec{F} \cdot \vec{d} = F d \cos\theta"
          label="Work Done"
          unit="J"
          glowColor="#10b981"
          highlight={progress >= 0.05 && progress < 0.3}
        />
        <MathFormula
          latex="K = \frac{1}{2}m v^2"
          label="Kinetic Energy"
          unit="J"
          glowColor="#00f0ff"
          highlight={progress >= 0.3 && progress < 0.55}
        />
        <MathFormula
          latex="U = m g h"
          label="Potential Energy"
          unit="J"
          glowColor="#a855f7"
          highlight={progress >= 0.55 && progress < 0.8}
        />
        <MathFormula
          latex="K_i + U_i = K_f + U_f"
          label="Energy Conservation"
          unit="Const"
          glowColor="#f59e0b"
          highlight={progress >= 0.8}
        />
      </div>
    </div>
  );
};
