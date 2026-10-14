import React, { useRef, useEffect } from 'react';
import { soundFx } from '../services/soundFx';
import { Flame, Gauge } from 'lucide-react';

interface TypingConsoleProps {
  targetText: string;
  userInput: string;
  onInputChange: (value: string) => void;
  isRacing: boolean;
  isFinished: boolean;
  wpm: number;
  accuracy: number;
  streak: number;
  nitroActive: boolean;
  onNitroTrigger?: () => void;
}

export const TypingConsole: React.FC<TypingConsoleProps> = ({
  targetText,
  userInput,
  onInputChange,
  isRacing,
  isFinished,
  wpm,
  accuracy,
  streak,
  nitroActive,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRacing && !isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRacing, isFinished]);

  const handleContainerClick = () => {
    if (inputRef.current && isRacing && !isFinished) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isRacing || isFinished) return;

    if (e.key === 'Backspace') {
      soundFx.playKeyClick();
      return;
    }

    if (e.key.length === 1) {
      const nextCharIndex = userInput.length;
      if (nextCharIndex < targetText.length) {
        const expected = targetText[nextCharIndex];
        if (e.key === expected) {
          soundFx.playKeyClick();
        } else {
          soundFx.playError();
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRacing || isFinished) return;
    const value = e.target.value;
    if (value.length <= targetText.length) {
      onInputChange(value);
    }
  };

  const characters = targetText.split('');
  const userChars = userInput.split('');

  // Calculate RPM gauge needle rotation (-120deg at 0 WPM to +120deg at 120+ WPM)
  const rpmClamp = Math.min(120, Math.max(0, wpm));
  const needleRotation = -120 + (rpmClamp / 120) * 240;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative w-full rounded-2xl border-4 transition-all duration-300 p-4 sm:p-6 cursor-text ${
        nitroActive
          ? 'bg-gradient-to-b from-amber-950 via-slate-900 to-amber-950 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
          : 'bg-gradient-to-b from-slate-900 to-amber-950/90 border-amber-900 shadow-2xl'
      }`}
    >
      {/* 1. Hill Climb Racing Cockpit Gauges & Pedals Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-amber-900/60">
        {/* Left: Perforated Brake Pedal Decor + Accuracy */}
        <div className="flex items-center gap-3">
          {/* Perforated Metal Brake Pedal */}
          <div className="w-14 h-18 bg-gradient-to-b from-slate-400 to-slate-600 border-2 border-slate-800 rounded-lg shadow-md p-1.5 flex flex-col items-center justify-between">
            <span className="font-game text-[9px] text-slate-900 uppercase">BRAKE</span>
            <div className="grid grid-cols-2 gap-1 my-1">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            </div>
            <span className="font-game text-[9px] text-slate-800 font-bold">{accuracy}%</span>
          </div>

          <div>
            <div className="font-game text-xs text-amber-200">PRECISION</div>
            <div className="text-2xl font-game text-white stroke-black-sm">{accuracy}% ACC</div>
          </div>
        </div>

        {/* Center: Iconic Hill Climb Racing Round RPM Dial */}
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-slate-900 to-black border-3 border-slate-700 shadow-inner flex items-center justify-center">
            {/* Glass shine reflection */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            {/* Redline zone */}
            <div className="absolute right-2 top-2 w-4 h-4 rounded-full bg-red-600/60 blur-xs" />
            {/* RPM Dial markings */}
            <span className="absolute top-2 font-game text-[9px] text-yellow-400">RPM</span>
            <span className="absolute bottom-2 font-game text-[10px] text-white stroke-black-sm">
              {Math.round(wpm)}
            </span>
            {/* Needle */}
            <div
              className="absolute w-1 h-8 bg-red-500 rounded-full origin-bottom transition-transform duration-150"
              style={{
                bottom: '50%',
                transform: `rotate(${needleRotation}deg)`,
              }}
            />
            {/* Center Cap */}
            <div className="absolute w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-800 shadow" />
          </div>

          <div>
            <div className="font-game text-xs text-amber-200">TYPING SPEED</div>
            <div className="text-3xl font-game text-yellow-300 stroke-black-sm">
              {Math.round(wpm)} <span className="text-sm font-game text-white">WPM</span>
            </div>
          </div>
        </div>

        {/* Right: Perforated Metal Gas Pedal + Fuel/Nitro Canister */}
        <div className="flex items-center gap-3">
          {/* Red Fuel Canister */}
          <div className="flex flex-col items-center">
            <div className="w-4 h-1 bg-slate-600 rounded-t" />
            <div className="w-10 h-12 bg-red-600 border-2 border-red-950 rounded-lg p-1 shadow flex flex-col justify-between items-center">
              <span className="font-game text-[8px] text-white">FUEL</span>
              <div className="w-full h-3 bg-red-900 rounded overflow-hidden">
                <div
                  className="h-full bg-yellow-300 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(15, (wpm / 80) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Perforated Metal Gas Pedal */}
          <div className={`w-14 h-18 bg-gradient-to-b from-slate-400 to-slate-600 border-2 border-slate-800 rounded-lg shadow-md p-1.5 flex flex-col items-center justify-between transition-transform ${
            isRacing && wpm > 40 ? 'scale-95 translate-y-1' : ''
          }`}>
            <span className="font-game text-[9px] text-slate-900 uppercase">GAS</span>
            <div className="grid grid-cols-2 gap-1 my-1">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            </div>
            <span className="font-game text-[9px] text-slate-800 font-bold">{streak}W</span>
          </div>
        </div>
      </div>

      {/* 2. Target Text Prompt Screen */}
      <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border-2 border-amber-950 font-mono text-lg sm:text-xl leading-relaxed tracking-wide select-none min-h-[90px] relative shadow-inner">
        {characters.map((char, index) => {
          let charColor = 'text-slate-400';
          let charBg = 'transparent';
          const isCurrentCursor = index === userInput.length;

          if (index < userInput.length) {
            const isMatch = userChars[index] === char;
            if (isMatch) {
              charColor = nitroActive ? 'text-amber-300 font-bold' : 'text-lime-400 font-semibold';
            } else {
              charColor = 'text-white font-bold';
              charBg = 'rgba(239, 68, 68, 0.7)';
            }
          }

          return (
            <span
              key={index}
              className={`relative transition-colors duration-75 ${charColor} px-[1px]`}
              style={{ backgroundColor: charBg, borderRadius: '3px' }}
            >
              {isCurrentCursor && isRacing && !isFinished && (
                <span className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]" />
              )}
              {char}
            </span>
          );
        })}
      </div>

      {/* Hidden input field for typing */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={!isRacing || isFinished}
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        className="opacity-0 absolute inset-0 w-full h-full cursor-text pointer-events-auto"
        aria-label="Hill Climb Typing Input"
      />

      {/* Bottom Status Help */}
      <div className="mt-4 pt-2 flex items-center justify-between text-xs font-game">
        <div className="flex items-center gap-2">
          {nitroActive ? (
            <span className="text-yellow-300 flex items-center gap-1 text-sm stroke-black-sm animate-pulse">
              <Flame className="w-4 h-4 text-red-500 fill-yellow-400" /> NITRO TURBO ACTIVE! (1.3x SPEED)
            </span>
          ) : (
            <span className="text-amber-200">
              Type the words above! Each keystroke revs the engine up the hill!
            </span>
          )}
        </div>

        <div className="text-emerald-300">
          STREAK: {streak} WORDS
        </div>
      </div>
    </div>
  );
};
