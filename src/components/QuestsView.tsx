import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { saveActiveUser } from '../services/storage';
import { soundFx } from '../services/soundFx';
import { 
  Clock, 
  Target, 
  Zap, 
  Trophy, 
  Award, 
  Flame, 
  CheckCircle2, 
  Gift 
} from 'lucide-react';

interface QuestsViewProps {
  user: UserProfile;
  onUserUpdate: (updated: UserProfile) => void;
  onStartRace: () => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({
  user,
  onUserUpdate,
  onStartRace,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = (questId: string) => {
    const quest = user.dailyQuests.find((q) => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;

    const updated = { ...user };
    const targetQ = updated.dailyQuests.find((q) => q.id === questId);
    if (!targetQ) return;

    targetQ.claimed = true;
    updated.stats.nitroCoins += targetQ.rewardCoins;
    updated.stats.xp += targetQ.rewardXp;

    saveActiveUser(updated);
    onUserUpdate(updated);
    soundFx.playFanfare(true);
  };

  const getQuestIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className="w-6 h-6 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'Award':
        return <Award className="w-6 h-6 text-cyan-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-red-500" />;
      default:
        return <Gift className="w-6 h-6 text-amber-400" />;
    }
  };

  const totalQuests = user.dailyQuests.length;
  const completedCount = user.dailyQuests.filter((q) => q.completed).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Wooden Sign Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gradient-to-r from-amber-950 via-[#3d1a0a] to-amber-950 border-4 border-amber-950 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400 border-2 border-amber-900 rounded-2xl text-amber-950 shadow-md">
            <Gift className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-game text-yellow-300 stroke-black-md">
              DAILY HILL QUESTS
            </h2>
            <p className="font-game text-xs text-amber-200">
              Conquer daily challenges to earn bonus gold coins and XP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/80 border-2 border-amber-900 rounded-xl font-game text-xs text-amber-200">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Resets in: </span>
          <span className="text-yellow-400 font-bold">{timeLeft}</span>
        </div>
      </div>

      {/* Progress completion meter */}
      <div className="p-4 bg-gradient-to-r from-amber-950 to-slate-900 border-3 border-amber-900 rounded-xl flex items-center justify-between gap-4">
        <div>
          <span className="font-game text-sm text-yellow-300">TODAY'S CHALLENGES</span>
          <div className="font-game text-xs text-amber-200">
            {completedCount} of {totalQuests} quests completed
          </div>
        </div>

        <div className="flex items-center gap-3 w-1/2 max-w-xs">
          <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden border border-amber-900">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-lime-500 transition-all duration-300"
              style={{ width: `${(completedCount / Math.max(1, totalQuests)) * 100}%` }}
            />
          </div>
          <span className="font-game text-sm text-yellow-300">
            {Math.round((completedCount / Math.max(1, totalQuests)) * 100)}%
          </span>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {user.dailyQuests.map((quest) => {
          const progressPercent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                quest.claimed
                  ? 'bg-slate-950/60 border-slate-900 opacity-60'
                  : quest.completed
                  ? 'bg-amber-950/70 border-yellow-400 shadow-lg'
                  : 'bg-gradient-to-b from-slate-900 to-amber-950/80 border-amber-950'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <div className="p-3 rounded-xl bg-slate-950 border-2 border-amber-900 shrink-0">
                  {getQuestIcon(quest.iconName)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-game text-white stroke-black-sm">{quest.title}</h4>
                    {quest.completed && !quest.claimed && (
                      <span className="bg-lime-500 text-emerald-950 font-game px-2 py-0.5 rounded-full text-[10px] uppercase font-black">
                        COMPLETED!
                      </span>
                    )}
                  </div>
                  <p className="font-game text-xs text-amber-200 mt-0.5">{quest.description}</p>

                  <div className="mt-2.5 flex items-center gap-3 max-w-sm">
                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-amber-900">
                      <div
                        className={`h-full transition-all duration-300 ${
                          quest.completed ? 'bg-lime-400' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="font-game text-xs text-amber-300">
                      {quest.progress} / {quest.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rewards & Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 font-game text-xs">
                  <span className="text-yellow-300">+{quest.rewardCoins} 🪙</span>
                  <span className="text-sky-300">+{quest.rewardXp} XP</span>
                </div>

                {quest.claimed ? (
                  <div className="font-game text-xs text-emerald-300 px-3 py-1.5 bg-emerald-950/80 rounded-xl border border-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> CLAIMED
                  </div>
                ) : quest.completed ? (
                  <button
                    onClick={() => {
                      soundFx.playButtonClick();
                      handleClaim(quest.id);
                    }}
                    className="btn-hcr-yellow px-5 py-2 rounded-xl font-game text-sm stroke-black-sm cursor-pointer animate-bounce"
                  >
                    CLAIM COINS
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundFx.playButtonClick();
                      onStartRace();
                    }}
                    className="btn-hcr-wood px-4 py-1.5 rounded-xl font-game text-xs stroke-black-sm cursor-pointer"
                  >
                    RACE NOW
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
