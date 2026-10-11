# ALL OF PHYSICS I IN 60 SECONDS

> An interactive, cinematic 60-second animated documentary journey through classical mechanics, built with modern web technologies and scientific simulations.

---

## 🌌 Overview

**All of Physics I in 60 Seconds** is a futuristic, dark-mode educational experience explaining the foundational principles of Classical Mechanics in exactly one minute. It combines real-time physics calculations, mathematical typography, a Web Audio synthesizer soundtrack, voice narration, and an interactive physics laboratory.

### Core Architecture: 8 Synchronized Scenes

1. **Scene 01 (0–4s) · Cinematic Introduction**: 3D perspective grid, particle starfield, and laser sweep.
2. **Scene 02 (4–12s) · Kinematics & Projectiles**: 2D ballistic trajectory, velocity vector decomposition ($\vec{v}, v_x, v_y$), gravitational acceleration $\vec{g} = 9.8\text{ m/s}^2$, and live telemetry HUD.
3. **Scene 03 (12–20s) · Newton's Laws & Friction**: Free-body diagram with normal force, weight, applied force, friction $\vec{f}_k = \mu_k N$, net acceleration, and Newton's 3rd law interaction.
4. **Scene 04 (20–26s) · Circular Motion**: Inward centripetal acceleration $\vec{a}_c = v^2/r$, perpendicular tangential velocity $\vec{v}_t$, and angle sweep.
5. **Scene 05 (26–34s) · Work & Energy Conservation**: Roller coaster track with synchronized real-time bar graphs converting Potential Energy $U = mgh$ to Kinetic Energy $K = \frac{1}{2}mv^2$ with total energy $E_{\text{total}}$ conserved.
6. **Scene 06 (34–41s) · Momentum & Collisions**: Two colliding spheres ($m_1, m_2$), momentum vectors before/after, impact flash shockwave, audio boom trigger, and impulse $\vec{J} = \Delta \vec{p}$.
7. **Scene 07 (41–53s) · Rotation, Gravity & Oscillations**:
   - **7A:** Rotational dynamics, torque $\tau = rF\sin\theta$, and moment of inertia $I$.
   - **7B:** Universal gravitation $F = G\frac{m_1 m_2}{r^2}$ and spacetime curvature.
   - **7C:** Simple harmonic motion with coiled spring and real-time synchronized oscilloscope waveform $x(t) = A\cos(\omega t)$.
8. **Scene 08 (53–60s) · Grand Unification & Personal Branding**:
   - Fundamental pillars: **MOTION · FORCES · ENERGY · MOMENTUM · ROTATION**
   - Personal branding: **HAMMAD — AI ENGINEER** · *“Building Intelligent Systems. Automating the Future.”*

---

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS + Vanilla CSS Glow & Glassmorphic Utilities
- **Math Engine:** KaTeX
- **Audio Synthesizer:** Web Audio API (standalone synthetic ambient drones, chord swells, impacts, risers)
- **Narration:** Web Speech API (`SpeechSynthesis`) + Subtitles HUD
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/physics-60-seconds.git

# Navigate into project directory
cd physics-60-seconds

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

---

## 🎮 Interactive Controls

- **Play / Pause:** Spacebar or click the central button
- **Timeline Scrubber:** Jump directly to any of the 8 scenes
- **Speed Multiplier:** Toggle between `0.5x`, `1.0x`, and `1.5x`
- **Sandbox Mode:** Click `SANDBOX` to tweak projectile velocity, launch angles, gravity, friction coefficients, and spring stiffness in real time.
- **Audio Controls:** Toggle synth atmosphere and voice narration independently.

---

## 👨‍💻 Creator

**HAMMAD**  
*AI Engineer*  
*“Building Intelligent Systems. Automating the Future.”*
