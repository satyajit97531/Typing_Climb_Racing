import { CarModel } from '../types';

export const CAR_MODELS: CarModel[] = [
  {
    id: 'velocity-r1',
    name: 'Hill Climber',
    tagline: "Bill Newton's Classic Red Jeep",
    category: 'Street',
    price: 0,
    baseAcceleration: 1.0,
    baseHandling: 1.0,
    unlockedByDefault: true,
    defaultColor: '#dc2626', // Classic Crimson Red
    accentColor: '#facc15',
    description: 'The iconic 4x4 red jeep with flexible suspension springs and bouncy offroad tires.',
  },
  {
    id: 'farm-tractor',
    name: 'Country Tractor',
    tagline: 'Farm Champion with Giant Ribbed Wheels',
    category: 'Street',
    price: 350,
    baseAcceleration: 1.1,
    baseHandling: 1.15,
    defaultColor: '#16a34a', // John Deere Green
    accentColor: '#eab308',
    description: 'A vintage farm tractor with enormous high-traction rear lug tires and a smoking vertical exhaust pipe.',
  },
  {
    id: 'neon-drift-gt',
    name: 'Monster Truck',
    tagline: 'Giant Wheels & Heavy Suspension',
    category: 'Tuner',
    price: 600,
    baseAcceleration: 1.2,
    baseHandling: 1.3,
    defaultColor: '#ea580c', // Bright Orange
    accentColor: '#38bdf8',
    description: 'Massive heavy-duty knobby tires and elevated suspension built to conquer steep dirt cliffs.',
  },
  {
    id: 'hippie-bus',
    name: 'Hippie Van',
    tagline: 'Flower Power Bus with Roof Surfboard',
    category: 'Tuner',
    price: 1100,
    baseAcceleration: 1.25,
    baseHandling: 1.2,
    defaultColor: '#06b6d4', // Pastel Cyan
    accentColor: '#f43f5e',
    description: 'The classic split-window bus carrying a rooftop surfboard, psychedelic paint, and bouncy passenger weight.',
  },
  {
    id: 'phantom-gt',
    name: 'Motocross Bike',
    tagline: 'Airborne 2-Wheel Stunt Machine',
    category: 'Super',
    price: 1500,
    baseAcceleration: 1.35,
    baseHandling: 1.4,
    defaultColor: '#2563eb', // Royal Blue
    accentColor: '#eab308',
    description: 'Lightweight motocross frame engineered for soaring airtime and hill flips.',
  },
  {
    id: 'hovercraft-x',
    name: 'Hovercraft X',
    tagline: 'Air Cushion Glider with Twin Propellers',
    category: 'Super',
    price: 2000,
    baseAcceleration: 1.4,
    baseHandling: 1.5,
    defaultColor: '#0284c7', // Sky Blue
    accentColor: '#fbbf24',
    description: 'Floats on an inflatable pressurized air cushion with dual high-RPM propellers that glide over rough terrain.',
  },
  {
    id: 'inferno-v8',
    name: 'Dune Buggy',
    tagline: 'Low-Slung Sand & Dirt Racer',
    category: 'Street',
    price: 2400,
    baseAcceleration: 1.5,
    baseHandling: 1.2,
    defaultColor: '#16a34a', // Grass Green
    accentColor: '#f97316',
    description: 'Tubular roll-cage sand buggy with rear paddle tires and direct-drive torque.',
  },
  {
    id: 'battle-tank',
    name: 'Heavy Tank',
    tagline: 'Continuous Caterpillar Treads & Turret',
    category: 'Hyper',
    price: 3200,
    baseAcceleration: 1.55,
    baseHandling: 1.45,
    defaultColor: '#4d7c0f', // Military Olive
    accentColor: '#000000',
    description: 'Full steel armored combat chassis with continuous rubberized road tracks and a revolving 360 cannon.',
  },
  {
    id: 'apex-formula-1',
    name: 'Rally Car',
    tagline: 'Gravel Champion with Downforce Spoiler',
    category: 'Hyper',
    price: 4000,
    baseAcceleration: 1.65,
    baseHandling: 1.6,
    defaultColor: '#facc15', // Racing Yellow
    accentColor: '#dc2626',
    description: 'Turbocharged all-wheel-drive rally machine built for gravel slides and jump landings.',
  },
  {
    id: 'formula-apex',
    name: 'Formula Hill Racer',
    tagline: 'Grand Prix Open-Wheel Downforce Monster',
    category: 'Prototype',
    price: 5500,
    baseAcceleration: 1.75,
    baseHandling: 1.7,
    defaultColor: '#e11d48', // Apex Rose Crimson
    accentColor: '#38bdf8',
    description: 'Extreme aerodynamic ground-effect wings and racing slicks designed for supersonic hill climbs.',
  },
  {
    id: 'cyber-solaris',
    name: 'Super Diesel 4x4',
    tagline: 'Twin-Exhaust Heavy Hill Destroyer',
    category: 'Prototype',
    price: 7500,
    baseAcceleration: 1.85,
    baseHandling: 1.7,
    defaultColor: '#7c3aed', // Purple Thunder
    accentColor: '#06b6d4',
    description: 'A monster diesel beast fitted with dual smokestacks and maximum hill-climbing traction.',
  },
  {
    id: 'quad-bike',
    name: 'Quad Bike (ATV)',
    tagline: 'Agile 4-Wheel All-Terrain Machine',
    category: 'Street',
    price: 850,
    baseAcceleration: 1.3,
    baseHandling: 1.35,
    defaultColor: '#f97316', // Blaze Orange
    accentColor: '#1e293b',
    description: '4-wheel all-terrain quad with front bull guard, wide handlebars, and explosive low-end hill torque.',
  },
  {
    id: 'ambulance-rescue',
    name: 'Hill Ambulance',
    tagline: 'Emergency Paramedic Rescue Van',
    category: 'Tuner',
    price: 1350,
    baseAcceleration: 1.35,
    baseHandling: 1.25,
    defaultColor: '#f8fafc', // Medical White
    accentColor: '#dc2626',
    description: 'High-clearance emergency medical rescue van with red crosses and emergency roof beacon.',
  },
  {
    id: 'police-cruiser',
    name: 'Police Patrol Cruiser',
    tagline: 'Highway Pursuit with Flashing Sirens',
    category: 'Tuner',
    price: 1850,
    baseAcceleration: 1.45,
    baseHandling: 1.35,
    defaultColor: '#0f172a', // Midnight Black / White doors
    accentColor: '#ef4444',
    description: 'Iconic patrol cruiser equipped with animated flashing red-and-blue roof sirens and a steel push bumper.',
  },
  {
    id: 'rock-crawler',
    name: 'Rock Crawler 4x4',
    tagline: 'Exo-Cage Monster with Massive Wheel Travel',
    category: 'Super',
    price: 2900,
    baseAcceleration: 1.55,
    baseHandling: 1.5,
    defaultColor: '#eab308', // High-vis Gold
    accentColor: '#15803d',
    description: 'Full tubular roll cage and long-travel coilover shock springs engineered to conquer vertical cliff faces.',
  },
  {
    id: 'snow-sled',
    name: 'Snowmobile Blizzard',
    tagline: 'Steerable Front Skis & Rear Snow Track',
    category: 'Super',
    price: 3600,
    baseAcceleration: 1.6,
    baseHandling: 1.55,
    defaultColor: '#06b6d4', // Glacier Cyan
    accentColor: '#f43f5e',
    description: 'Alpine winter mountain snowmobile with tinted windshield, front dual skis, and a high-grip caterpillar track.',
  },
  {
    id: 'lunar-rover',
    name: 'Moon Lander Buggy',
    tagline: 'NASA Space Rover with Thrusters',
    category: 'Hyper',
    price: 4900,
    baseAcceleration: 1.7,
    baseHandling: 1.65,
    defaultColor: '#fef08a', // Gold Foil
    accentColor: '#38bdf8',
    description: 'Lunar exploration rover wrapped in golden thermal insulation with a steerable parabolic dish and thruster jets.',
  },
  {
    id: 'onewheel-gyro',
    name: 'Onewheel Gyro-Cycle',
    tagline: 'Single-Wheel Gyroscopic Stunt Machine',
    category: 'Prototype',
    price: 6800,
    baseAcceleration: 1.82,
    baseHandling: 1.78,
    defaultColor: '#ec4899', // Neon Magenta
    accentColor: '#facc15',
    description: 'High-tech motorized single-wheel unicycle where Bill balances right above a giant spinning gyro wheel!',
  },
];

export const PAINT_COLORS = [
  { name: 'Classic Red', hex: '#dc2626' },
  { name: 'Tractor Green', hex: '#16a34a' },
  { name: 'Hilltop Orange', hex: '#ea580c' },
  { name: 'Sunny Yellow', hex: '#facc15' },
  { name: 'Sky Blue', hex: '#0284c7' },
  { name: 'Royal Purple', hex: '#7c3aed' },
  { name: 'Army Olive', hex: '#4d7c0f' },
  { name: 'Pastel Teal', hex: '#06b6d4' },
  { name: 'Night Matte', hex: '#1e293b' },
  { name: 'Hot Pink', hex: '#ec4899' },
];

export const UNDERGLOW_OPTIONS = [
  { name: 'None', hex: 'none', cost: 0 },
  { name: 'Golden Glow', hex: '#facc15', cost: 200 },
  { name: 'Spring Green', hex: '#4ade80', cost: 250 },
  { name: 'Sky Cyan', hex: '#38bdf8', cost: 300 },
  { name: 'Fire Orange', hex: '#fb923c', cost: 350 },
  { name: 'Neon Purple', hex: '#c084fc', cost: 400 },
];

// The classic 4 Hill Climb Racing Upgrade Categories: ENGINE, 4WD/BOOST, SUSPENSION, TIRES
export const UPGRADE_TIERS = {
  engine: [
    { level: 1, name: 'Stock 4-Cylinder', boostText: 'Level 1 Engine', cost: 0 },
    { level: 2, name: 'Tuned Carburetor', boostText: 'Level 2 · +10% Hill Speed', cost: 250 },
    { level: 3, name: 'Twin Turbocharger', boostText: 'Level 3 · +22% Hill Speed', cost: 600 },
    { level: 4, name: 'Bored Out Cylinders', boostText: 'Level 4 · +35% Hill Speed', cost: 1200 },
    { level: 5, name: 'Racing V8 Monster', boostText: 'Level 5 · +50% Hill Speed', cost: 2500 },
  ],
  nitro: [
    { level: 1, name: 'Stock 4WD Drive', boostText: 'Level 1 Boost', cost: 0 },
    { level: 2, name: 'Front Locking Diff', boostText: 'Level 2 · 1.25x Nitro Boost', cost: 200 },
    { level: 3, name: 'Heavy Duty 4WD', boostText: 'Level 3 · 1.35x Nitro Boost', cost: 550 },
    { level: 4, name: 'Nitrous Canister', boostText: 'Level 4 · 1.45x Nitro Boost', cost: 1100 },
    { level: 5, name: 'Super Turbo Injector', boostText: 'Level 5 · 1.60x Nitro Boost', cost: 2200 },
  ],
  spoilers: [
    { level: 0, name: 'Stock Suspension', boostText: 'Level 0 Suspension', cost: 0 },
    { level: 1, name: 'Soft Coil Springs', boostText: 'Level 1 · Shock Absorbers', cost: 180 },
    { level: 2, name: 'Long-Travel Shocks', boostText: 'Level 2 · Bouncy Hill Damping', cost: 450 },
    { level: 3, name: 'Apex Trophy Suspension', boostText: 'Level 3 · Airtime Stability', cost: 950 },
  ],
  tires: [
    { level: 1, name: 'Standard Rubber', boostText: 'Level 1 Grip', cost: 0 },
    { level: 2, name: 'Mud Siping Tires', boostText: 'Level 2 · Hill Grip +15%', cost: 220 },
    { level: 3, name: 'Chunky Offroad Knobbies', boostText: 'Level 3 · Hill Grip +30%', cost: 500 },
    { level: 4, name: 'Spiked Ice Slicks', boostText: 'Level 4 · Hill Grip +45%', cost: 1000 },
    { level: 5, name: 'Monster Dirt Claws', boostText: 'Level 5 · Hill Grip +65%', cost: 2000 },
  ],
};
