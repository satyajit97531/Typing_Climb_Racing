export interface TypingPassage {
  id: string;
  category: 'Motorsport' | 'Adrenaline' | 'Sci-Fi' | 'Wisdom' | 'Speed';
  difficulty: 'Rookie' | 'Pro' | 'Grand Prix';
  text: string;
  source: string;
}

export const TYPING_PASSAGES: TypingPassage[] = [
  {
    id: 'pass-1',
    category: 'Motorsport',
    difficulty: 'Rookie',
    text: "The green flag drops and tires grip the cold pavement with sheer friction. Accelerate hard out of the apex and shift up as the tachometer screams.",
    source: "Apex Racing Chronicles",
  },
  {
    id: 'pass-2',
    category: 'Speed',
    difficulty: 'Pro',
    text: "To be a champion, you have to find that razor edge where the car is on the absolute verge of spinning out, yet your hands stay relaxed and steady on the steering wheel.",
    source: "Ayrton Senna Wisdom",
  },
  {
    id: 'pass-3',
    category: 'Adrenaline',
    difficulty: 'Pro',
    text: "Adrenaline floods your veins as the headlights pierce through the midnight fog. Every gear change is instantaneous, sending a surge of raw horsepower through the carbon drivetrain.",
    source: "Night Drift Manifesto",
  },
  {
    id: 'pass-4',
    category: 'Sci-Fi',
    difficulty: 'Grand Prix',
    text: "Plasma injectors ignite with a luminous cyan burst. Magnetic suspension cushions the immense gravitational pull as the prototype hypercar surges past two hundred miles per hour down the neon straightaway.",
    source: "Cyber Circuit 2099",
  },
  {
    id: 'pass-5',
    category: 'Motorsport',
    difficulty: 'Rookie',
    text: "Precision is more important than sheer power. Brake late into the chicane, kiss the rumble strips, and let the twin turbos spool up for the long sprint to the finish line.",
    source: "Track Day Manual",
  },
  {
    id: 'pass-6',
    category: 'Wisdom',
    difficulty: 'Pro',
    text: "Speed has never killed anyone. Suddenly becoming stationary, that is what gets you. Focus on the rhythm of your fingers, breathe deeply, and maintain complete momentum.",
    source: "Grand Tour Philosophy",
  },
  {
    id: 'pass-7',
    category: 'Motorsport',
    difficulty: 'Grand Prix',
    text: "Downforce presses the chassis flush against the tarmac at blistering velocities. When you hit the DRS activation line, the rear wing tilts open, carving through the slipstream like a supersonic jet.",
    source: "Aerodynamic Engineering",
  },
  {
    id: 'pass-8',
    category: 'Speed',
    difficulty: 'Rookie',
    text: "The engine purrs at idle before erupting into a fierce roar. Keep your eyes fixed on the horizon, hold the racing line, and let your instincts take command.",
    source: "Street Performance Guide",
  },
  {
    id: 'pass-9',
    category: 'Adrenaline',
    difficulty: 'Pro',
    text: "Under the stadium floodlights, exhaust flames illuminate the night sky with brilliant bursts of amber and blue. Every fraction of a second won on this circuit is forged through sheer concentration.",
    source: "Endurance Cup Highlights",
  },
  {
    id: 'pass-10',
    category: 'Sci-Fi',
    difficulty: 'Grand Prix',
    text: "Quantum telemetry transmits thousand calculations per second into the heads-up display. Synchronize your cadence, anticipate each turn, and unleash the full nitrous burst toward the checkered flag.",
    source: "Apex Velocity League",
  },
];

export function getRandomPassage(): TypingPassage {
  const index = Math.floor(Math.random() * TYPING_PASSAGES.length);
  return TYPING_PASSAGES[index];
}
