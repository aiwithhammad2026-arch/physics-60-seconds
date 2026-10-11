import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { SCENES, TOTAL_EXPERIENCE_DURATION } from './types/physics';
import { soundEngine } from './audio/soundEngine';
import { speechEngine } from './audio/speechEngine';

import { IntroScene } from './components/scenes/IntroScene';
import { KinematicsScene } from './components/scenes/KinematicsScene';
import { NewtonLawsScene } from './components/scenes/NewtonLawsScene';
import { CircularMotionScene } from './components/scenes/CircularMotionScene';
import { EnergyScene } from './components/scenes/EnergyScene';
import { MomentumScene } from './components/scenes/MomentumScene';
import { RotationGravityOscillationsScene } from './components/scenes/RotationGravityOscillationsScene';
import { FinalBrandingScene } from './components/scenes/FinalBrandingScene';
import { TimelineControls } from './components/TimelineControls';
import { NarrationHUD } from './components/NarrationHUD';
import { InteractiveSandboxModal } from './components/InteractiveSandboxModal';

export const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);

  // Animation frame and high-precision timing refs
  const lastTimeRef = useRef<number | null>(null);
  const currentSceneIdxRef = useRef<number>(-1);
  const currentTimeRef = useRef<number>(0);

  // Keep ref synchronized
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // Scene transition audio & speech coordinator
  const checkSceneChange = useCallback((time: number) => {
    const sceneIdx = SCENES.findIndex(
      (s) => time >= s.startTime && time < s.endTime
    );
    const validIdx = sceneIdx !== -1 ? sceneIdx : SCENES.length - 1;

    if (validIdx !== currentSceneIdxRef.current) {
      currentSceneIdxRef.current = validIdx;
      const activeScene = SCENES[validIdx];
      // Play sonic transition
      soundEngine.playSceneTransition(validIdx);
      // Trigger voice narration
      speechEngine.speakSceneNarration(
        activeScene.number,
        activeScene.narration,
        playbackRate
      );
    }
  }, [playbackRate]);

  // Master Clock Animation Loop
  useEffect(() => {
    let animId: number;

    const tick = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        let nextTime = currentTimeRef.current + deltaSec * playbackRate;
        if (nextTime >= TOTAL_EXPERIENCE_DURATION) {
          nextTime = TOTAL_EXPERIENCE_DURATION;
          setIsPlaying(false);
        }
        setCurrentTime(nextTime);
        checkSceneChange(nextTime);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, playbackRate, checkSceneChange]);

  // Spacebar toggle shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      soundEngine.startAtmosphere();
      setIsPlaying(true);
      checkSceneChange(currentTime);
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      soundEngine.stopAtmosphere();
      speechEngine.pause();
    } else {
      if (currentTime >= TOTAL_EXPERIENCE_DURATION) {
        // Restart from beginning if ended
        seekTo(0);
      }
      setIsPlaying(true);
      soundEngine.startAtmosphere();
      speechEngine.resume();
      checkSceneChange(currentTime);
    }
  };

  // Seek / Scrubber Jump
  const seekTo = (targetSec: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_EXPERIENCE_DURATION, targetSec));
    setCurrentTime(clamped);
    currentTimeRef.current = clamped;
    currentSceneIdxRef.current = -1; // Force trigger check
    speechEngine.stop();
    checkSceneChange(clamped);
  };

  // Restart
  const handleRestart = () => {
    seekTo(0);
    setIsPlaying(true);
    soundEngine.startAtmosphere();
  };

  // Audio Toggles
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const handleToggleVoice = () => {
    const nextVoice = !isVoiceEnabled;
    setIsVoiceEnabled(nextVoice);
    speechEngine.setVoiceEnabled(nextVoice);
  };

  // Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Get active scene
  const activeScene = SCENES.find(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  ) || SCENES[SCENES.length - 1];

  return (
    <div className="relative w-screen h-screen bg-[#05070f] text-slate-100 flex flex-col justify-between overflow-hidden select-none font-['Inter']">
      {/* Dynamic Ambient Background Glow Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-25 transition-all duration-1000"
          style={{
            background:
              activeScene.id === 'kinematics'
                ? '#0284c7'
                : activeScene.id === 'newton'
                ? '#7c3aed'
                : activeScene.id === 'energy'
                ? '#059669'
                : activeScene.id === 'momentum'
                ? '#d97706'
                : activeScene.id === 'rotation-gravity-oscillations'
                ? '#db2777'
                : '#00f0ff',
          }}
        />
        <div className="absolute -bottom-[20%] -right-[10%] w-[55vw] h-[55vw] rounded-full blur-[150px] opacity-20 bg-indigo-900" />
      </div>

      {/* Top Header Bar */}
      <header className="z-30 flex items-center justify-between px-6 py-3 border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <span className="font-['Outfit'] font-black text-black text-sm">Φ</span>
          </div>
          <div>
            <h1 className="text-sm font-extrabold font-['Outfit'] text-white tracking-wide uppercase">
              All of Physics I in 60 Seconds
            </h1>
            <p className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
              Classical Mechanics · Interactive Motion Odyssey
            </p>
          </div>
        </div>

        {/* Master Branding Crest (Top Right) */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-white font-bold tracking-wider">HAMMAD</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400">AI ENGINEER</span>
          </div>
        </div>
      </header>

      {/* Main Stage Viewport (16:9 responsive presentation) */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
        {/* SCENE 1: Intro (0-4s) */}
        {currentTime < 4 && (
          <IntroScene currentTime={currentTime} duration={4} />
        )}

        {/* SCENE 2: Kinematics (4-12s) */}
        {currentTime >= 4 && currentTime < 12 && (
          <KinematicsScene currentTime={currentTime} startTime={4} duration={8} />
        )}

        {/* SCENE 3: Newton's Laws & Friction (12-20s) */}
        {currentTime >= 12 && currentTime < 20 && (
          <NewtonLawsScene currentTime={currentTime} startTime={12} duration={8} />
        )}

        {/* SCENE 4: Circular Motion (20-26s) */}
        {currentTime >= 20 && currentTime < 26 && (
          <CircularMotionScene currentTime={currentTime} startTime={20} duration={6} />
        )}

        {/* SCENE 5: Work, Energy & Conservation (26-34s) */}
        {currentTime >= 26 && currentTime < 34 && (
          <EnergyScene currentTime={currentTime} startTime={26} duration={8} />
        )}

        {/* SCENE 6: Momentum & Collisions (34-41s) */}
        {currentTime >= 34 && currentTime < 41 && (
          <MomentumScene currentTime={currentTime} startTime={34} duration={7} />
        )}

        {/* SCENE 7: Rotation, Gravity & Oscillations (41-53s) */}
        {currentTime >= 41 && currentTime < 53 && (
          <RotationGravityOscillationsScene currentTime={currentTime} startTime={41} duration={12} />
        )}

        {/* SCENE 8: Unified Mechanics & Hammad AI Engineer (53-60s) */}
        {currentTime >= 53 && (
          <FinalBrandingScene
            currentTime={currentTime}
            startTime={53}
            duration={7}
            onReplay={handleRestart}
          />
        )}

        {/* Subtitles & Documentary Narration HUD */}
        {hasStarted && (
          <NarrationHUD
            currentTime={currentTime}
            isPlaying={isPlaying}
            isMuted={isMuted}
            isVoiceEnabled={isVoiceEnabled}
          />
        )}

        {/* Initial Cinematic Play Launcher Overlay (If not started yet) */}
        {!hasStarted && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">
            <div className="flex flex-col items-center text-center max-w-lg p-8 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-[0_0_60px_rgba(0,240,255,0.3)]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-300 font-mono text-xs uppercase mb-6 tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cinematic Science Experience</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white uppercase tracking-tight">
                ALL OF PHYSICS I
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  IN 60 SECONDS
                </span>
              </h2>

              <p className="mt-4 text-slate-300 text-sm font-light leading-relaxed font-['Inter']">
                Experience classical mechanics through real-time mathematical animations, vector simulations, dynamic energy transfers, and synchronized narration.
              </p>

              <button
                onClick={togglePlay}
                className="mt-8 group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono tracking-wider uppercase text-sm shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>LAUNCH 60s JOURNEY</span>
              </button>

              <div className="mt-4 text-[11px] font-mono text-slate-500">
                Press [Space] anytime to Pause / Play
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Interactive Timeline Controls */}
      <TimelineControls
        currentTime={currentTime}
        isPlaying={isPlaying}
        isMuted={isMuted}
        isVoiceEnabled={isVoiceEnabled}
        playbackRate={playbackRate}
        isFullscreen={isFullscreen}
        isSandboxOpen={isSandboxOpen}
        onTogglePlay={togglePlay}
        onSeek={seekTo}
        onRestart={handleRestart}
        onToggleMute={handleToggleMute}
        onToggleVoice={handleToggleVoice}
        onChangeRate={setPlaybackRate}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleSandbox={() => setIsSandboxOpen(!isSandboxOpen)}
      />

      {/* Interactive Physics Sandbox Modal */}
      <InteractiveSandboxModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />
    </div>
  );
};

export default App;
