export interface SceneConfig {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  duration: number;
  narration: string;
  category: string;
  color: string;
}

export const SCENES: SceneConfig[] = [
  {
    id: 'intro',
    number: 1,
    title: 'CINEMATIC INTRODUCTION',
    subtitle: 'The Universe. Motion. Energy. Everything Connected.',
    startTime: 0,
    endTime: 4,
    duration: 4,
    narration: 'The universe operates under fundamental mechanical laws. Motion, energy, and force connect every scale of existence.',
    category: 'Foundations',
    color: '#00f0ff'
  },
  {
    id: 'kinematics',
    number: 2,
    title: 'KINEMATICS & PROJECTILE MOTION',
    subtitle: 'Mapping motion through space and time',
    startTime: 4,
    endTime: 12,
    duration: 8,
    narration: 'Kinematics describes motion through position, velocity, and acceleration. Projectile motion combines horizontal movement with vertical acceleration due to gravity.',
    category: 'Motion',
    color: '#38bdf8'
  },
  {
    id: 'newton',
    number: 3,
    title: "NEWTON'S LAWS, FORCES & FRICTION",
    subtitle: 'The dynamical principles governing mass and interaction',
    startTime: 12,
    endTime: 20,
    duration: 8,
    narration: "Newton’s laws connect forces to motion. Objects resist changes in motion, net force produces acceleration, and every interaction involves equal and opposite forces on different objects.",
    category: 'Dynamics',
    color: '#a855f7'
  },
  {
    id: 'circular',
    number: 4,
    title: 'CIRCULAR MOTION',
    subtitle: 'Curvilinear trajectories and central acceleration',
    startTime: 20,
    endTime: 26,
    duration: 6,
    narration: 'Circular motion requires inward acceleration. The net inward force continuously changes the direction of velocity.',
    category: 'Radial Dynamics',
    color: '#06b6d4'
  },
  {
    id: 'energy',
    number: 5,
    title: 'WORK, ENERGY & CONSERVATION',
    subtitle: 'Transformation and preservation of mechanical states',
    startTime: 26,
    endTime: 34,
    duration: 8,
    narration: 'Work transfers energy. Kinetic energy comes from motion, potential energy comes from position, and mechanical energy is conserved when no nonconservative forces remove energy from the system.',
    category: 'Conservation',
    color: '#10b981'
  },
  {
    id: 'momentum',
    number: 6,
    title: 'MOMENTUM & COLLISIONS',
    subtitle: 'Mass in motion and impulse exchanges',
    startTime: 34,
    endTime: 41,
    duration: 7,
    narration: 'Momentum measures mass in motion. During a collision, momentum is conserved in an isolated system, while kinetic energy may or may not be conserved.',
    category: 'Impulse',
    color: '#f59e0b'
  },
  {
    id: 'rotation-gravity-oscillations',
    number: 7,
    title: 'ROTATION, GRAVITY & OSCILLATIONS',
    subtitle: 'Spinning systems, universal attraction, and periodic harmonic waves',
    startTime: 41,
    endTime: 53,
    duration: 12,
    narration: 'Rotation describes spinning motion. Gravity governs attraction between masses. Oscillations repeat around equilibrium, connecting springs, pendulums, and waves of motion.',
    category: 'Harmonics',
    color: '#ec4899'
  },
  {
    id: 'conclusion-branding',
    number: 8,
    title: 'UNIFIED MECHANICS & VISION',
    subtitle: 'Hammad — AI Engineer',
    startTime: 53,
    endTime: 60,
    duration: 7,
    narration: 'Physics I builds the rules of mechanics through interactions and motion. Building intelligent systems. Automating the future.',
    category: 'Conclusion',
    color: '#00f0ff'
  }
];

export const TOTAL_EXPERIENCE_DURATION = 60.0;
