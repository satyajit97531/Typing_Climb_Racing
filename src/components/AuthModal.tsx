import React, { useState } from 'react';
import { UserProfile } from '../types';
import { loginUser, registerUser } from '../services/storage';
import { soundFx } from '../services/soundFx';
import { X, Lock, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      const res = registerUser(username, password, displayName);
      if (res.success && res.user) {
        soundFx.playFanfare(true);
        setSuccessMsg('Account created! Your tuned vehicles and coins are saved.');
        setTimeout(() => {
          onAuthSuccess(res.user!);
          onClose();
        }, 800);
      } else {
        soundFx.playError();
        setErrorMsg(res.message);
      }
    } else {
      const res = loginUser(username, password);
      if (res.success && res.user) {
        soundFx.playFanfare(false);
        setSuccessMsg('Welcome back to the hills!');
        setTimeout(() => {
          onAuthSuccess(res.user!);
          onClose();
        }, 800);
      } else {
        soundFx.playError();
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md rounded-2xl border-4 border-amber-950 bg-gradient-to-b from-[#2e1307] to-[#120702] shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b-3 border-amber-950 bg-gradient-to-r from-amber-950 to-[#3d1a0a] relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-xl text-amber-200 hover:text-white btn-hcr-wood"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🏎️</span>
            <span className="font-game text-xs text-yellow-300 stroke-black-sm uppercase">
              Hill Climb Racing Driver Cloud
            </span>
          </div>

          <h3 className="text-2xl font-game text-white stroke-black-md">
            {mode === 'signup' ? 'REGISTER DRIVER ACCOUNT' : 'DRIVER SIGN IN'}
          </h3>
          <p className="font-game text-xs text-amber-200 mt-0.5">
            Save your tuned cars, coins, and high scores across all devices.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-amber-950 bg-slate-950/60 p-1 gap-2">
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 font-game text-xs rounded-xl cursor-pointer ${
              mode === 'signup' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            CREATE ACCOUNT
          </button>
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 font-game text-xs rounded-xl cursor-pointer ${
              mode === 'login' ? 'btn-hcr-yellow' : 'btn-hcr-wood'
            }`}
          >
            SIGN IN
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border-2 border-red-600 rounded-xl text-red-200 text-xs font-game flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border-2 border-emerald-500 rounded-xl text-emerald-200 text-xs font-game flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="font-game text-xs uppercase text-amber-200 block mb-1">
                Driver Call Sign / Name
              </label>
              <div className="relative">
                <Sparkles className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                <input
                  type="text"
                  placeholder="e.g. HillClimber_Bill"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border-2 border-amber-950 rounded-xl font-game text-xs text-white placeholder:text-amber-400/40 focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-game text-xs uppercase text-amber-200 block mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                required
                placeholder="e.g. hillracer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border-2 border-amber-950 rounded-xl font-game text-xs text-white placeholder:text-amber-400/40 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="font-game text-xs uppercase text-amber-200 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border-2 border-amber-950 rounded-xl font-game text-xs text-white placeholder:text-amber-400/40 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 btn-hcr-green font-game text-base uppercase rounded-xl stroke-black-sm cursor-pointer active:scale-98"
          >
            {mode === 'signup' ? 'REGISTER & SAVE GARAGE' : 'SIGN IN TO DRIVER ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
};
