import React, { useState } from 'react';
import { NavigationRoute, ExplorerProfile } from '../types';
import { HERO_ASSETS } from '../data/cosmicData';
import { BackButton } from '../components/BackButton';
import { CosmicLogo } from '../components/CosmicLogo';
import {
  Sparkles,
  KeyRound,
  Mail,
  User,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: NavigationRoute) => void;
  onLoginSuccess: (profileData: Partial<ExplorerProfile>) => void;
  onBack?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  onLoginSuccess,
  onBack,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [callsign, setCallsign] = useState<string>('');
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReset) {
      if (!email) {
        setStatusMsg('Please enter your archival transmission address.');
        return;
      }
      setStatusMsg('Password reset protocols dispatched to your address.');
      setTimeout(() => setIsReset(false), 2000);
      return;
    }

    onLoginSuccess({
      displayName: callsign.trim() || email.split('@')[0] || 'Explorer',
      email: email || 'explorer@quantumnest.space',
      rank: isRegister ? 'Level 1 Novice' : 'Level 4 Astrogator',
      rankLevel: isRegister ? 1 : 4,
    });
    onNavigate('/profile');
  };

  const handleGuestSession = () => {
    onLoginSuccess({
      displayName: 'Guest Astrogator',
      email: 'guest@quantumnest.space',
      rank: 'Level 2 Observer',
      rankLevel: 2,
    });
    onNavigate('/');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#050816] overflow-hidden">
      {/* Space-Themed Backdrop Layer (Replaces Login Video) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={HERO_ASSETS.loginCosmosBackdrop}
          alt="Planetary horizon backdrop"
          className="w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Top Left Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <BackButton onBack={onBack || (() => onNavigate('/'))} label="Return" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-30 rounded-3xl glass-card border border-white/15 p-8 lg:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <CosmicLogo size={48} />
          </div>
          <h2 className="text-2xl font-bold font-headline text-white">
            {isReset
              ? 'Reset Transmission'
              : isRegister
              ? 'Initialize Explorer ID'
              : 'Quantum Nest Portal'}
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono">
            {isReset
              ? 'Enter your archival email address to restore credentials'
              : 'Cosmic Insights Archival Hub Authentication'}
          </p>
        </div>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-[#5DA9FF]/10 border border-[#5DA9FF]/30 text-xs font-mono text-[#5DA9FF] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {isRegister && !isReset && (
            <div className="space-y-1">
              <label className="text-[#94A3B8]">EXPLORER CALLSIGN</label>
              <div className="relative">
                <input
                  type="text"
                  value={callsign}
                  onChange={(e) => setCallsign(e.target.value)}
                  placeholder="e.g. Commander Nova"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#5DA9FF]"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[#94A3B8]">TRANSMISSION EMAIL</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="astrogator@quantum.space"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#5DA9FF]"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {!isReset && (
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[#94A3B8]">
                <span>ENCRYPTED ACCESS KEY</span>
                <button
                  type="button"
                  onClick={() => setIsReset(true)}
                  className="text-[10px] text-[#5DA9FF] hover:underline cursor-pointer"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#5DA9FF]"
                />
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl cosmic-gradient text-white font-bold text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(93,169,255,0.4)] mt-2 cursor-pointer"
          >
            {isReset
              ? 'Dispatch Password Reset'
              : isRegister
              ? 'Complete Explorer Profile'
              : 'Initialize Session'}
          </button>
        </form>

        <div className="pt-2 border-t border-white/5 space-y-3 text-center">
          <button
            type="button"
            onClick={handleGuestSession}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#5DA9FF] text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Launch Immediate Guest Session</span>
          </button>

          <div className="text-[11px] font-mono text-[#94A3B8]">
            {isReset ? (
              <button
                type="button"
                onClick={() => setIsReset(false)}
                className="text-[#5DA9FF] hover:underline cursor-pointer"
              >
                Back to Login
              </button>
            ) : isRegister ? (
              <span>
                Existing Explorer?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-[#5DA9FF] hover:underline font-bold cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New Observer?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-[#5DA9FF] hover:underline font-bold cursor-pointer"
                >
                  Create Explorer Identity
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
