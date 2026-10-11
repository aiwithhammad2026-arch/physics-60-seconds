import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';
import { MathFormula } from './MathFormula';

interface InteractiveSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveSandboxModal: React.FC<InteractiveSandboxModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Sandbox variables
  const [activeTab, setActiveTab] = useState<'kinematics' | 'forces' | 'spring'>('kinematics');

  // Kinematics controls
  const [v0, setV0] = useState(30);
  const [angleDeg, setAngleDeg] = useState(45);
  const [gravity, setGravity] = useState(9.8);

  // Forces controls
  const [boxMass, setBoxMass] = useState(5);
  const [muK, setMuK] = useState(0.25);
  const [appliedF, setAppliedF] = useState(35);

  // Spring controls
  const [springK, setSpringK] = useState(50);
  const [springMass, setSpringMass] = useState(2);

  // Derived calculations
  // Kinematics
  const thetaRad = (angleDeg * Math.PI) / 180;
  const v0x = v0 * Math.cos(thetaRad);
  const v0y = v0 * Math.sin(thetaRad);
  const flightTime = (2 * v0y) / gravity;
  const maxRange = v0x * flightTime;
  const maxHeight = (v0y * v0y) / (2 * gravity);

  // Forces
  const normalF = boxMass * gravity;
  const frictionF = muK * normalF;
  const netF = appliedF - frictionF;
  const accel = netF / boxMass;

  // Spring
  const omega = Math.sqrt(springK / springMass);
  const period = (2 * Math.PI) / omega;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold font-['Outfit'] text-white">
              Interactive Physics Laboratory
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-900/30 px-6">
          <button
            onClick={() => setActiveTab('kinematics')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 transition-all ${
              activeTab === 'kinematics'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. BALLISTIC TRAJECTORY
          </button>
          <button
            onClick={() => setActiveTab('forces')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 transition-all ${
              activeTab === 'forces'
                ? 'border-violet-400 text-violet-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. NEWTON'S 2ND LAW & FRICTION
          </button>
          <button
            onClick={() => setActiveTab('spring')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 transition-all ${
              activeTab === 'spring'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. HARMONIC OSCILLATOR
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: KINEMATICS */}
          {activeTab === 'kinematics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    Launch Speed v₀: <span className="text-cyan-400 font-bold">{v0} m/s</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={v0}
                    onChange={(e) => setV0(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    Launch Angle θ: <span className="text-cyan-400 font-bold">{angleDeg}°</span>
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="85"
                    value={angleDeg}
                    onChange={(e) => setAngleDeg(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    Gravity g: <span className="text-cyan-400 font-bold">{gravity} m/s²</span>
                  </label>
                  <input
                    type="range"
                    min="1.6" // Moon
                    max="24.8" // Jupiter
                    step="0.2"
                    value={gravity}
                    onChange={(e) => setGravity(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-3 gap-4 text-center bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono text-xs">
                <div>
                  <div className="text-slate-400 mb-1">Max Range R</div>
                  <div className="text-lg font-bold text-sky-300">{maxRange.toFixed(1)} m</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Max Height H</div>
                  <div className="text-lg font-bold text-violet-300">{maxHeight.toFixed(1)} m</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Flight Time T</div>
                  <div className="text-lg font-bold text-emerald-300">{flightTime.toFixed(2)} s</div>
                </div>
              </div>

              <MathFormula
                latex={`R = \\frac{v_0^2 \\sin(2\\theta)}{g} = \\frac{${v0}^2 \\sin(${2 * angleDeg}^\\circ)}{${gravity}} = ${maxRange.toFixed(1)}\\text{ m}`}
                size="md"
                highlight
              />
            </div>
          )}

          {/* TAB 2: FORCES */}
          {activeTab === 'forces' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    Mass m: <span className="text-violet-400 font-bold">{boxMass} kg</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={boxMass}
                    onChange={(e) => setBoxMass(parseFloat(e.target.value))}
                    className="w-full accent-violet-400 cursor-pointer"
                  />
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    Friction μ_k: <span className="text-violet-400 font-bold">{muK.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={muK}
                    onChange={(e) => setMuK(parseFloat(e.target.value))}
                    className="w-full accent-violet-400 cursor-pointer"
                  />
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    Applied Force F_app: <span className="text-violet-400 font-bold">{appliedF} N</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={appliedF}
                    onChange={(e) => setAppliedF(parseFloat(e.target.value))}
                    className="w-full accent-violet-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-3 gap-4 text-center bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono text-xs">
                <div>
                  <div className="text-slate-400 mb-1">Friction f_k</div>
                  <div className="text-lg font-bold text-amber-400">{frictionF.toFixed(1)} N</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Net Force ΣF</div>
                  <div className={`text-lg font-bold ${netF > 0 ? 'text-violet-400' : 'text-slate-400'}`}>
                    {netF.toFixed(1)} N
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Acceleration a</div>
                  <div className="text-lg font-bold text-cyan-300">{accel.toFixed(2)} m/s²</div>
                </div>
              </div>

              <MathFormula
                latex={`a = \\frac{\\sum F}{m} = \\frac{${appliedF} - ${frictionF.toFixed(1)}}{${boxMass}} = ${accel.toFixed(2)}\\text{ m/s}^2`}
                size="md"
                highlight
                glowColor="#a855f7"
              />
            </div>
          )}

          {/* TAB 3: SPRING */}
          {activeTab === 'spring' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    Spring Constant k: <span className="text-emerald-400 font-bold">{springK} N/m</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={springK}
                    onChange={(e) => setSpringK(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-mono text-slate-400 block mb-2">
                    Attached Mass m: <span className="text-emerald-400 font-bold">{springMass} kg</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={springMass}
                    onChange={(e) => setSpringMass(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-2 gap-4 text-center bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono text-xs">
                <div>
                  <div className="text-slate-400 mb-1">Angular Frequency ω</div>
                  <div className="text-lg font-bold text-emerald-300">{omega.toFixed(2)} rad/s</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Oscillation Period T</div>
                  <div className="text-lg font-bold text-sky-300">{period.toFixed(2)} s</div>
                </div>
              </div>

              <MathFormula
                latex={`T = 2\\pi\\sqrt{\\frac{m}{k}} = 2\\pi\\sqrt{\\frac{${springMass}}{${springK}}} = ${period.toFixed(2)}\\text{ s}`}
                size="md"
                highlight
                glowColor="#10b981"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Real-time SI physical unit modeling
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg"
          >
            Return to 60s Journey
          </button>
        </div>
      </div>
    </div>
  );
};
