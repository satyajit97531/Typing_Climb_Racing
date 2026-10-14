import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  Racer, 
  RaceMode, 
  RaceStatus, 
} from '../types';
import { getRandomPassage, TypingPassage } from '../data/texts';
import { soundFx } from '../services/soundFx';
import { recordRaceFinish } from '../services/storage';
import { RaceTrack } from './RaceTrack';
import { TypingConsole } from './TypingConsole';
import { Trophy, Wrench, MessageSquare, Play, RotateCcw, Users, Zap, Award } from 'lucide-react';

interface RaceViewProps {
  user: UserProfile;
  onUserUpdate: (updated: UserProfile) => void;
  onNavigateToGarage: () => void;
}

const QUICK_COMM_PHRASES = [
  'Full throttle! 🚀',
  'Watch this jump! 🏎️',
  'Out of fuel? ⛽',
  'Hill conquered! 🏆',
  'Rematch on hills! 🏁',
];

const BOT_NAMES = [
  { name: 'DriftBill', avatar: '🏎️', carId: 'velocity-r1', baseWpm: 52 },
  { name: 'TractorTom', avatar: '🚜', carId: 'farm-tractor', baseWpm: 48 },
  { name: 'MonsterJoe', avatar: '⚡', carId: 'neon-drift-gt', baseWpm: 65 },
  { name: 'QuadMaster', avatar: '🏍️', carId: 'quad-bike', baseWpm: 56 },
  { name: 'OfficerHank', avatar: '🚓', carId: 'police-cruiser', baseWpm: 68 },
  { name: 'MedicMia', avatar: '🚑', carId: 'ambulance-rescue', baseWpm: 54 },
  { name: 'CliffClimber', avatar: '🧗', carId: 'rock-crawler', baseWpm: 62 },
  { name: 'BlizzardBob', avatar: '❄️', carId: 'snow-sled', baseWpm: 64 },
  { name: 'AstronautArt', avatar: '🚀', carId: 'lunar-rover', baseWpm: 75 },
  { name: 'GyroGabe', avatar: '🎡', carId: 'onewheel-gyro', baseWpm: 78 },
  { name: 'HippieDan', avatar: '🚌', carId: 'hippie-bus', baseWpm: 58 },
  { name: 'MotoRider', avatar: '🚀', carId: 'phantom-gt', baseWpm: 72 },
  { name: 'HoverGlider', avatar: '🛸', carId: 'hovercraft-x', baseWpm: 70 },
  { name: 'DuneCrawler', avatar: '🎯', carId: 'inferno-v8', baseWpm: 46 },
  { name: 'TankGeneral', avatar: '🛡️', carId: 'battle-tank', baseWpm: 55 },
  { name: 'RallyKing', avatar: '🔥', carId: 'apex-formula-1', baseWpm: 60 },
  { name: 'ApexPro', avatar: '🏎️', carId: 'formula-apex', baseWpm: 85 },
  { name: 'DieselDuke', avatar: '🌌', carId: 'cyber-solaris', baseWpm: 82 },
];

export const RaceView: React.FC<RaceViewProps> = ({
  user,
  onUserUpdate,
  onNavigateToGarage,
}) => {
  const [raceMode, setRaceMode] = useState<RaceMode>('multiplayer');
  const [raceStatus, setRaceStatus] = useState<RaceStatus>('lobby');
  const [countdownNum, setCountdownNum] = useState<number | string>(3);
  const [passage, setPassage] = useState<TypingPassage>(getRandomPassage);
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [nitroActive, setNitroActive] = useState<boolean>(false);

  const [rewardSummary, setRewardSummary] = useState<{
    coins: number;
    xp: number;
    rank: number;
    newBadges: string[];
  } | null>(null);

  const [racers, setRacers] = useState<Racer[]>([]);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const channel = new BroadcastChannel('turbotype_multiplayer_net');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'OPPONENT_UPDATE' && payload.racerId !== user.id) {
          setRacers((prev) =>
            prev.map((r) =>
              r.id === payload.racerId
                ? {
                    ...r,
                    progress: payload.progress,
                    wpm: payload.wpm,
                    finished: payload.finished,
                    finishTime: payload.finishTime,
                    statusMessage: payload.statusMessage,
                  }
                : r
            )
          );
        }
      };

      return () => {
        channel.close();
      };
    } catch {}
  }, [user.id]);

  const setupLobbyRacers = useCallback((mode: RaceMode = raceMode) => {
    const userCarCustom = user.carCustomizations[user.selectedCarId] || {
      color: '#dc2626',
      underglow: 'none',
      spoilerLevel: 0,
      engineLevel: 1,
      nitroLevel: 1,
      tiresLevel: 1,
      wheelsStyle: 'sport',
    };

    const playerRacer: Racer = {
      id: user.id,
      name: user.displayName,
      isPlayer: true,
      avatar: user.avatar,
      carId: user.selectedCarId,
      customization: userCarCustom,
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      progress: 0,
      finished: false,
      finishTime: null,
      nitroActive: false,
    };

    // If Solo Climb mode, ONLY the single user plays alone on the track!
    if (mode === 'practice') {
      setRacers([playerRacer]);
      return;
    }

    const shuffled = [...BOT_NAMES].sort(() => 0.5 - Math.random());
    const baseDifficultyWpm = Math.max(38, Math.min(105, user.stats.averageWpm || 55));

    const opponents: Racer[] = shuffled.slice(0, 3).map((bot, i) => ({
      id: `bot_${bot.name}_${i}`,
      name: bot.name,
      isPlayer: false,
      avatar: bot.avatar,
      carId: bot.carId,
      customization: {
        color: ['#0284c7', '#ea580c', '#16a34a', '#7c3aed'][i % 4],
        underglow: 'none',
        spoilerLevel: (i % 3) + 1,
        engineLevel: 2,
        nitroLevel: 2,
        tiresLevel: 2,
        wheelsStyle: 'sport',
      },
      wpm: 0,
      rawWpm: 0,
      accuracy: 96 + Math.floor(Math.random() * 4),
      progress: 0,
      finished: false,
      finishTime: null,
      targetWpm: Math.round(baseDifficultyWpm + (Math.random() * 20 - 10)),
      nitroActive: false,
    }));

    setRacers([playerRacer, ...opponents]);
  }, [user, raceMode]);

  useEffect(() => {
    setupLobbyRacers();
  }, [setupLobbyRacers]);

  const startCountdown = () => {
    soundFx.playButtonClick();
    const newPassage = getRandomPassage();
    setPassage(newPassage);
    setUserInput('');
    setStartTime(null);
    setElapsedSeconds(0);
    setStreakCount(0);
    setNitroActive(false);
    setRewardSummary(null);
    setupLobbyRacers();
    setRaceStatus('countdown');
    setCountdownNum(3);

    soundFx.playCountdown(false);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        soundFx.playCountdown(false);
      } else if (count === 0) {
        setCountdownNum('GO!');
        soundFx.playCountdown(true);
        soundFx.startRacingMusic();
      } else {
        clearInterval(interval);
        setRaceStatus('racing');
        setStartTime(Date.now());
      }
    }, 950);
  };

  useEffect(() => {
    if (raceStatus !== 'racing') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      if (!startTime) return;
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      setElapsedSeconds(elapsed);

      setRacers((prevRacers) =>
        prevRacers.map((racer) => {
          if (racer.isPlayer || racer.finished) return racer;

          const targetWpm = racer.targetWpm || 55;
          const jitter = (Math.random() - 0.48) * 6;
          const currentBotWpm = Math.max(25, targetWpm + jitter);

          const charsPerSec = (currentBotWpm * 5) / 60;
          const totalChars = passage.text.length;
          const newProgress = Math.min(100, (elapsed * charsPerSec / totalChars) * 100);

          const hasFinished = newProgress >= 100;

          return {
            ...racer,
            wpm: Math.round(currentBotWpm),
            progress: newProgress,
            finished: hasFinished,
            finishTime: hasFinished && !racer.finishTime ? elapsed : racer.finishTime,
            nitroActive: currentBotWpm > 75 && Math.random() > 0.6,
          };
        })
      );
    }, 150);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [raceStatus, startTime, passage.text.length]);

  const handleInputChange = (val: string) => {
    if (raceStatus !== 'racing') return;

    setUserInput(val);

    let correctCount = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === passage.text[i]) {
        correctCount++;
      }
    }

    const accuracy = val.length > 0 ? Math.round((correctCount / val.length) * 100) : 100;
    const elapsedMinutes = Math.max(0.01, elapsedSeconds / 60);
    const rawWpm = Math.round((val.length / 5) / elapsedMinutes);
    const netWpm = Math.max(0, Math.round((correctCount / 5) / elapsedMinutes));

    const wordsTyped = val.trim().split(/\s+/).filter(Boolean);
    const targetWords = passage.text.split(' ');
    let currentStreak = 0;
    for (let i = 0; i < wordsTyped.length; i++) {
      if (wordsTyped[i] === targetWords[i]) {
        currentStreak++;
      } else {
        currentStreak = 0;
      }
    }
    setStreakCount(currentStreak);

    const shouldNitro = currentStreak >= 8 || netWpm >= 85;
    if (shouldNitro && !nitroActive) {
      soundFx.playNitro();
      setNitroActive(true);
    } else if (!shouldNitro && nitroActive) {
      setNitroActive(false);
    }

    const currentCar = user.carCustomizations[user.selectedCarId];
    const engineBonus = currentCar ? 1 + (currentCar.engineLevel - 1) * 0.05 : 1.0;
    const nitroBonus = nitroActive ? 1.3 : 1.0;

    const baseProgress = (val.length / passage.text.length) * 100;
    const weightedProgress = Math.min(100, baseProgress * engineBonus * nitroBonus);

    const isFinished = val.length >= passage.text.length && val === passage.text;

    setRacers((prev) =>
      prev.map((racer) => {
        if (!racer.isPlayer) return racer;
        return {
          ...racer,
          wpm: netWpm,
          rawWpm,
          accuracy,
          progress: isFinished ? 100 : weightedProgress,
          finished: isFinished,
          finishTime: isFinished ? elapsedSeconds : null,
          nitroActive: shouldNitro,
        };
      })
    );

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'OPPONENT_UPDATE',
        payload: {
          racerId: user.id,
          wpm: netWpm,
          progress: isFinished ? 100 : weightedProgress,
          finished: isFinished,
          finishTime: isFinished ? elapsedSeconds : null,
        },
      });
    }

    if (isFinished) {
      const finishedOpponents = racers.filter((r) => !r.isPlayer && r.finished);
      const rank = raceMode === 'practice' ? 1 : finishedOpponents.length + 1;

      setRaceStatus('finished');
      soundFx.stopRacingMusic();
      soundFx.playFanfare(rank === 1);
      setTimeout(() => {
        soundFx.startRacingMusic();
      }, 1800);

      if (rank === 1) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
        });
      }

      const totalWords = passage.text.split(' ').length;
      const charsTyped = passage.text.length;

      const { updatedUser, coinsEarned, xpEarned, newAchievements } = recordRaceFinish(user, {
        rank,
        wpm: netWpm,
        rawWpm,
        accuracy,
        wordsTyped: totalWords,
        charsTyped,
        streakMax: currentStreak,
        flawless: accuracy === 100,
      });

      onUserUpdate(updatedUser);

      setRewardSummary({
        coins: coinsEarned,
        xp: xpEarned,
        rank,
        newBadges: newAchievements,
      });
    }
  };

  const sendQuickRadio = (phrase: string) => {
    soundFx.playButtonClick();
    setRacers((prev) =>
      prev.map((r) => (r.isPlayer ? { ...r, statusMessage: phrase } : r))
    );

    setTimeout(() => {
      setRacers((prev) =>
        prev.map((r) => (r.isPlayer ? { ...r, statusMessage: undefined } : r))
      );
    }, 2800);
  };

  const playerRacer = racers.find((r) => r.isPlayer);
  const isRacing = raceStatus === 'racing';
  const isCountdown = raceStatus === 'countdown';
  const isFinished = raceStatus === 'finished';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Hill Climb Racing Stage Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 rounded-2xl border-4 border-amber-950 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-amber-900 flex items-center justify-center text-xl shadow">
            🌳
          </div>
          <div>
            <div className="font-game text-xl text-yellow-300 stroke-black-sm">
              STAGE: COUNTRYSIDE HILLS
            </div>
            <div className="font-game text-xs text-emerald-300">
              {passage.difficulty} · {passage.category} · {raceMode === 'practice' ? 'Solo Hill Climb (Single Racer Alone)' : 'Real-Time Matchmaking (4 Racers)'}
            </div>
          </div>
        </div>

        {/* Mode Selector in 3D Hill Climb Racing buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setRaceMode('multiplayer');
              if (raceStatus === 'lobby') {
                setupLobbyRacers('multiplayer');
              }
            }}
            className={`px-4 py-1.5 rounded-xl font-game text-xs uppercase cursor-pointer ${
              raceMode === 'multiplayer' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            <Users className="w-3.5 h-3.5 inline mr-1" /> MULTIPLAYER (4 RACERS)
          </button>
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setRaceMode('practice');
              if (raceStatus === 'lobby') {
                setupLobbyRacers('practice');
              }
            }}
            className={`px-4 py-1.5 rounded-xl font-game text-xs uppercase cursor-pointer ${
              raceMode === 'practice' ? 'btn-hcr-blue' : 'btn-hcr-wood'
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline mr-1" /> SOLO CLIMB (PLAY ALONE)
          </button>
        </div>
      </div>

      {/* Countdown Big Display Overlay with Yellow Sun Rays */}
      {isCountdown && (
        <div className="relative overflow-hidden rounded-2xl border-4 border-amber-950 bg-gradient-to-b from-sky-400 via-amber-300 to-emerald-400 py-12 text-center shadow-2xl">
          <div className="text-xl font-game text-amber-950 stroke-black-sm mb-2 uppercase">
            REV YOUR ENGINES · GREEN FLAG IMMINENT
          </div>
          <div className="text-8xl font-game text-yellow-300 stroke-black-md animate-bounce">
            {countdownNum}
          </div>
        </div>
      )}

      {/* The Iconic Environmental 4-Lane Rolling Hills Track */}
      <RaceTrack racers={racers} isRacing={isRacing} />

      {/* Typing Console or Lobby Start Card */}
      {raceStatus === 'lobby' ? (
        <div className="hcr-panel p-8 text-center border-4 border-amber-950 bg-gradient-to-b from-[#2e1307] to-[#1a0a03] space-y-4 shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400 border-3 border-amber-950 text-amber-950 mb-1 shadow-lg">
            <Trophy className="w-9 h-9" />
          </div>
          <h2 className="text-3xl font-game text-white stroke-black-md">
            READY TO CLIMB THE HILLS?
          </h2>
          <p className="font-game text-sm text-amber-200 max-w-md mx-auto">
            The faster you type, the faster Bill's car climbs over the steep hills! Flawless typing streaks engage NITRO BOOST!
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={startCountdown}
              className="btn-hcr-green px-8 py-3.5 rounded-2xl font-game text-2xl uppercase stroke-black-sm flex items-center gap-2 cursor-pointer active:scale-95 shadow-xl"
            >
              <Play className="w-6 h-6 fill-white" />
              START HILL RACE
            </button>
            <button
              onClick={onNavigateToGarage}
              className="btn-hcr-yellow px-6 py-3.5 rounded-2xl font-game text-lg uppercase stroke-black-sm flex items-center gap-2 cursor-pointer"
            >
              <Wrench className="w-5 h-5 text-amber-950" />
              TUNE IN GARAGE
            </button>
          </div>
        </div>
      ) : (
        <TypingConsole
          targetText={passage.text}
          userInput={userInput}
          onInputChange={handleInputChange}
          isRacing={isRacing}
          isFinished={isFinished}
          wpm={playerRacer?.wpm || 0}
          accuracy={playerRacer?.accuracy || 100}
          streak={streakCount}
          nitroActive={nitroActive}
        />
      )}

      {/* Quick Radio Chat Bar */}
      {isRacing && (
        <div className="flex items-center justify-between gap-2 p-2 bg-amber-950/80 border-2 border-amber-900 rounded-xl">
          <span className="font-game text-xs text-amber-300 flex items-center gap-1.5 shrink-0">
            <MessageSquare className="w-4 h-4" /> Quick Radio:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_COMM_PHRASES.map((phrase) => (
              <button
                key={phrase}
                onClick={() => sendQuickRadio(phrase)}
                className="px-3 py-1 font-game text-xs btn-hcr-wood rounded-lg cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Post-Race Podium & Rewards Modal (Hill Climb Racing Level Complete Style) */}
      {isFinished && rewardSummary && (
        <div className="hcr-panel p-6 border-4 border-yellow-400 bg-gradient-to-b from-[#2e1307] to-[#120702] shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-amber-900">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-400 border-2 border-amber-950 text-amber-950">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-game text-yellow-300 stroke-black-md">
                  {rewardSummary.rank === 1 ? 'STAGE COMPLETED! 1ST PLACE VICTORY!' : `HILL FINISHED IN POSITION P${rewardSummary.rank}`}
                </h3>
                <p className="font-game text-xs text-amber-200">
                  Time: {playerRacer?.finishTime?.toFixed(2)}s · Speed: {playerRacer?.wpm} WPM · Accuracy: {playerRacer?.accuracy}%
                </p>
              </div>
            </div>

            {/* Coins and XP Rewards */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-amber-400 border-2 border-amber-900 rounded-xl font-game text-amber-950 font-black text-sm">
                <span>🪙 +{rewardSummary.coins} COINS</span>
              </div>
              <div className="px-4 py-2 bg-sky-400 border-2 border-sky-900 rounded-xl font-game text-sky-950 font-black text-sm">
                <span>⚡ +{rewardSummary.xp} XP</span>
              </div>
            </div>
          </div>

          {rewardSummary.newBadges.length > 0 && (
            <div className="p-3 bg-amber-400/20 border-2 border-amber-500 rounded-xl flex items-center gap-3 font-game text-amber-300 text-xs">
              <Award className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <span className="font-bold">New Hill Badge Unlocked: </span>
                {rewardSummary.newBadges.join(', ')}!
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={onNavigateToGarage}
              className="btn-hcr-wood px-6 py-2.5 rounded-xl font-game text-sm stroke-black-sm cursor-pointer"
            >
              <Wrench className="w-4 h-4 inline mr-1" /> TUNE IN GARAGE
            </button>

            <button
              onClick={startCountdown}
              className="btn-hcr-green px-8 py-3 rounded-xl font-game text-lg stroke-black-sm cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-5 h-5 inline mr-1" /> RACE AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
