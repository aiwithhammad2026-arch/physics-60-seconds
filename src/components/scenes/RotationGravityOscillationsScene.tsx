import React, { useMemo } from 'react';
import { MathFormula } from '../MathFormula';

interface RotationGravityOscillationsSceneProps {
  currentTime: number; // 41 to 53 (12 seconds total)
  startTime: number;   // 41
  duration: number;    // 12
}

export const RotationGravityOscillationsScene: React.FC<RotationGravityOscillationsSceneProps> = ({
  currentTime,
  startTime,
  duration,
}) => {
  const localTime = Math.max(0, Math.min(duration, currentTime - startTime));
  
  // Segment A: 0 - 4s (Rotation)
  // Segment B: 4 - 8s (Gravity)
  // Segment C: 8 - 12s (Oscillations)
  const currentSegment = localTime < 4 ? 'rotation' : localTime < 8 ? 'gravity' : 'oscillations';

  // -------------------------------------------------------------
  // SEGMENT A: ROTATION (0 - 4s)
  // -------------------------------------------------------------
  const angularSpeed = 4.5; // rad/s
  const rotAngle = localTime * angularSpeed;

  // -------------------------------------------------------------
  // SEGMENT B: GRAVITY (4 - 8s)
  // -------------------------------------------------------------
  const gravLocalTime = Math.max(0, localTime - 4);
  const gravOrbitAngle = gravLocalTime * 1.8;
  const starX = 460;
  const starY = 210;
  const orbitA = 180;
  const orbitB = 110;
  const planetX = starX + orbitA * Math.cos(gravOrbitAngle);
  const planetY = starY + orbitB * Math.sin(gravOrbitAngle);

  // -------------------------------------------------------------
  // SEGMENT C: OSCILLATIONS (8 - 12s)
  // -------------------------------------------------------------
  const oscLocalTime = Math.max(0, localTime - 8);
  const oscFreq = 4.0; // rad/s
  const amplitude = 95;
  const currentDisplacement = amplitude * Math.cos(oscFreq * oscLocalTime);
  const springBaseX = 140;
  const springMassX = springBaseX + 180 + currentDisplacement;
  const oscY = 210;

  // Real-time sinusoidal graph points
  const sineGraphD = useMemo(() => {
    let d = 'M 490 210';
    const totalPoints = 120;
    const graphWidth = 360;
    for (let i = 0; i <= totalPoints; i++) {
      const frac = i / totalPoints;
      const t = oscLocalTime - (1 - frac) * 3.5;
      const x = 490 + frac * graphWidth;
      const y = 210 - amplitude * 0.75 * Math.cos(oscFreq * t);
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  }, [oscLocalTime, oscFreq, amplitude]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Header Info */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pink-400 font-mono text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span>SCENE 07 / 08 · ROTATION, GRAVITATION & OSCILLATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            {currentSegment === 'rotation' && 'Phase 7A: Rotational Dynamics & Torque'}
            {currentSegment === 'gravity' && 'Phase 7B: Universal Gravitation & Orbital Fields'}
            {currentSegment === 'oscillations' && 'Phase 7C: Simple Harmonic Motion & Restoring Forces'}
          </h2>
        </div>

        {/* Dynamic Multi-Phase Badges */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 rounded-xl p-1 font-mono text-xs shadow-lg backdrop-blur-md">
          <div
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentSegment === 'rotation'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                : 'text-slate-500'
            }`}
          >
            A. ROTATION
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentSegment === 'gravity'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-slate-500'
            }`}
          >
            B. GRAVITY
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentSegment === 'oscillations'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                : 'text-slate-500'
            }`}
          >
            C. OSCILLATIONS
          </div>
        </div>
      </div>

      {/* Main Dynamic Physics Arena */}
      <div className="relative flex-1 w-full my-2 flex items-center justify-center">
        {/* ========================================== */}
        {/* SUB-PHASE A: ROTATION (0 - 4s) */}
        {/* ========================================== */}
        {currentSegment === 'rotation' && (
          <svg viewBox="0 0 920 420" className="w-full h-full max-h-[440px] overflow-visible drop-shadow-[0_0_30px_rgba(0,0,0,0.85)]">
            <defs>
              <marker id="arrow-torque" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#ec4899" />
              </marker>
              <marker id="arrow-omega" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#00f0ff" />
              </marker>
            </defs>

            {/* Rotating Disc / Flywheel */}
            <g transform="translate(460, 210)">
              {/* Outer Inertia Ring */}
              <circle r="130" fill="rgba(15, 23, 42, 0.7)" stroke="#ec4899" strokeWidth="4" />
              <circle r="130" fill="none" stroke="rgba(236,72,153,0.3)" strokeWidth="12" />

              {/* Rotating Spokes */}
              <g transform={`rotate(${(rotAngle * 180) / Math.PI})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                  <line
                    key={ang}
                    x1="0"
                    y1="0"
                    x2={130 * Math.cos((ang * Math.PI) / 180)}
                    y2={130 * Math.sin((ang * Math.PI) / 180)}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="2"
                  />
                ))}
                {/* Peripheral Mass Particles representing Inertia I = sum(m r^2) */}
                {[0, 90, 180, 270].map((ang) => (
                  <circle
                    key={`mass-${ang}`}
                    cx={130 * Math.cos((ang * Math.PI) / 180)}
                    cy={130 * Math.sin((ang * Math.PI) / 180)}
                    r="8"
                    fill="#ffffff"
                    stroke="#ec4899"
                    strokeWidth="2"
                  />
                ))}
              </g>

              {/* Central Axle Pivot */}
              <circle r="12" fill="#00f0ff" />
              <circle r="22" fill="none" stroke="rgba(0, 240, 255, 0.5)" strokeWidth="2" />

              {/* Applied Torque Vector at Perimeter (r = 130) */}
              <line x1="130" y1="0" x2="130" y2="-90" stroke="#ec4899" strokeWidth="3.5" markerEnd="url(#arrow-torque)" />
              <text x="145" y="-45" fill="#ec4899" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono">
                Force F ➔ Torque τ = r F sinθ
              </text>

              {/* Angular Velocity Omega Vector Indicator */}
              <path
                d="M -50 -50 A 70 70 0 0 1 50 -50"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3"
                markerEnd="url(#arrow-omega)"
              />
              <text x="0" y="-75" fill="#00f0ff" fontSize="12" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                Angular Velocity ω
              </text>
            </g>

            {/* Rotational Inertia Callout */}
            <g transform="translate(60, 80)">
              <rect x="-10" y="-10" width="220" height="85" rx="8" fill="rgba(15,23,42,0.85)" stroke="rgba(236,72,153,0.3)" />
              <text x="100" y="14" fill="#ec4899" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                MOMENT OF INERTIA (I)
              </text>
              <text x="100" y="36" fill="#f8fafc" fontSize="11" fontFamily="Inter" textAnchor="middle">
                Resistance to rotational change:
              </text>
              <text x="100" y="55" fill="#38bdf8" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle">
                I = ∫ r² dm · L = Iω
              </text>
            </g>
          </svg>
        )}

        {/* ========================================== */}
        {/* SUB-PHASE B: GRAVITY (4 - 8s) */}
        {/* ========================================== */}
        {currentSegment === 'gravity' && (
          <svg viewBox="0 0 920 420" className="w-full h-full max-h-[440px] overflow-visible drop-shadow-[0_0_30px_rgba(0,0,0,0.85)]">
            <defs>
              <marker id="arrow-fgrav" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>
              <filter id="glow-star" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Spacetime Curvature Grid Warping (Elliptical meshes) */}
            {[60, 110, 160, 210, 270].map((r, idx) => (
              <ellipse
                key={`field-${idx}`}
                cx={starX}
                cy={starY}
                rx={r}
                ry={r * 0.6}
                fill="none"
                stroke="rgba(0, 240, 255, 0.12)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
            ))}

            {/* Central Massive Star */}
            <circle cx={starX} cy={starY} r="26" fill="#f59e0b" filter="url(#glow-star)" />
            <circle cx={starX} cy={starY} r="38" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="2" />
            <text x={starX} y={starY + 4} fill="#05070f" fontSize="11" fontWeight="bold" fontFamily="Space Grotesk" textAnchor="middle">
              M₁
            </text>

            {/* Orbiting Planet Body */}
            <circle cx={planetX} cy={planetY} r="13" fill="#38bdf8" filter="url(#glow-star)" />
            <text x={planetX} y={planetY - 18} fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
              m₂
            </text>

            {/* Mutual Gravitational Attraction Force Vector */}
            <line
              x1={planetX}
              y1={planetY}
              x2={planetX + (starX - planetX) * 0.35}
              y2={planetY + (starY - planetY) * 0.35}
              stroke="#38bdf8"
              strokeWidth="3"
              markerEnd="url(#arrow-fgrav)"
            />
            <text
              x={(planetX + starX) * 0.5}
              y={(planetY + starY) * 0.5 - 12}
              fill="#38bdf8"
              fontSize="11"
              fontFamily="JetBrains Mono"
              textAnchor="middle"
            >
              F_g = G m₁m₂ / r²
            </text>

            {/* Radius r indicator */}
            <line x1={starX} y1={starY} x2={planetX} y2={planetY} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />

            {/* Inverse Square Law Callout */}
            <g transform="translate(60, 80)">
              <rect x="-10" y="-10" width="220" height="85" rx="8" fill="rgba(15,23,42,0.85)" stroke="rgba(6,182,212,0.3)" />
              <text x="100" y="14" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                UNIVERSAL GRAVITATION
              </text>
              <text x="100" y="36" fill="#f8fafc" fontSize="11" fontFamily="Inter" textAnchor="middle">
                Inverse-square radial field:
              </text>
              <text x="100" y="55" fill="#f59e0b" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle">
                F ∝ 1 / r² · Keplerian Orbits
              </text>
            </g>
          </svg>
        )}

        {/* ========================================== */}
        {/* SUB-PHASE C: OSCILLATIONS (8 - 12s) */}
        {/* ========================================== */}
        {currentSegment === 'oscillations' && (
          <svg viewBox="0 0 920 420" className="w-full h-full max-h-[440px] overflow-visible drop-shadow-[0_0_30px_rgba(0,0,0,0.85)]">
            <defs>
              <marker id="arrow-spring-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
              </marker>
            </defs>

            {/* Left Wall Anchor */}
            <line x1={springBaseX} y1={oscY - 70} x2={springBaseX} y2={oscY + 70} stroke="#64748b" strokeWidth="4" />
            {[ -60, -40, -20, 0, 20, 40, 60 ].map((offset) => (
              <line key={offset} x1={springBaseX - 10} y1={oscY + offset + 8} x2={springBaseX} y2={oscY + offset} stroke="#475569" strokeWidth="2" />
            ))}

            {/* Equilibrium dashed line */}
            <line x1={springBaseX + 180} y1={oscY - 80} x2={springBaseX + 180} y2={oscY + 80} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
            <text x={springBaseX + 180} y={oscY - 90} fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
              Equilibrium (x = 0)
            </text>

            {/* Coiled Spring SVG Path */}
            {(() => {
              const coils = 12;
              const coilWidth = (springMassX - 25 - springBaseX) / coils;
              let springPath = `M ${springBaseX} ${oscY}`;
              for (let i = 0; i < coils; i++) {
                const cx1 = springBaseX + (i + 0.25) * coilWidth;
                const cx2 = springBaseX + (i + 0.75) * coilWidth;
                const nextX = springBaseX + (i + 1) * coilWidth;
                springPath += ` Q ${cx1} ${oscY - 22}, ${(cx1 + cx2) / 2} ${oscY} Q ${cx2} ${oscY + 22}, ${nextX} ${oscY}`;
              }
              return <path d={springPath} fill="none" stroke="#38bdf8" strokeWidth="2.8" />;
            })()}

            {/* Oscillating Mass Block */}
            <g transform={`translate(${springMassX - 25}, ${oscY - 25})`}>
              <rect width="50" height="50" rx="8" fill="rgba(15, 23, 42, 0.95)" stroke="#a855f7" strokeWidth="3" />
              <text x="25" y="24" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="Space Grotesk" textAnchor="middle">
                MASS
              </text>
              <text x="25" y="38" fill="#a855f7" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                m
              </text>
            </g>

            {/* Restoring Spring Force Vector: F = -kx (opposes displacement) */}
            {Math.abs(currentDisplacement) > 10 && (
              <line
                x1={springMassX}
                y1={oscY + 45}
                x2={springMassX - (currentDisplacement > 0 ? 1 : -1) * 60}
                y2={oscY + 45}
                stroke="#a855f7"
                strokeWidth="3"
                markerEnd="url(#arrow-spring-f)"
              />
            )}
            <text x={springMassX} y={oscY + 68} fill="#a855f7" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
              F = -k x ({currentDisplacement > 0 ? 'Pull' : 'Push'})
            </text>

            {/* Synchronized Oscilloscope Graph (Right Side) */}
            <g>
              <rect x="470" y="100" width="410" height="220" rx="10" fill="rgba(10, 15, 30, 0.7)" stroke="rgba(255,255,255,0.15)" />
              <text x="490" y="125" fill="#c084fc" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                HARMONIC WAVEFORM: x(t) = A cos(ωt + φ)
              </text>
              {/* Center Axis */}
              <line x1="490" y1="210" x2="860" y2="210" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
              {/* Sinusoidal Trace */}
              <path d={sineGraphD} fill="none" stroke="#00f0ff" strokeWidth="2.5" />
              {/* Current Tracking Point */}
              <circle cx="850" cy={210 - amplitude * 0.75 * Math.cos(oscFreq * oscLocalTime)} r="5" fill="#ffffff" stroke="#00f0ff" strokeWidth="2" />
            </g>
          </svg>
        )}
      </div>

      {/* Equations Strip (Bottom) */}
      <div className="z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MathFormula
          latex="\tau = r F \sin\theta \quad \tau_{\text{net}} = I\alpha"
          label="A. Torque & Rotation"
          unit="N·m"
          glowColor="#ec4899"
          highlight={currentSegment === 'rotation'}
        />
        <MathFormula
          latex="F_g = G \frac{m_1 m_2}{r^2} \quad T^2 \propto a^3"
          label="B. Universal Gravity"
          unit="N"
          glowColor="#06b6d4"
          highlight={currentSegment === 'gravity'}
        />
        <MathFormula
          latex="x(t) = A\cos(\omega t + \phi) \quad F = -kx"
          label="C. Harmonic Oscillations"
          unit="m"
          glowColor="#a855f7"
          highlight={currentSegment === 'oscillations'}
        />
      </div>
    </div>
  );
};
