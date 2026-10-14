import React, { useState } from 'react';
import { UserProfile, LeaderboardRacer, DivisionTier } from '../types';
import { getLeaderboards } from '../services/storage';
import { soundFx } from '../services/soundFx';
import { Trophy, Search, Zap, Crown, Flame } from 'lucide-react';

interface LeaderboardViewProps {
  user: UserProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'wpm' | 'wins' | 'tiers'>('wpm');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allRacers = getLeaderboards(user);

  const sortedRacers = [...allRacers].sort((a, b) => {
    if (activeTab === 'wpm') {
      return b.bestWpm - a.bestWpm;
    } else if (activeTab === 'wins') {
      return b.wins - a.wins;
    } else {
      const tierWeight: Record<DivisionTier, number> = {
        'Apex Grandmaster': 6,
        Diamond: 5,
        Platinum: 4,
        Gold: 3,
        Silver: 2,
        Bronze: 1,
      };
      return tierWeight[b.tier] - tierWeight[a.tier] || b.bestWpm - a.bestWpm;
    }
  });

  const filteredRacers = sortedRacers.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myRankIndex = sortedRacers.findIndex((r) => r.isCurrentPlayer) + 1;

  const getTierColor = (tier: DivisionTier) => {
    switch (tier) {
      case 'Apex Grandmaster':
        return 'text-yellow-300 bg-amber-500/20 border-amber-500/40';
      case 'Diamond':
        return 'text-sky-300 bg-sky-500/20 border-sky-500/40';
      case 'Platinum':
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40';
      case 'Gold':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
      case 'Silver':
        return 'text-slate-200 bg-slate-500/20 border-slate-500/40';
      default:
        return 'text-amber-600 bg-amber-900/30 border-amber-800/40';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gradient-to-r from-amber-950 via-[#3d1a0a] to-amber-950 border-4 border-amber-950 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400 border-2 border-amber-900 rounded-2xl text-amber-950 shadow-md">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-game text-yellow-300 stroke-black-md">
              HILL CLIMB LEADERBOARDS
            </h2>
            <p className="font-game text-xs text-amber-200">
              World rankings of the fastest hill climb typists
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-slate-950/80 border-2 border-amber-900 rounded-xl font-game text-sm">
          <span className="text-amber-200">Your Rank: </span>
          <span className="text-yellow-400 font-black">#{myRankIndex}</span>
          <span className="text-emerald-400 ml-2">({user.stats.bestWpm} Best WPM)</span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setActiveTab('wpm');
            }}
            className={`px-4 py-2 rounded-xl font-game text-xs uppercase cursor-pointer ${
              activeTab === 'wpm' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline mr-1" /> TOP WPM
          </button>
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setActiveTab('wins');
            }}
            className={`px-4 py-2 rounded-xl font-game text-xs uppercase cursor-pointer ${
              activeTab === 'wins' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            <Crown className="w-3.5 h-3.5 inline mr-1" /> MOST WINS
          </button>
          <button
            onClick={() => {
              soundFx.playButtonClick();
              setActiveTab('tiers');
            }}
            className={`px-4 py-2 rounded-xl font-game text-xs uppercase cursor-pointer ${
              activeTab === 'tiers' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            <Flame className="w-3.5 h-3.5 inline mr-1" /> DIVISION
          </button>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
          <input
            type="text"
            placeholder="Search driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border-2 border-amber-950 rounded-xl font-game text-xs text-white placeholder:text-amber-400/60 focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* Standings Table */}
      <div className="rounded-2xl border-4 border-amber-950 overflow-hidden shadow-2xl bg-gradient-to-b from-slate-900 to-amber-950/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-amber-950 bg-amber-950/60 font-game text-xs text-yellow-300 uppercase">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4 text-right">Best Speed</th>
                <th className="py-3 px-4 text-right">Victories</th>
                <th className="py-3 px-4 text-right">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-950/40 text-xs font-game">
              {filteredRacers.map((racer, idx) => {
                const rankNum = idx + 1;
                const isPlayer = racer.isCurrentPlayer;

                return (
                  <tr
                    key={racer.id}
                    className={`transition-colors ${
                      isPlayer
                        ? 'bg-amber-400/20 font-bold'
                        : rankNum <= 3
                        ? 'bg-amber-950/30 hover:bg-amber-950/50'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4">
                      {rankNum === 1 ? (
                        <span className="w-7 h-7 rounded-full bg-yellow-400 border-2 border-amber-900 text-amber-950 font-black inline-flex items-center justify-center text-sm shadow">
                          1
                        </span>
                      ) : rankNum === 2 ? (
                        <span className="w-7 h-7 rounded-full bg-slate-200 border-2 border-slate-700 text-slate-950 font-black inline-flex items-center justify-center text-sm shadow">
                          2
                        </span>
                      ) : rankNum === 3 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-700 border-2 border-amber-950 text-white font-black inline-flex items-center justify-center text-sm shadow">
                          3
                        </span>
                      ) : (
                        <span className="text-amber-200 ml-2">#{rankNum}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{racer.avatar}</span>
                        <div>
                          <div className={`text-sm ${isPlayer ? 'text-yellow-300 stroke-black-sm' : 'text-white'}`}>
                            {racer.name}
                            {isPlayer && (
                              <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] ml-1.5 border border-red-900">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-amber-300 font-sans">{racer.title}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] ${getTierColor(racer.tier)}`}>
                        {racer.tier}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right text-yellow-300 font-bold text-sm">
                      {racer.bestWpm} <span className="text-[10px] text-white">WPM</span>
                    </td>

                    <td className="py-3 px-4 text-right text-slate-200">
                      {racer.wins} / {racer.races}
                    </td>

                    <td className="py-3 px-4 text-right text-emerald-400">
                      {racer.winRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
