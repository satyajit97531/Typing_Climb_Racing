import React, { useState } from 'react';
import { UserProfile } from '../types';
import { saveActiveUser } from '../services/storage';
import { CAR_MODELS } from '../data/cars';
import { CarSvg } from './CarSvg';
import { soundFx } from '../services/soundFx';
import { 
  Award, 
  Trophy, 
  Zap, 
  Target, 
  Flame, 
  Edit3, 
  Check, 
  Sparkles,
  Medal
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUserUpdate: (updated: UserProfile) => void;
  onOpenAuthModal: () => void;
}

const AVAILABLE_AVATARS = ['🏎️', '⚡', '🔥', '🚀', '🏁', '🕶️', '🎯', '👑'];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUserUpdate,
  onOpenAuthModal,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(user.displayName);
  const [bio, setBio] = useState<string>(user.bio);
  const [avatar, setAvatar] = useState<string>(user.avatar);
  const [title, setTitle] = useState<string>(user.title);

  const activeCar = CAR_MODELS.find((c) => c.id === user.selectedCarId) || CAR_MODELS[0];
  const activeCarCustom = user.carCustomizations[user.selectedCarId];

  const handleSaveProfile = () => {
    const updated = {
      ...user,
      displayName: displayName.trim() || user.displayName,
      bio: bio.trim() || user.bio,
      avatar,
      title: title.trim() || user.title,
    };
    saveActiveUser(updated);
    onUserUpdate(updated);
    setIsEditing(false);
  };

  const unlockedAchievementsCount = user.achievements.filter((a) => a.unlocked).length;
  const totalAchievementsCount = user.achievements.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Profile Header Card with Countryside Backdrop */}
      <div className="relative rounded-2xl overflow-hidden border-4 border-amber-950 p-6 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200 shadow-2xl">
        {/* Sun Bloom */}
        <div className="absolute top-2 right-8 w-20 h-20 rounded-full bg-yellow-200/50 blur-lg pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 border-3 border-amber-900 flex items-center justify-center text-4xl shadow-xl">
              {avatar}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-game text-white stroke-black-md">
                  {user.displayName}
                </h2>
                <span className="bg-red-600 text-white font-game px-3 py-0.5 rounded-full text-xs uppercase border border-red-900 shadow-sm">
                  {user.tier}
                </span>
              </div>

              <div className="font-game text-sm text-yellow-300 stroke-black-sm mt-0.5">
                {user.title} · LEVEL {user.stats.level}
              </div>

              <p className="font-game text-xs text-amber-950 mt-1 max-w-md bg-amber-100/80 px-2 py-1 rounded-lg border border-amber-300">
                "{user.bio}"
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundFx.playButtonClick();
                setIsEditing(!isEditing);
              }}
              className="btn-hcr-wood px-4 py-2 rounded-xl font-game text-xs stroke-black-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 inline mr-1" />
              {isEditing ? 'CANCEL' : 'EDIT DRIVER'}
            </button>

            {user.isGuest && (
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  onOpenAuthModal();
                }}
                className="btn-hcr-yellow px-4 py-2 rounded-xl font-game text-xs stroke-black-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                CREATE ACCOUNT
              </button>
            )}
          </div>
        </div>

        {/* Editor */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t-2 border-amber-900/60 bg-amber-950/80 p-4 rounded-xl border-2 border-amber-900 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-game text-xs text-amber-200 uppercase block mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border-2 border-amber-900 rounded-xl font-game text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="font-game text-xs text-amber-200 uppercase block mb-1">
                  Driver Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border-2 border-amber-900 rounded-xl font-game text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <div>
              <label className="font-game text-xs text-amber-200 uppercase block mb-1">
                Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border-2 border-amber-900 rounded-xl font-game text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Avatar Insignia Picker */}
            <div>
              <label className="font-game text-xs text-amber-200 uppercase block mb-1">
                Select Driver Avatar
              </label>
              <div className="flex items-center gap-2">
                {AVAILABLE_AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      soundFx.playButtonClick();
                      setAvatar(av);
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      avatar === av
                        ? 'bg-amber-400 border-2 border-amber-900 scale-110 shadow-md'
                        : 'bg-slate-900 border border-amber-900/60 hover:bg-slate-800'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  handleSaveProfile();
                }}
                className="btn-hcr-green px-5 py-2 rounded-xl font-game text-xs stroke-black-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 inline mr-1" />
                SAVE DRIVER
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Driver Stats KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="hcr-panel p-4 border-3 border-amber-950 bg-gradient-to-b from-slate-900 to-amber-950">
          <div className="flex items-center gap-1.5 text-yellow-400 font-game text-xs">
            <Zap className="w-4 h-4" /> BEST SPEED
          </div>
          <div className="text-3xl font-game text-white stroke-black-sm mt-1">
            {user.stats.bestWpm} <span className="text-xs text-amber-200">WPM</span>
          </div>
          <div className="text-[11px] font-game text-amber-300 mt-0.5">
            Avg: {user.stats.averageWpm} WPM
          </div>
        </div>

        <div className="hcr-panel p-4 border-3 border-amber-950 bg-gradient-to-b from-slate-900 to-amber-950">
          <div className="flex items-center gap-1.5 text-yellow-400 font-game text-xs">
            <Trophy className="w-4 h-4" /> VICTORIES
          </div>
          <div className="text-3xl font-game text-white stroke-black-sm mt-1">
            {user.stats.winsCount} <span className="text-xs text-amber-200">WINS</span>
          </div>
          <div className="text-[11px] font-game text-amber-300 mt-0.5">
            {user.stats.racesCount} Total Climbs
          </div>
        </div>

        <div className="hcr-panel p-4 border-3 border-amber-950 bg-gradient-to-b from-slate-900 to-amber-950">
          <div className="flex items-center gap-1.5 text-emerald-400 font-game text-xs">
            <Target className="w-4 h-4" /> PRECISION
          </div>
          <div className="text-3xl font-game text-white stroke-black-sm mt-1">
            {user.stats.averageAccuracy}%
          </div>
          <div className="text-[11px] font-game text-emerald-300 mt-0.5">
            Typing Accuracy
          </div>
        </div>

        <div className="hcr-panel p-4 border-3 border-amber-950 bg-gradient-to-b from-slate-900 to-amber-950">
          <div className="flex items-center gap-1.5 text-red-400 font-game text-xs">
            <Flame className="w-4 h-4" /> WORDS TYPED
          </div>
          <div className="text-3xl font-game text-white stroke-black-sm mt-1">
            {user.stats.totalWordsTyped}
          </div>
          <div className="text-[11px] font-game text-red-300 mt-0.5">
            Total Hill Mileage
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="hcr-panel p-6 border-4 border-amber-950 bg-gradient-to-b from-slate-900 to-amber-950 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-900">
          <div className="flex items-center gap-2">
            <Award className="w-7 h-7 text-yellow-400" />
            <h3 className="text-2xl font-game text-yellow-300 stroke-black-sm">
              PROMINENT BADGES & TROPHIES
            </h3>
          </div>
          <span className="font-game text-xs text-amber-300">
            {unlockedAchievementsCount} / {totalAchievementsCount} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {user.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border-3 flex items-start gap-3 ${
                ach.unlocked
                  ? 'border-yellow-400 bg-amber-400/20 shadow-md'
                  : 'border-amber-950 bg-slate-950/60 opacity-60'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  ach.unlocked ? 'bg-amber-400 text-amber-950' : 'bg-slate-900 text-slate-500'
                }`}
              >
                <Medal className="w-5 h-5" />
              </div>

              <div>
                <div
                  className={`text-sm font-game ${
                    ach.unlocked ? 'text-yellow-300 stroke-black-sm' : 'text-slate-300'
                  }`}
                >
                  {ach.title}
                </div>
                <div className="text-[11px] font-sans text-amber-200 mt-0.5 leading-snug">
                  {ach.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Vehicle Stage */}
      <div className="relative rounded-2xl overflow-hidden border-4 border-emerald-950 bg-gradient-to-b from-sky-400 to-emerald-300 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-game text-xs text-amber-950 bg-yellow-300 px-3 py-1 rounded-full border border-amber-900">
            ACTIVE HILL CLIMBER
          </span>
          <h3 className="text-2xl font-game text-white stroke-black-md mt-2">
            {activeCar.name}
          </h3>
          <p className="font-game text-xs text-emerald-950 mt-1 max-w-xs">
            {activeCar.tagline}
          </p>
        </div>

        <div className="flex justify-center">
          <CarSvg
            carId={user.selectedCarId}
            customization={activeCarCustom}
            className="w-56 drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};
