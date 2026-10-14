import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { getActiveUser, saveActiveUser } from './services/storage';
import { soundFx } from './services/soundFx';
import { Navbar } from './components/Navbar';
import { RaceView } from './components/RaceView';
import { GarageView } from './components/GarageView';
import { LeaderboardView } from './components/LeaderboardView';
import { QuestsView } from './components/QuestsView';
import { ProfileView } from './components/ProfileView';
import { ChatLounge } from './components/ChatLounge';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [user, setUser] = useState<UserProfile>(getActiveUser);
  const [currentTab, setCurrentTab] = useState<'race' | 'garage' | 'leaderboard' | 'quests' | 'profile' | 'chat'>('race');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  useEffect(() => {
    saveActiveUser(user);
  }, [user]);

  // Autostart racing music on first user gesture (browser AudioContext unlock)
  useEffect(() => {
    const startAudioOnInteraction = () => {
      soundFx.startRacingMusic();
      window.removeEventListener('pointerdown', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
    };

    window.addEventListener('pointerdown', startAudioOnInteraction);
    window.addEventListener('keydown', startAudioOnInteraction);

    return () => {
      window.removeEventListener('pointerdown', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
    };
  }, []);

  const handleUserUpdate = (updated: UserProfile) => {
    setUser(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b0a03] via-[#240e04] to-[#120601] text-amber-100 flex flex-col font-game selection:bg-yellow-400 selection:text-amber-950">
      {/* Hill Climb Racing Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onOpenAuthModal={() => setIsAuthOpen(true)}
      />

      {/* Main Game Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6">
        {currentTab === 'race' && (
          <RaceView
            user={user}
            onUserUpdate={handleUserUpdate}
            onNavigateToGarage={() => setCurrentTab('garage')}
          />
        )}

        {currentTab === 'garage' && (
          <GarageView
            user={user}
            onUserUpdate={handleUserUpdate}
            onStartRace={() => setCurrentTab('race')}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView user={user} />
        )}

        {currentTab === 'quests' && (
          <QuestsView
            user={user}
            onUserUpdate={handleUserUpdate}
            onStartRace={() => setCurrentTab('race')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            onUserUpdate={handleUserUpdate}
            onOpenAuthModal={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === 'chat' && (
          <ChatLounge user={user} />
        )}
      </main>

      {/* Hill Climb Racing Footer */}
      <footer className="mt-auto border-t-4 border-amber-950 bg-[#160601] py-4 text-xs font-game text-amber-400/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>🏎️ Hill Climb Racing · Speed Typing Championship</span>
            <span aria-hidden="true">·</span>
            <span>Countryside Stage</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Physics Hill Climber</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-yellow-400 hover:underline cursor-pointer"
            >
              {user.isGuest ? 'Save Account' : 'Switch Driver'}
            </button>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
        }}
      />
    </div>
  );
}
