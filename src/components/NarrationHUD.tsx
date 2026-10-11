import React from 'react';
import { SCENES } from '../types/physics';

interface NarrationHUDProps {
  currentTime: number;
  isPlaying: boolean;
  isMuted: boolean;
  isVoiceEnabled: boolean;
}

export const NarrationHUD: React.FC<NarrationHUDProps> = ({
  currentTime,
  isPlaying,
  isMuted,
  isVoiceEnabled,
}) => {
  const activeScene = SCENES.find(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  ) || SCENES[SCENES.length - 1];

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 max-w-3xl w-[92%] pointer-events-none">
      <div className="bg-slate-950/85 border border-slate-800/80 rounded-2xl px-5 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl flex items-center gap-4">
        {/* Audio Visualizer Pulse */}
        <div className="flex items-center gap-0.5 h-6">
          {[1, 2, 3, 4].map((bar) => (
            <span
              key={bar}
              className={`w-1 rounded-full transition-all duration-200 ${
                isPlaying && isVoiceEnabled && !isMuted
                  ? 'bg-cyan-400 animate-pulse'
                  : 'bg-slate-700 h-2'
              }`}
              style={{
                height: isPlaying && isVoiceEnabled && !isMuted ? `${Math.max(6, Math.sin(currentTime * 8 + bar) * 16 + 10)}px` : '6px',
              }}
            />
          ))}
        </div>

        {/* Narration Text Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
              DOCUMENTARY NARRATION · SCENE 0{activeScene.number}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-['Inter'] text-slate-200 leading-snug font-normal drop-shadow">
            “{activeScene.narration}”
          </p>
        </div>
      </div>
    </div>
  );
};
