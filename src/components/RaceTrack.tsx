import React from 'react';
import { Racer } from '../types';
import { CarSvg } from './CarSvg';

interface RaceTrackProps {
  racers: Racer[];
  isRacing: boolean;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({ racers, isRacing }) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-950 relative select-none">
      {/* 1. Sky & Sun Environment with Warm Bloom Glow */}
      <div className="relative bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200 overflow-hidden pt-3">
        {/* Sun Bloom Glow in corner */}
        <div className="absolute top-2 right-12 w-28 h-28 rounded-full bg-yellow-200/50 blur-xl pointer-events-none animate-sun-bloom" />
        <div className="absolute top-4 right-16 w-14 h-14 rounded-full bg-yellow-300 border-4 border-yellow-100 shadow-lg pointer-events-none" />

        {/* Floating Cartoon Clouds */}
        <div className="absolute top-3 left-10 flex items-center gap-1 opacity-90 animate-cloud">
          <div className="w-12 h-6 bg-white rounded-full shadow-sm" />
          <div className="w-8 h-8 bg-white rounded-full -ml-4 -mt-3 shadow-sm" />
          <div className="w-10 h-6 bg-white rounded-full -ml-3 shadow-sm" />
        </div>
        <div className="absolute top-6 left-1/2 flex items-center gap-1 opacity-80 animate-cloud" style={{ animationDelay: '-8s' }}>
          <div className="w-14 h-7 bg-white rounded-full shadow-sm" />
          <div className="w-10 h-9 bg-white rounded-full -ml-5 -mt-3 shadow-sm" />
          <div className="w-12 h-6 bg-white rounded-full -ml-3 shadow-sm" />
        </div>

        {/* Distant Rolling Hills Layer */}
        <svg className="w-full h-10 -mb-1 opacity-70" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M 0 40 Q 200 10, 450 35 Q 700 15, 950 30 Q 1100 10, 1200 40 L 1200 60 L 0 60 Z" fill="#86efac" />
        </svg>

        {/* Midground Trees, Bushes & Flowers along the ridge */}
        <div className="relative z-10 flex justify-between items-end px-8 mb-0 pointer-events-none">
          {/* Tree Cluster 1 (Left) */}
          <div className="flex items-end gap-1">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-emerald-800 shadow-sm" />
              <div className="w-2.5 h-3 bg-amber-900 border-x border-amber-950 rounded-b-xs" />
            </div>
            <div className="w-6 h-4 bg-emerald-500 rounded-full border border-emerald-800 -ml-2 mb-0.5" />
          </div>

          {/* Bushes & Swaying Flowers */}
          <div className="hidden sm:flex items-center gap-2 mb-0.5">
            <div className="w-8 h-5 bg-emerald-600 rounded-full border border-emerald-800" />
            {/* Flower */}
            <div className="flex flex-col items-center animate-flower">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-700 shadow-sm flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-yellow-300" />
              </div>
              <div className="w-1 h-2.5 bg-emerald-600" />
            </div>
            <div className="w-6 h-4 bg-lime-500 rounded-full border border-emerald-800" />
          </div>

          {/* Wooden Fence Section */}
          <div className="hidden md:flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-4 bg-amber-800 border border-amber-950 rounded-t" />
            <div className="w-1.5 h-4 bg-amber-800 border border-amber-950 rounded-t" />
            <div className="w-1.5 h-4 bg-amber-800 border border-amber-950 rounded-t" />
          </div>

          {/* Right Side: Clean Foliage Bush, Blooming Flower & Self-Contained Finish Marker (No overlapping brown rod) */}
          <div className="flex items-end gap-1.5 mb-0.5">
            {/* Blooming Yellow Flower */}
            <div className="flex flex-col items-center animate-flower mr-1" style={{ animationDelay: '-1.5s' }}>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 shadow-sm flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
              <div className="w-1 h-2.5 bg-emerald-600" />
            </div>
            {/* Round Green Bush (self-contained, no downward brown trunk protruding) */}
            <div className="w-11 h-9 rounded-full bg-emerald-700 border-2 border-emerald-900 shadow-sm" />
            {/* Compact Waving Finish Flag contained within the sky area */}
            <div className="flex flex-col items-center ml-1">
              <div 
                className="w-7 h-4 border border-black shadow-sm"
                style={{
                  backgroundImage: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)',
                  backgroundSize: '7px 7px',
                }}
              />
              <div className="w-1 h-3.5 bg-slate-800 rounded-b-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. The 4 Rolling Hill Lanes with Grassy Edge & Earth Soil Layers */}
      <div className="bg-gradient-to-b from-emerald-600 via-amber-900 to-amber-950 divide-y-2 divide-amber-950/70 relative">

        {racers.map((racer, index) => {
          const isPlayer = racer.isPlayer;
          const progressClamp = Math.min(100, Math.max(0, racer.progress));
          const carPositionPercent = progressClamp * 0.82;

          return (
            <div
              key={racer.id}
              className={`relative px-4 py-2 transition-colors ${
                isPlayer ? 'bg-amber-400/10' : ''
              }`}
            >
              {/* Lane Info Header */}
              <div className="flex items-center justify-between text-xs mb-1 relative z-20">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 border-2 border-amber-900 flex items-center justify-center font-game text-xs font-black text-amber-950 shadow-sm">
                    {index + 1}
                  </span>
                  <span className="text-base" role="img" aria-label="avatar">
                    {racer.avatar}
                  </span>
                  <span className={`font-game text-sm stroke-black-sm ${isPlayer ? 'text-yellow-300' : 'text-white'}`}>
                    {racer.name} {isPlayer && <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] ml-1.5 border border-red-900">BILL (YOU)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-game text-xs">
                  {racer.finished ? (
                    <span className="text-yellow-300 font-bold flex items-center gap-1 stroke-black-sm text-sm">
                      🏁 P{racer.rank} ({racer.finishTime?.toFixed(1)}s)
                    </span>
                  ) : (
                    <>
                      <span className="text-emerald-100 hidden sm:inline stroke-black-sm">
                        {racer.accuracy}% Precision
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 border-2 border-amber-800 text-amber-950 font-black shadow-sm text-xs">
                        {Math.round(racer.wpm)} <span className="text-[10px] uppercase font-bold">WPM</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Rolling Hill Terrain Lane */}
              <div className="relative h-18 bg-amber-950/70 rounded-xl border-2 border-amber-950 overflow-hidden flex items-center">
                {/* Wavy Lush Grass Top Layer with Cartoon Blades */}
                <div 
                  className={`absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-lime-400 to-emerald-600 border-b-2 border-amber-950 ${
                    isRacing ? 'animate-speed-track' : ''
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(ellipse at 50% 0%, #a3e635 30%, #16a34a 90%)',
                    backgroundSize: '24px 16px',
                  }}
                />

                {/* Dirt & Embedded Cartoon Pebbles in Soil */}
                <div className="absolute inset-x-0 bottom-0 top-4 bg-[#542911] opacity-90">
                  <div className="w-full h-full flex justify-around items-center opacity-30 pointer-events-none">
                    <div className="w-2.5 h-1.5 rounded-full bg-amber-200" />
                    <div className="w-3 h-2 rounded bg-amber-950" />
                    <div className="w-2 h-2 rounded-full bg-amber-300" />
                    <div className="w-4 h-2 rounded bg-amber-950" />
                    <div className="w-2 h-1 rounded-full bg-amber-200" />
                  </div>
                </div>

                {/* Trail progress highlight */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-yellow-400/20 border-r-2 border-yellow-300/60 pointer-events-none transition-all duration-150"
                  style={{ width: `${progressClamp}%` }}
                />

                {/* Embedded Finish Line Checkered Strip in Soil (behind car) */}
                <div 
                  className="absolute right-6 top-0 bottom-0 w-3 pointer-events-none opacity-30 z-10 rounded-sm overflow-hidden"
                  style={{
                    backgroundImage: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)',
                    backgroundSize: '6px 6px',
                  }}
                />

                {/* The Animated Hill Climb Racing Car Bouncing Along the Hill */}
                <div 
                  className={`absolute z-20 transition-all duration-200 ease-out flex items-center ${
                    isRacing ? 'animate-hill-bob' : ''
                  }`}
                  style={{ 
                    left: `${carPositionPercent}%`,
                    transform: 'translateY(-2px)'
                  }}
                >
                  {/* Floating speech bubble */}
                  {racer.statusMessage && (
                    <div className="absolute -top-7 left-6 whitespace-nowrap bg-yellow-300 border-2 border-amber-900 text-amber-950 text-xs font-game px-2.5 py-0.5 rounded-lg shadow-lg pointer-events-none animate-bounce">
                      {racer.statusMessage}
                    </div>
                  )}

                  <CarSvg 
                    carId={racer.carId} 
                    customization={racer.customization}
                    isBoosting={racer.nitroActive || (isRacing && isPlayer && racer.wpm >= 75)}
                    className="w-28 sm:w-32 drop-shadow-[0_6px_10px_rgba(0,0,0,0.7)]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Deep Earth / Subsoil Cross-Section Base */}
      <div className="h-4 w-full bg-[#381a0a] border-t-2 border-amber-950 flex items-center justify-around px-4">
        <span className="text-[10px] font-game text-amber-500/70">HILL CLIMB RACING MOTORSPORT CIRCUIT</span>
        <span className="text-[10px] font-game text-yellow-500">STAGE: COUNTRYSIDE HILLS</span>
      </div>
    </div>
  );
};
