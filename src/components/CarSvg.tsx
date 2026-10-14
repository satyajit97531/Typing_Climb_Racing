import React from 'react';
import { CarCustomization } from '../types';

interface CarSvgProps {
  carId: string;
  customization?: Partial<CarCustomization>;
  isBoosting?: boolean;
  className?: string;
  scale?: number;
}

export const CarSvg: React.FC<CarSvgProps> = ({
  carId,
  customization = {},
  isBoosting = false,
  className = '',
  scale = 1,
}) => {
  const primaryColor = customization.color || '#dc2626';

  const isMonster = carId === 'neon-drift-gt';
  const isBike = carId === 'phantom-gt';
  const isBuggy = carId === 'inferno-v8';
  const isRally = carId === 'apex-formula-1';
  const isDiesel = carId === 'cyber-solaris';
  const isTractor = carId === 'farm-tractor';
  const isBus = carId === 'hippie-bus';
  const isHovercraft = carId === 'hovercraft-x';
  const isTank = carId === 'battle-tank';
  const isFormula = carId === 'formula-apex';
  // New Vehicles:
  const isQuad = carId === 'quad-bike';
  const isAmbulance = carId === 'ambulance-rescue';
  const isPolice = carId === 'police-cruiser';
  const isRockCrawler = carId === 'rock-crawler';
  const isSnowSled = carId === 'snow-sled';
  const isLunar = carId === 'lunar-rover';
  const isOnewheel = carId === 'onewheel-gyro';

  return (
    <div className={`relative inline-block select-none ${className}`} style={{ transform: `scale(${scale})` }}>
      <svg
        viewBox="0 0 160 85"
        className="w-full h-auto overflow-visible filter drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cartoon Dirt / Exhaust Smoke Puff */}
          <radialGradient id="smokePuff" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#e2e8f0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
          </radialGradient>

          {/* Nitro flame */}
          <linearGradient id="hcrNitro" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
          </linearGradient>

          {/* Chunky Tire Gradient */}
          <radialGradient id="hcrTire" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Chrome Rim */}
          <radialGradient id="hcrRim" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>
        </defs>

        {/* 1. Cartoon Exhaust Puffs or Nitro Fire */}
        {isBoosting ? (
          <g className="animate-nitro" transform="translate(4, 52)">
            <path
              d="M 12 0 C -10 -8, -25 -5, -36 0 C -25 5, -10 8, 12 0 Z"
              fill="url(#hcrNitro)"
              stroke="#b91c1c"
              strokeWidth="1.5"
            />
            <path
              d="M 12 0 C -4 -4, -16 -2, -22 0 C -16 2, -4 4, 12 0 Z"
              fill="#ffffff"
            />
          </g>
        ) : (
          <g transform={`translate(${isTractor ? 104 : 10}, ${isTractor ? 22 : 52})`}>
            {/* Cartoon exhaust puffs (high for tractor stack, low for cars) */}
            <circle cx="-6" cy="-2" r="4" fill="url(#smokePuff)" />
            <circle cx="-14" cy="-5" r="5" fill="url(#smokePuff)" opacity="0.7" />
            <circle cx="-24" cy="-9" r="6" fill="url(#smokePuff)" opacity="0.4" />
          </g>
        )}

        {/* 2. Suspension Springs (bouncy coils, except tank/hovercraft) */}
        {!isTank && !isHovercraft && (
          <g stroke="#334155" strokeWidth="2.5" fill="none">
            <path d="M 40 46 Q 36 50 40 54 Q 44 58 40 62 Q 36 66 40 70" />
            <path d="M 118 46 Q 114 50 118 54 Q 122 58 118 62 Q 114 66 118 70" />
          </g>
        )}

        {/* 3. Driver (Bill Newton with Cap & Smile!) for open cabin vehicles */}
        {!isMonster && !isDiesel && !isBus && !isTank && !isAmbulance && !isPolice ? (
          <g
            transform={`translate(${
              isTractor ? 42 : 
              isFormula ? 68 : 
              isQuad ? 50 : 
              isRockCrawler ? 56 : 
              isLunar ? 60 : 
              isSnowSled ? 58 : 
              isOnewheel ? 62 : 
              56
            }, ${
              isFormula ? 24 : 
              isOnewheel ? 6 : 
              isQuad ? 12 : 
              isRockCrawler ? 14 : 
              18
            })`}
          >
            {/* Driver Body / Shirt */}
            <path
              d="M 10 26 C 6 22, 14 16, 20 16 C 26 16, 32 22, 28 26 Z"
              fill={isTractor ? '#15803d' : isLunar ? '#e2e8f0' : isSnowSled ? '#0284c7' : '#0284c7'}
              stroke="#0369a1"
              strokeWidth="2"
            />
            {/* Driver Hands on Steering Wheel / Handlebars */}
            <path d="M 22 22 L 32 24" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" />
            <circle cx="33" cy="24" r="5" stroke="#1e293b" strokeWidth="2.5" fill="none" />

            {/* Driver Head (Classic Bill Newton) */}
            <ellipse cx="18" cy="11" rx="8" ry="8" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
            <circle cx="21" cy="9" r="2" fill="#0f172a" />
            <circle cx="22" cy="8.5" r="0.7" fill="#ffffff" />
            <ellipse cx="25" cy="11" rx="2.5" ry="2" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <path d="M 19 14 Q 23 17 25 14" stroke="#ca8a04" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Bill's Cap / Helmet */}
            <path
              d="M 9 9 C 9 3, 27 3, 27 9 Z"
              fill={isTractor ? '#ca8a04' : isLunar ? '#e2e8f0' : isSnowSled ? '#f43f5e' : '#dc2626'}
              stroke="#991b1b"
              strokeWidth="1.5"
            />
            <path d="M 22 9 L 32 10 L 26 13 Z" fill={isLunar ? '#cbd5e1' : '#991b1b'} />
          </g>
        ) : null}

        {/* 4. Car Body By Vehicle Model */}
        {isTractor ? (
          // FARM TRACTOR
          <g>
            {/* Rear Mudguard Arch */}
            <path d="M 18 52 C 18 28, 56 28, 56 52" fill={primaryColor} stroke="#0f172a" strokeWidth="3" />
            {/* Tractor Engine Hood & Grille */}
            <path
              d="M 52 48 L 52 32 L 118 32 L 126 42 L 126 54 L 52 54 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Front Yellow Grille */}
            <rect x="122" y="36" width="4" height="14" fill="#facc15" stroke="#0f172a" strokeWidth="1" />
            {/* Vertical Smokestack */}
            <rect x="106" y="16" width="5" height="18" rx="1.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="104" y="14" width="9" height="3" rx="1" fill="#475569" />
            {/* Seat Spring & Pan */}
            <path d="M 38 42 L 48 42" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            {/* Steering Column */}
            <line x1="68" y1="34" x2="60" y2="44" stroke="#0f172a" strokeWidth="3" />
          </g>
        ) : isBus ? (
          // HIPPIE VAN (VW-style Bus)
          <g>
            {/* Roof Surfboard & Rack */}
            <path d="M 32 12 Q 80 8 132 12 Q 80 14 32 12 Z" fill="#facc15" stroke="#ea580c" strokeWidth="1.5" />
            <line x1="38" y1="14" x2="126" y2="14" stroke="#1e293b" strokeWidth="2.5" />
            <line x1="48" y1="14" x2="48" y2="18" stroke="#1e293b" strokeWidth="2" />
            <line x1="116" y1="14" x2="116" y2="18" stroke="#1e293b" strokeWidth="2" />

            {/* Van Body Tub */}
            <path
              d="M 22 52 L 22 22 Q 24 16 34 16 L 122 16 Q 138 18 142 34 L 142 54 L 22 54 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* White Top Half Band */}
            <path
              d="M 23 20 L 122 20 Q 136 22 138 34 L 140 38 L 23 38 Z"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Panoramic Windows */}
            <rect x="30" y="22" width="18" height="13" rx="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <rect x="54" y="22" width="22" height="13" rx="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <rect x="82" y="22" width="22" height="13" rx="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <polygon points="110,22 126,22 132,35 110,35" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            {/* Front Peace Sign / Flower Decal */}
            <circle cx="132" cy="45" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          </g>
        ) : isHovercraft ? (
          // HOVERCRAFT X
          <g>
            {/* Giant Inflatable Black Rubber Skirt Cushion Base */}
            <ellipse cx="80" cy="58" rx="64" ry="12" fill="#0f172a" stroke="#020617" strokeWidth="3" />
            <ellipse cx="80" cy="56" rx="58" ry="9" fill="#1e293b" />

            {/* Aerodynamic Hull */}
            <path
              d="M 28 50 L 40 34 L 120 34 L 138 48 L 132 54 L 28 54 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Jet Cockpit Canopy */}
            <path d="M 68 34 L 88 22 L 118 34 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />

            {/* Dual Rear High-RPM Propeller Fan Ducts */}
            <circle cx="38" cy="30" r="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="38" cy="30" r="5" fill="#eab308" />
            {/* Spinning Blades */}
            <line x1="28" y1="30" x2="48" y2="30" stroke="#f8fafc" strokeWidth="2.5" />
            <line x1="38" y1="20" x2="38" y2="40" stroke="#f8fafc" strokeWidth="2.5" />
          </g>
        ) : isTank ? (
          // BATTLE TANK
          <g>
            {/* Armored Hull */}
            <polygon points="26,52 38,40 120,40 134,52 130,58 24,58" fill={primaryColor} stroke="#0f172a" strokeWidth="3" />
            {/* Revolving Turret */}
            <path d="M 60 40 L 72 26 L 102 26 L 110 40 Z" fill="#365314" stroke="#0f172a" strokeWidth="2.5" />
            {/* Long Cannon Barrel */}
            <rect x="102" y="28" width="46" height="5" rx="1.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="148" cy="30.5" r="4" fill="#475569" stroke="#0f172a" strokeWidth="1" />
            {/* Commander Hatch */}
            <ellipse cx="86" cy="25" rx="6" ry="2" fill="#1e293b" />
          </g>
        ) : isFormula ? (
          // FORMULA HILL RACER
          <g>
            {/* Front Massive Wing */}
            <polygon points="132,56 156,54 154,60 130,60" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
            <rect x="150" y="50" width="3" height="12" rx="1" fill={primaryColor} />

            {/* Needle Formula Body */}
            <path
              d="M 22 50 L 40 44 L 84 38 L 138 52 L 146 56 L 22 56 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Driver Cockpit & Roll Hoop */}
            <path d="M 66 38 L 76 26 L 86 38 Z" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />

            {/* Rear Massive Downforce Wing */}
            <line x1="26" y1="30" x2="26" y2="48" stroke="#0f172a" strokeWidth="3" />
            <polygon points="12,28 38,28 34,34 14,34" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
            <rect x="10" y="24" width="3" height="12" rx="1" fill={primaryColor} />
          </g>
        ) : isMonster ? (
          // Monster Truck Body
          <g>
            <path
              d="M 32 38 L 52 14 L 98 14 L 126 38 Z"
              fill="#0f172a"
              stroke="#020617"
              strokeWidth="3"
            />
            <polygon points="56,18 74,18 74,34 46,34" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <polygon points="78,18 94,18 116,34 78,34" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />

            <path
              d="M 18 42 L 40 36 L 128 36 L 142 44 L 140 52 L 18 52 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            <path
              d="M 38 48 Q 65 38 78 48 Q 95 38 120 44 L 130 50 Z"
              fill="#facc15"
              stroke="#eab308"
              strokeWidth="1.5"
            />
            <circle cx="60" cy="11" r="3.5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="75" cy="11" r="3.5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="90" cy="11" r="3.5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          </g>
        ) : isBike ? (
          // Motocross Bike Frame
          <g>
            <path
              d="M 40 55 L 75 42 L 95 35 L 115 50 L 80 56 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            <path d="M 60 40 L 85 40 L 78 46 L 62 46 Z" fill="#0f172a" />
            <path d="M 96 35 L 102 22 L 110 24" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 68 52 L 42 50 L 32 46" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ) : isBuggy ? (
          // Dune Buggy Tube Frame
          <g>
            <path
              d="M 30 48 L 54 22 L 98 22 L 126 44 L 138 48"
              stroke="#1e293b"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M 62 22 L 62 48" stroke="#1e293b" strokeWidth="3" />
            <path d="M 90 22 L 94 48" stroke="#1e293b" strokeWidth="3" />
            <path
              d="M 22 50 L 46 44 L 134 44 L 144 50 L 140 56 L 22 56 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <rect x="22" y="38" width="16" height="12" rx="2" fill="#475569" stroke="#0f172a" strokeWidth="2" />
          </g>
        ) : isRally ? (
          // Rally Car with Spoiler
          <g>
            <path
              d="M 36 38 L 54 20 L 98 20 L 122 38 Z"
              fill="#0f172a"
              stroke="#020617"
              strokeWidth="3"
            />
            <polygon points="56,24 74,24 74,36 46,36" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <polygon points="78,24 96,24 114,36 78,36" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <path
              d="M 18 40 L 40 38 L 132 38 L 146 44 L 144 52 L 18 52 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            <path d="M 16 24 L 34 24 L 30 38 L 22 38 Z" fill="#0f172a" stroke="#020617" strokeWidth="2" />
            <circle cx="85" cy="45" r="6" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
            <text x="85" y="48" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#0f172a" fontFamily="sans-serif">
              42
            </text>
          </g>
        ) : isDiesel ? (
          // Super Diesel 4x4
          <g>
            <rect x="52" y="16" width="58" height="30" rx="3" fill="#0f172a" stroke="#020617" strokeWidth="3" />
            <rect x="68" y="20" width="38" height="18" rx="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <path
              d="M 22 42 L 52 40 L 138 40 L 148 48 L 144 56 L 22 56 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            <rect x="44" y="8" width="5" height="34" rx="2" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
            <rect x="42" y="6" width="9" height="4" rx="1" fill="#475569" />
          </g>
        ) : isQuad ? (
          // QUAD BIKE (ATV 4-Wheeler)
          <g>
            {/* Front steel bull-bar bumper */}
            <path d="M 122 52 L 138 48 L 138 40 L 126 42" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Wide Riser Handlebars */}
            <path d="M 94 36 L 98 22 L 90 20" stroke="#0f172a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="89" cy="19" r="2.5" fill="#facc15" />
            {/* Angular ATV Body / Gas Tank */}
            <path
              d="M 28 44 L 50 34 L 88 34 L 108 38 L 130 44 L 128 52 L 28 52 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Textured Seat & Rear Rack */}
            <path d="M 38 34 L 72 34" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" />
            <rect x="22" y="34" width="18" height="3" rx="1.5" fill="#0f172a" />
            {/* Twin Front Headlight */}
            <circle cx="126" cy="42" r="3.5" fill="#facc15" stroke="#78350f" strokeWidth="1.5" />
          </g>
        ) : isPolice ? (
          // POLICE PATROL CRUISER
          <g>
            {/* Main Black & White Body */}
            <path
              d="M 20 44 L 42 26 L 108 26 L 128 42 L 146 44 L 146 54 L 20 54 Z"
              fill={primaryColor}
              stroke="#020617"
              strokeWidth="3"
            />
            {/* White Doors Center Section */}
            <rect x="52" y="34" width="48" height="18" rx="2" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
            {/* Gold Police Star Badge */}
            <polygon points="76,38 78,43 83,43 79,46 81,51 76,48 71,51 73,46 69,43 74,43" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
            <text x="76" y="55" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#0f172a" fontFamily="sans-serif">
              POLICE
            </text>
            {/* Blue Tinted Windows */}
            <path d="M 46 29 L 68 29 L 68 40 L 40 40 Z" fill="#38bdf8" opacity="0.85" stroke="#0284c7" strokeWidth="1" />
            <path d="M 72 29 L 102 29 L 120 40 L 72 40 Z" fill="#38bdf8" opacity="0.85" stroke="#0284c7" strokeWidth="1" />
            {/* Chrome Front Push Bumper */}
            <rect x="144" y="40" width="5" height="16" rx="1.5" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
            <line x1="144" y1="44" x2="149" y2="44" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="144" y1="52" x2="149" y2="52" stroke="#0f172a" strokeWidth="1.5" />
            {/* Flashing Police Siren Light Bar on Roof */}
            <rect x="68" y="20" width="22" height="6" rx="2" fill="#0f172a" />
            <rect x="70" y="18" width="8" height="5" rx="1.5" fill="#ef4444" className="animate-pulse" />
            <rect x="80" y="18" width="8" height="5" rx="1.5" fill="#3b82f6" className="animate-pulse" />
          </g>
        ) : isAmbulance ? (
          // HILL AMBULANCE RESCUE VAN
          <g>
            {/* Boxy Medical Body */}
            <rect x="22" y="22" width="112" height="34" rx="4" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
            {/* Sloped front cab */}
            <path d="M 114 26 L 138 40 L 138 56 L 114 56 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
            {/* Emergency Red Stripe along body */}
            <rect x="22" y="38" width="116" height="6" fill="#dc2626" />
            {/* Medical Red Cross Badge */}
            <g transform="translate(68, 28)">
              <rect x="-3" y="-8" width="6" height="16" fill="#dc2626" rx="1" />
              <rect x="-8" y="-3" width="16" height="6" fill="#dc2626" rx="1" />
            </g>
            {/* Front & Side Windows */}
            <rect x="36" y="26" width="18" height="10" rx="1.5" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1" />
            <path d="M 116 28 L 132 38 L 116 38 Z" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1" />
            {/* Red Flashing Roof Beacon */}
            <circle cx="80" cy="18" r="4.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" className="animate-pulse" />
            <rect x="76" y="20" width="8" height="2" fill="#475569" />
          </g>
        ) : isRockCrawler ? (
          // ROCK CRAWLER 4x4
          <g>
            {/* Exo-Skeleton Roll Cage */}
            <path
              d="M 28 46 L 46 22 L 96 22 L 126 40 L 140 46"
              stroke="#facc15"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M 72 22 L 72 46" stroke="#facc15" strokeWidth="3.5" />
            <path d="M 46 22 L 86 46" stroke="#facc15" strokeWidth="2.5" />
            {/* High Clearance Body Pan */}
            <path
              d="M 32 46 L 60 40 L 112 40 L 136 46 L 130 52 L 32 52 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Exposed High-Articulating Shock Towers */}
            <line x1="42" y1="36" x2="38" y2="56" stroke="#ef4444" strokeWidth="3" />
            <line x1="120" y1="36" x2="122" y2="56" stroke="#ef4444" strokeWidth="3" />
            {/* Front Winch */}
            <rect x="134" y="44" width="7" height="6" rx="1" fill="#475569" stroke="#0f172a" strokeWidth="1" />
          </g>
        ) : isSnowSled ? (
          // SNOWMOBILE BLIZZARD
          <g>
            {/* Aerodynamic Cowl & Windshield */}
            <path
              d="M 30 48 L 52 38 L 86 36 L 114 34 L 132 44 L 142 50 L 130 56 L 30 56 Z"
              fill={primaryColor}
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Tinted Bubble Windscreen */}
            <path d="M 104 34 Q 112 20 120 36 Z" fill="#38bdf8" opacity="0.85" stroke="#0284c7" strokeWidth="1.5" />
            {/* Contoured Snow Seat */}
            <path d="M 44 38 C 50 34, 76 34, 82 38 L 82 44 L 44 44 Z" fill="#0f172a" />
            {/* Front Headlight */}
            <polygon points="132,42 144,48 132,50" fill="#facc15" />
          </g>
        ) : isLunar ? (
          // MOON LANDER BUGGY (Apollo Lunar Rover)
          <g>
            {/* Gold Thermal Foil Wrapped Chassis */}
            <rect x="36" y="38" width="88" height="16" rx="2" fill="#fde047" stroke="#ca8a04" strokeWidth="2.5" />
            {/* Quilted thermal foil texture lines */}
            <line x1="48" y1="38" x2="48" y2="54" stroke="#eab308" strokeWidth="1.5" />
            <line x1="68" y1="38" x2="68" y2="54" stroke="#eab308" strokeWidth="1.5" />
            <line x1="88" y1="38" x2="88" y2="54" stroke="#eab308" strokeWidth="1.5" />
            <line x1="108" y1="38" x2="108" y2="54" stroke="#eab308" strokeWidth="1.5" />
            {/* High Gain Parabolic Communication Dish Antenna */}
            <path d="M 52 24 A 12 12 0 0 1 52 6" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
            <line x1="52" y1="24" x2="52" y2="38" stroke="#64748b" strokeWidth="2" />
            <circle cx="58" cy="15" r="2" fill="#ef4444" />
            {/* Low-gravity thruster nozzle at rear */}
            <polygon points="26,42 36,44 36,48 26,50" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            <circle cx="20" cy="46" r="3" fill="#38bdf8" opacity="0.75" />
          </g>
        ) : isOnewheel ? (
          // ONEWHEEL GYRO-CYCLE
          <g>
            {/* Center Monocycle Hub Frame */}
            <circle cx="80" cy="54" r="16" fill="none" stroke="#f43f5e" strokeWidth="3.5" />
            {/* Standing Footpads on Left and Right of wheel */}
            <rect x="44" y="50" width="24" height="6" rx="2" fill={primaryColor} stroke="#0f172a" strokeWidth="2" />
            <rect x="92" y="50" width="24" height="6" rx="2" fill={primaryColor} stroke="#0f172a" strokeWidth="2" />
            {/* Gyro Steer Handlebar Post */}
            <line x1="80" y1="38" x2="80" y2="16" stroke="#0f172a" strokeWidth="3.5" />
            <line x1="72" y1="16" x2="88" y2="16" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
            {/* LED Status Glow */}
            <circle cx="80" cy="54" r="5" fill="#38bdf8" className="animate-pulse" />
          </g>
        ) : (
          // CLASSIC HILL CLIMBER JEEP
          <g>
            <path
              d="M 30 48 L 48 24 L 88 24 L 88 48"
              stroke="#1e293b"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M 88 24 L 118 44" stroke="#1e293b" strokeWidth="3" fill="none" />
            <path d="M 98 44 L 88 26" stroke="#38bdf8" strokeWidth="4" opacity="0.8" />

            <path
              d="M 20 46 L 40 44 L 86 44 L 102 44 L 136 44 L 144 50 L 142 56 L 20 56 Z"
              fill={primaryColor}
              stroke="#7f1d1d"
              strokeWidth="3"
            />
            <circle cx="70" cy="50" r="5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
            <polygon points="70,47 71.5,51 68,48.5 72,48.5 68.5,51" fill="#dc2626" />

            <rect x="140" y="50" width="6" height="6" rx="1.5" fill="#1e293b" />
            <circle cx="140" cy="46" r="3.5" fill="#facc15" stroke="#78350f" strokeWidth="1.5" />
            <polygon points="144,46 158,40 158,52 144,47" fill="#fef08a" opacity="0.55" />
          </g>
        )}

        {/* 5. WHEELS / TREADS SYSTEM */}
        {isTank ? (
          // Tank Caterpillar Tracks System
          <g transform="translate(18, 54)">
            {/* Continuous Rubber Track Loop */}
            <rect x="0" y="0" width="124" height="18" rx="9" fill="#020617" stroke="#475569" strokeWidth="2.5" />
            {/* Road Wheels */}
            {[10, 32, 54, 76, 98, 114].map((x) => (
              <g key={x} transform={`translate(${x}, 9)`}>
                <circle cx="0" cy="0" r="7" fill="url(#hcrRim)" stroke="#0f172a" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2.5" fill="#15803d" />
              </g>
            ))}
          </g>
        ) : isHovercraft ? (
          // Hovercraft has no wheels (rides on air cushion!)
          null
        ) : isOnewheel ? (
          // Onewheel: Single Giant Center Gyroscopic Wheel
          <g transform="translate(80, 56)" className="drop-shadow-xl">
            <circle cx="0" cy="0" r="20" fill="url(#hcrTire)" stroke="#020617" strokeWidth="3.5" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <rect key={deg} x="-2" y="-22" width="4" height="4" rx="1" fill="#0f172a" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="11" fill="url(#hcrRim)" stroke="#f43f5e" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="4" fill="#0f172a" />
          </g>
        ) : isSnowSled ? (
          // Snowmobile: Dual Front Steerable Skis + Rear Traction Track
          <g>
            {/* Rear Snow Caterpillar Track */}
            <g transform="translate(32, 58)">
              <rect x="0" y="0" width="56" height="12" rx="6" fill="#0f172a" stroke="#020617" strokeWidth="2" />
              {[6, 20, 34, 48].map((x) => (
                <circle key={x} cx={x} cy="6" r="4.5" fill="url(#hcrRim)" stroke="#334155" strokeWidth="1" />
              ))}
            </g>
            {/* Front Steerable Ski Blade */}
            <g transform="translate(108, 62)">
              <path
                d="M 0 6 L 36 6 Q 44 6 46 -2"
                stroke="#0284c7"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <line x1="16" y1="6" x2="16" y2="-6" stroke="#475569" strokeWidth="3" />
            </g>
          </g>
        ) : isTractor ? (
          // Tractor Wheels: Enormous Rear Lug Wheel + Tiny Front Wheel
          <g>
            {/* GIANT REAR TRACTOR WHEEL (Radius 21) */}
            <g transform="translate(36, 52)" className="drop-shadow-lg">
              <circle cx="0" cy="0" r="21" fill="url(#hcrTire)" stroke="#020617" strokeWidth="3" />
              {/* Deep Agricultural Lugs */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <rect key={deg} x="-3" y="-23" width="6" height="5" rx="1" fill="#0f172a" transform={`rotate(${deg})`} />
              ))}
              {/* Yellow Steel Rim */}
              <circle cx="0" cy="0" r="12" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" fill="#0f172a" />
            </g>

            {/* SMALL FRONT TRACTOR WHEEL (Radius 10) */}
            <g transform="translate(126, 62)" className="drop-shadow-lg">
              <circle cx="0" cy="0" r="10" fill="url(#hcrTire)" stroke="#020617" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="5.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="2" fill="#0f172a" />
            </g>
          </g>
        ) : (
          // Standard Wheels (with Monster Truck large radius)
          <g>
            {/* REAR WHEEL */}
            <g transform={`translate(${isRockCrawler ? 36 : 38}, ${isMonster || isRockCrawler ? 62 : 60})`} className="drop-shadow-lg">
              <circle
                cx="0"
                cy="0"
                r={isMonster ? 19 : isRockCrawler ? 18 : 14.5}
                fill={isLunar ? '#e2e8f0' : "url(#hcrTire)"}
                stroke="#020617"
                strokeWidth="3"
              />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect
                  key={deg}
                  x="-2"
                  y={isMonster ? -20 : isRockCrawler ? -19 : -16}
                  width="4"
                  height="3.5"
                  rx="1"
                  fill="#0f172a"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r={isMonster ? 10 : isRockCrawler ? 10 : 8} fill={isLunar ? '#facc15' : "url(#hcrRim)"} stroke={isRockCrawler ? '#ef4444' : '#475569'} strokeWidth="2" />
              <circle cx="0" cy="0" r="3" fill="#0f172a" />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="#f8fafc" strokeWidth="2" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#f8fafc" strokeWidth="2" />
              <circle cx="0" cy="0" r="2" fill="#facc15" />
            </g>

            {/* FRONT WHEEL */}
            <g transform={`translate(${isRockCrawler ? 124 : 122}, ${isMonster || isRockCrawler ? 62 : 60})`} className="drop-shadow-lg">
              <circle
                cx="0"
                cy="0"
                r={isMonster ? 19 : isRockCrawler ? 18 : 14.5}
                fill={isLunar ? '#e2e8f0' : "url(#hcrTire)"}
                stroke="#020617"
                strokeWidth="3"
              />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <rect
                  key={deg}
                  x="-2"
                  y={isMonster ? -20 : isRockCrawler ? -19 : -16}
                  width="4"
                  height="3.5"
                  rx="1"
                  fill="#0f172a"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r={isMonster ? 10 : isRockCrawler ? 10 : 8} fill={isLunar ? '#facc15' : "url(#hcrRim)"} stroke={isRockCrawler ? '#ef4444' : '#475569'} strokeWidth="2" />
              <circle cx="0" cy="0" r="3" fill="#0f172a" />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="#f8fafc" strokeWidth="2" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#f8fafc" strokeWidth="2" />
              <circle cx="0" cy="0" r="2" fill="#facc15" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
