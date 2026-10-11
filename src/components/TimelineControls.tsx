import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Sliders,
} from 'lucide-react';
import { SCENES, TOTAL_EXPERIENCE_DURATION } from '../types/physics';

interface TimelineControlsProps {
  currentTime: number;
  isPlaying: boolean;
  isMuted: boolean;
  isVoiceEnabled: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isSandboxOpen: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onRestart: () => void;
  onToggleMute: () => void;
  onToggleVoice: () => void;
  onChangeRate: (rate: number) => void;
  onToggleFullscreen: () => void;
  onToggleSandbox: () => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentTime,
  isPlaying,
  isMuted,
  isVoiceEnabled,
  playbackRate,
  isFullscreen,
  isSandboxOpen,
  onTogglePlay,
  onSeek,
  onRestart,
  onToggleMute,
  onToggleVoice,
  onChangeRate,
  onToggleFullscreen,
  onToggleSandbox,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const progressPercent = Math.min(100, (currentTime / TOTAL_EXPERIENCE_DURATION) * 100);

  return (
    <div className="w-full bg-slate-950/85 border-t border-slate-800/80 backdrop-blur-xl px-4 py-3 select-none flex flex-col gap-2.5 z-40 transition-all duration-300">
      {/* Top Row: Scene Markers & Interactive Scrubber */}
      <div className="relative w-full flex flex-col gap-1.5">
        {/* Clickable Scene Segment Blocks */}
        <div className="w-full grid grid-cols-8 gap-1 h-1.5 rounded-full overflow-hidden">
          {SCENES.map((scene, idx) => {
            const isCurrentScene =
              currentTime >= scene.startTime && currentTime < scene.endTime;
            const isCompleted = currentTime >= scene.endTime;

            return (
              <button
                key={scene.id}
                onClick={() => onSeek(scene.startTime)}
                title={`Scene ${idx + 1}: ${scene.title} (${scene.startTime}s - ${scene.endTime}s)`}
                className={`h-full transition-all duration-200 cursor-pointer relative group ${
                  isCompleted
                    ? 'bg-cyan-500/80'
                    : isCurrentScene
                    ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                  <div className="bg-slate-900 border border-slate-700 text-white text-[10px] font-mono py-1 px-2.5 rounded shadow-xl whitespace-nowrap">
                    <span className="text-cyan-400 font-bold">0{idx + 1}. </span>
                    {scene.title}
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Continuous Scrubber Input Slider */}
        <div className="relative w-full flex items-center group">
          <input
            type="range"
            min="0"
            max={TOTAL_EXPERIENCE_DURATION}
            step="0.05"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800/80 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none transition-all group-hover:h-3"
            style={{
              background: `linear-gradient(to right, #00f0ff 0%, #38bdf8 ${progressPercent}%, rgba(30,41,59,0.8) ${progressPercent}%, rgba(30,41,59,0.8) 100%)`,
            }}
          />
        </div>
      </div>

      {/* Bottom Row: Control Buttons & Timestamp HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-slate-300">
        {/* Left: Play / Pause, Restart, Timecode */}
        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] active:scale-95"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Restart Experience"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Exact Timecode Display */}
          <div className="font-mono text-xs tracking-wider bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-semibold">{formatTime(TOTAL_EXPERIENCE_DURATION)}</span>
          </div>
        </div>

        {/* Center: Current Scene Title Badge */}
        <div className="hidden md:flex items-center gap-2 font-mono text-xs">
          {(() => {
            const activeScene = SCENES.find(
              (s) => currentTime >= s.startTime && currentTime < s.endTime
            ) || SCENES[SCENES.length - 1];
            return (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-bold">SCENE {activeScene.number}</span>
                <span className="text-slate-500">|</span>
                <span className="font-sans text-slate-200">{activeScene.title}</span>
              </div>
            );
          })()}
        </div>

        {/* Right: Audio, Voice, Speed, Sandbox, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Interactive Sandbox Toggle */}
          <button
            onClick={onToggleSandbox}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              isSandboxOpen
                ? 'bg-purple-500/25 border-purple-400/60 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Open Interactive Physics Sandbox"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SANDBOX</span>
          </button>

          {/* Playback Speed Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 font-mono text-[11px]">
            {[0.5, 1.0, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => onChangeRate(rate)}
                className={`px-2 py-1 rounded transition-colors ${
                  playbackRate === rate
                    ? 'bg-cyan-500/30 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg transition-colors ${
              isMuted ? 'text-rose-400 bg-rose-950/40 border border-rose-800/40' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title={isMuted ? 'Unmute Ambient Synthesizer' : 'Mute Ambient Synthesizer'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Voice Narration Toggle */}
          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-lg transition-colors ${
              !isVoiceEnabled ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title={isVoiceEnabled ? 'Disable Voice Narration' : 'Enable Voice Narration'}
          >
            {isVoiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
