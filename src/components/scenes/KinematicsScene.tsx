import React, { useMemo } from 'react';
import { MathFormula } from '../MathFormula';

interface KinematicsSceneProps {
  currentTime: number; // 4 to 12
  startTime: number;   // 4
  duration: number;    // 8
}

export const KinematicsScene: React.FC<KinematicsSceneProps> = ({
  currentTime,
  startTime,
  duration,
}) => {
  // Local progress 0 to 1 over the 8 seconds
  const localTime = Math.max(0, Math.min(duration, currentTime - startTime));
  const progress = localTime / duration;

  // Real physical ballistic simulation parameters:
  // Launch speed v0 = 36 m/s, launch angle = 55 deg, g = 9.8 m/s^2
  const v0 = 36;
  const theta = (55 * Math.PI) / 180;
  const g = 9.8;
  const v0x = v0 * Math.cos(theta); // ~ 20.65 m/s
  const v0y = v0 * Math.sin(theta); // ~ 29.49 m/s
  const totalFlightTime = (2 * v0y) / g; // ~ 6.02 seconds

  // Map local progress into flight time (completes launch and shows full arc)
  const simTime = Math.min(totalFlightTime, progress * (totalFlightTime * 1.15));
  const xPos = v0x * simTime;
  const yPos = Math.max(0, v0y * simTime - 0.5 * g * simTime * simTime);
  const vy = v0y - g * simTime;
  const vx = v0x;
  const vMag = Math.sqrt(vx * vx + vy * vy);
  const maxHeight = (v0y * v0y) / (2 * g);
  const maxRange = v0x * totalFlightTime;

  // SVG coordinate transformation
  // Coordinate bounds: X from 0 to 140m, Y from 0 to 55m
  // SVG Canvas: 900 x 480
  const originX = 90;
  const originY = 410;
  const scaleX = 5.2; // pixels per meter
  const scaleY = 6.4; // pixels per meter

  const currentPxX = originX + xPos * scaleX;
  const currentPxY = originY - yPos * scaleY;

  // Generate the parabolic path points
  const trajectoryD = useMemo(() => {
    let d = `M ${originX} ${originY}`;
    const steps = 60;
    for (let i = 1; i <= steps; i++) {
      const t = (i / steps) * simTime;
      const x = v0x * t;
      const y = Math.max(0, v0y * t - 0.5 * g * t * t);
      const px = originX + x * scaleX;
      const py = originY - y * scaleY;
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    return d;
  }, [simTime, scaleX, scaleY, v0x, v0y, g]);

  // Full future ghost trajectory
  const ghostTrajectoryD = useMemo(() => {
    let d = `M ${originX} ${originY}`;
    const steps = 60;
    for (let i = 1; i <= steps; i++) {
      const t = (i / steps) * totalFlightTime;
      const x = v0x * t;
      const y = Math.max(0, v0y * t - 0.5 * g * t * t);
      const px = originX + x * scaleX;
      const py = originY - y * scaleY;
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    return d;
  }, [totalFlightTime, scaleX, scaleY, v0x, v0y, g]);

  // Vector arrow scaling
  const vectorScale = 2.2;
  const vxArrowLen = vx * vectorScale;
  const vyArrowLen = vy * vectorScale;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Header Info */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SCENE 02 / 08 · KINEMATICS & MOTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            2D Projectile & Coordinate Trajectory
          </h2>
        </div>

        {/* Live Physics Telemetry HUD */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-2 font-mono text-xs shadow-lg backdrop-blur-md">
          <div>
            <span className="text-slate-400">t: </span>
            <span className="text-cyan-300 font-bold">{simTime.toFixed(2)}s</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">x: </span>
            <span className="text-sky-300 font-bold">{xPos.toFixed(1)}m</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">y: </span>
            <span className="text-violet-300 font-bold">{yPos.toFixed(1)}m</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">|v|: </span>
            <span className="text-emerald-300 font-bold">{vMag.toFixed(1)} m/s</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">R_max: </span>
            <span className="text-amber-300 font-bold">{maxRange.toFixed(0)}m</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Physics Simulation Canvas (SVG) */}
      <div className="relative flex-1 w-full my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 920 460"
          className="w-full h-full max-h-[500px] overflow-visible drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        >
          <defs>
            {/* Vector Arrow Markers */}
            <marker id="arrow-v" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#00f0ff" />
            </marker>
            <marker id="arrow-vx" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <marker id="arrow-vy" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc" />
            </marker>
            <marker id="arrow-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f87171" />
            </marker>

            {/* Glowing trajectory filter */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Coordinate Grid Background */}
          <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
            {[0, 20, 40, 60, 80, 100, 120, 140].map((val) => {
              const x = originX + val * scaleX;
              return (
                <g key={`grid-x-${val}`}>
                  <line x1={x} y1="40" x2={x} y2={originY} />
                  <text x={x} y={originY + 18} fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                    {val}m
                  </text>
                </g>
              );
            })}
            {[0, 10, 20, 30, 40, 50].map((val) => {
              const y = originY - val * scaleY;
              return (
                <g key={`grid-y-${val}`}>
                  <line x1={originX} y1={y} x2="860" y2={y} />
                  <text x={originX - 12} y={y + 3} fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
                    {val}m
                  </text>
                </g>
              );
            })}
          </g>

          {/* Axes */}
          <g stroke="rgba(255,255,255,0.4)" strokeWidth="2">
            {/* X-axis */}
            <line x1={originX - 20} y1={originY} x2="880" y2={originY} />
            <text x="895" y={originY + 4} fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">
              X (Range)
            </text>

            {/* Y-axis */}
            <line x1={originX} y1={originY + 20} x2={originX} y2="30" />
            <text x={originX} y="20" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle">
              Y (Altitude)
            </text>
          </g>

          {/* Apex Peak Marker Indicator */}
          <g stroke="rgba(245, 158, 11, 0.4)" strokeDasharray="4 4" strokeWidth="1">
            <line
              x1={originX + (v0x * totalFlightTime * 0.5) * scaleX}
              y1={originY - maxHeight * scaleY}
              x2={originX + (v0x * totalFlightTime * 0.5) * scaleX}
              y2={originY}
            />
            <text
              x={originX + (v0x * totalFlightTime * 0.5) * scaleX}
              y={originY - maxHeight * scaleY - 10}
              fill="#fbbf24"
              fontSize="10"
              fontFamily="JetBrains Mono"
              textAnchor="middle"
            >
              Apex: v_y = 0 (h_max = {maxHeight.toFixed(1)}m)
            </text>
          </g>

          {/* Ghost Projected Trajectory */}
          <path d={ghostTrajectoryD} fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="2" strokeDasharray="5 5" />

          {/* Active Glowing Parabolic Trajectory */}
          <path
            d={trajectoryD}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="3.5"
            filter="url(#glow-cyan)"
            strokeLinecap="round"
          />

          {/* Constant Gravity Vector g Indicator (Top Right) */}
          <g transform="translate(760, 90)">
            <rect x="-10" y="-10" width="120" height="65" rx="8" fill="rgba(15,23,42,0.85)" stroke="rgba(248,113,113,0.3)" />
            <text x="50" y="14" fill="#f87171" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
              GRAVITY FIELD
            </text>
            <line x1="20" y1="28" x2="20" y2="48" stroke="#f87171" strokeWidth="2.5" markerEnd="url(#arrow-g)" />
            <text x="32" y="42" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">
              g = 9.8 m/s²
            </text>
          </g>

          {/* Vectors at Current Projectile Position */}
          {simTime > 0.05 && (
            <g>
              {/* Tangential Velocity Vector v */}
              <line
                x1={currentPxX}
                y1={currentPxY}
                x2={currentPxX + vxArrowLen}
                y2={currentPxY - vyArrowLen}
                stroke="#00f0ff"
                strokeWidth="3"
                markerEnd="url(#arrow-v)"
              />
              <text
                x={currentPxX + vxArrowLen + 6}
                y={currentPxY - vyArrowLen - 4}
                fill="#00f0ff"
                fontSize="11"
                fontWeight="bold"
                fontFamily="JetBrains Mono"
              >
                v ({vMag.toFixed(1)})
              </text>

              {/* Horizontal Component vx (Constant) */}
              <line
                x1={currentPxX}
                y1={currentPxY}
                x2={currentPxX + vxArrowLen}
                y2={currentPxY}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="3 3"
                markerEnd="url(#arrow-vx)"
              />
              <text
                x={currentPxX + vxArrowLen * 0.5}
                y={currentPxY + 16}
                fill="#38bdf8"
                fontSize="10"
                fontFamily="JetBrains Mono"
                textAnchor="middle"
              >
                v_x = const
              </text>

              {/* Vertical Component vy (Changes with gravity) */}
              <line
                x1={currentPxX}
                y1={currentPxY}
                x2={currentPxX}
                y2={currentPxY - vyArrowLen}
                stroke="#c084fc"
                strokeWidth="2"
                strokeDasharray="3 3"
                markerEnd="url(#arrow-vy)"
              />
              <text
                x={currentPxX - 10}
                y={currentPxY - vyArrowLen * 0.5}
                fill="#c084fc"
                fontSize="10"
                fontFamily="JetBrains Mono"
                textAnchor="end"
              >
                v_y = v₀y - gt
              </text>

              {/* Glowing Projectile Orb */}
              <circle
                cx={currentPxX}
                cy={currentPxY}
                r="7"
                fill="#ffffff"
                stroke="#00f0ff"
                strokeWidth="3"
                filter="url(#glow-cyan)"
              />
              <circle
                cx={currentPxX}
                cy={currentPxY}
                r="14"
                fill="none"
                stroke="rgba(0, 240, 255, 0.4)"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Equations Strip (Bottom) */}
      <div className="z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MathFormula
          latex="v = \frac{\Delta x}{\Delta t} = \frac{dx}{dt}"
          label="Velocity"
          unit="m/s"
          glowColor="#38bdf8"
          highlight={progress >= 0.1 && progress < 0.4}
        />
        <MathFormula
          latex="a = \frac{\Delta v}{\Delta t} = \frac{dv}{dt}"
          label="Acceleration"
          unit="m/s²"
          glowColor="#f87171"
          highlight={progress >= 0.4 && progress < 0.7}
        />
        <MathFormula
          latex="x(t) = x_0 + v_0 t + \frac{1}{2}a t^2"
          label="Position Kinematic"
          unit="m"
          glowColor="#00f0ff"
          highlight={progress >= 0.7}
        />
      </div>
    </div>
  );
};
