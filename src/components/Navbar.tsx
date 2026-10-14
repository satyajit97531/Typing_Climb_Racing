import React from 'react';
import { UserProfile } from '../types';
import { soundFx } from '../services/soundFx';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface NavbarProps {
  currentTab: 'race' | 'garage' | 'leaderboard' | 'quests' | 'profile' | 'chat';
  onSelectTab: (tab: 'race' | 'garage' | 'leaderboard' | 'quests' | 'profile' | 'chat') => void;
  user: UserProfile;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(soundFx.getMuted());
  const [isMusicPlaying, setIsMusicPlaying] = React.useState<boolean>(soundFx.getMusicPlaying());
  const [trackName, setTrackName] = React.useState<string>(soundFx.getTrackName());

  const handleToggleSound = () => {
    soundFx.playButtonClick();
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleMusic = () => {
    soundFx.playButtonClick();
    const playing = soundFx.toggleMusic();
    setIsMusicPlaying(playing);
    setTrackName(soundFx.getTrackName());
  };

  const handleCycleTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playButtonClick();
    const next = soundFx.nextTrack();
    setTrackName(next);
    setIsMusicPlaying(true);
  };

  const handleTabClick = (tab: 'race' | 'garage' | 'leaderboard' | 'quests' | 'profile' | 'chat') => {
    soundFx.playButtonClick();
    onSelectTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-b from-[#2e1307] via-[#3d1a0a] to-[#250d03] border-b-4 border-amber-950 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5">
        {/* Zone 1: Wordmark Logo in Hill Climb Racing Style */}
        <button
          onClick={() => handleTabClick('race')}
          className="text-xl sm:text-2xl font-game font-black tracking-wide text-white whitespace-nowrap shrink-0 flex items-center gap-2 group cursor-pointer stroke-black-md"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">🏎️</span>
          <span>
            HILL CLIMB <span className="text-yellow-400">TYPING</span>
          </span>
        </button>

        {/* Zone 2: 4–5 Chunky 3D Game Navigation Buttons */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleTabClick('race')}
            className={`px-4 py-1.5 rounded-xl font-game text-sm uppercase transition-all cursor-pointer ${
              currentTab === 'race' ? 'btn-hcr-green' : 'btn-hcr-wood'
            }`}
          >
            RACE
          </button>
          <button
            onClick={() => handleTabClick('garage')}
            className={`px-4 py-1.5 rounded-xl font-game text-sm uppercase transition-all cursor-pointer ${
              currentTab === 'garage' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            TUNE
          </button>
          <button
            onClick={() => handleTabClick('leaderboard')}
            className={`px-4 py-1.5 rounded-xl font-game text-sm uppercase transition-all cursor-pointer ${
              currentTab === 'leaderboard' ? 'btn-hcr-blue' : 'btn-hcr-wood'
            }`}
          >
            RANKS
          </button>
          <button
            onClick={() => handleTabClick('quests')}
            className={`px-4 py-1.5 rounded-xl font-game text-sm uppercase transition-all cursor-pointer relative ${
              currentTab === 'quests' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            QUESTS
            {user.dailyQuests.some((q) => q.completed && !q.claimed) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white animate-bounce" />
            )}
          </button>
          <button
            onClick={() => handleTabClick('chat')}
            className={`px-4 py-1.5 rounded-xl font-game text-sm uppercase transition-all cursor-pointer ${
              currentTab === 'chat' ? 'btn-hcr-blue' : 'btn-hcr-wood'
            }`}
          >
            CHAT
          </button>
        </nav>

        {/* Zone 3: Music Toggle, SFX Toggle, Coins Badge & Driver Profile Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Racing Music Toggle & Track Cycler */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleMusic}
              title={isMusicPlaying ? `Music Playing: ${trackName}. Click to turn off.` : 'Turn on arcade racing music'}
              className={`px-2.5 py-1.5 rounded-xl font-game text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                isMusicPlaying ? 'btn-hcr-yellow shadow-md' : 'btn-hcr-wood opacity-80'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">
                {isMusicPlaying ? trackName : 'RACING MUSIC'}
              </span>
            </button>
            {isMusicPlaying && (
              <button
                onClick={handleCycleTrack}
                title="Next Racing Track"
                className="px-2 py-1.5 rounded-xl font-game text-xs btn-hcr-blue cursor-pointer hidden md:flex items-center"
              >
                ⏭️
              </button>
            )}
          </div>

          {/* Sound FX Toggle Button */}
          <button
            onClick={handleToggleSound}
            aria-label="Toggle sound"
            title="Toggle Sound Effects"
            className="p-2 btn-hcr-wood rounded-xl cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-yellow-300" />}
          </button>

          {/* Yellow Coin Counter Pill */}
          <button
            onClick={() => handleTabClick('garage')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 border-2 border-amber-900 rounded-xl font-game text-xs text-amber-950 font-black shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="text-base">🪙</span>
            <span>{user.stats.nitroCoins}</span>
          </button>

          {/* Driver Profile CTA */}
          <button
            onClick={() => handleTabClick('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-game text-xs stroke-black-sm transition-all cursor-pointer ${
              currentTab === 'profile' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            <span className="text-sm">{user.avatar}</span>
            <span className="truncate max-w-[80px] sm:max-w-[100px]">{user.displayName}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Bar */}
      <div className="md:hidden flex items-center justify-around border-t-2 border-amber-950 px-2 py-1.5 bg-[#250d03]">
        <button
          onClick={() => handleTabClick('race')}
          className={`font-game text-xs ${currentTab === 'race' ? 'text-yellow-400 font-bold' : 'text-amber-200'}`}
        >
          RACE
        </button>
        <button
          onClick={() => handleTabClick('garage')}
          className={`font-game text-xs ${currentTab === 'garage' ? 'text-yellow-400 font-bold' : 'text-amber-200'}`}
        >
          TUNE
        </button>
        <button
          onClick={() => handleTabClick('leaderboard')}
          className={`font-game text-xs ${currentTab === 'leaderboard' ? 'text-yellow-400 font-bold' : 'text-amber-200'}`}
        >
          RANKS
        </button>
        <button
          onClick={() => handleTabClick('quests')}
          className={`font-game text-xs ${currentTab === 'quests' ? 'text-yellow-400 font-bold' : 'text-amber-200'}`}
        >
          QUESTS
        </button>
        <button
          onClick={() => handleTabClick('chat')}
          className={`font-game text-xs ${currentTab === 'chat' ? 'text-yellow-400 font-bold' : 'text-amber-200'}`}
        >
          CHAT
        </button>
      </div>
    </header>
  );
};
