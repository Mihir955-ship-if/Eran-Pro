import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  Globe,
  Volume2,
  VolumeX,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  LogOut,
  Download,
} from 'lucide-react';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProfile, onOpenWallet }) => {
  const {
    user,
    settings,
    language,
    toggleLanguage,
    isAdminMode,
    switchUserRole,
    soundEnabled,
    toggleSound,
    setActiveTab,
    logoutUser,
  } = useApp();

  if (!user) return null;

  const bdtValue = (user.coins / settings.coinsPerBdt).toFixed(2);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img
            src="/app-logo.png"
            alt="Eran Pro Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-500/30"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                ERAN PRO
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-semibold">
              Work • Earn • Grow
            </p>
          </div>
        </div>

        {/* Right Section: Coin balance & actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Coin Balance Button */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/60 hover:bg-slate-800/90 transition-all shadow-inner group"
            title={language === 'bn' ? 'টাকা উত্তোলন করতে ক্লিক করুন' : 'Click to withdraw'}
          >
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4 fill-amber-400/30 text-amber-400 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-amber-300 leading-tight">
                {user.coins.toLocaleString()} <span className="text-[10px] font-normal text-amber-400/80">{language === 'bn' ? 'কয়েন' : 'Coins'}</span>
              </div>
              <div className="text-[10px] text-slate-400 leading-tight font-medium">
                ≈ ৳{bdtValue}
              </div>
            </div>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'bn' ? 'বাং' : 'EN'}</span>
          </button>

          {/* Download APK Link */}
          <a
            href="/EranPro-v1.0.0-release.apk"
            download="EranPro-v1.0.0-release.apk"
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title={language === 'bn' ? 'অ্যান্ড্রয়েড APK ডাউনলোড করুন' : 'Download Android APK'}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">APK</span>
          </a>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Mode Switcher: User vs Admin */}
          <button
            onClick={() => switchUserRole(isAdminMode ? 'user' : 'admin')}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isAdminMode
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 hover:bg-rose-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title={isAdminMode ? 'Back to User App' : 'Switch to Admin Panel'}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isAdminMode ? 'text-rose-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">
              {isAdminMode
                ? (language === 'bn' ? 'ইউজার মোড' : 'User App')
                : (language === 'bn' ? 'অ্যাডমিন' : 'Admin')}
            </span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={onOpenProfile}
            className="relative rounded-full ring-2 ring-emerald-500/30 hover:ring-emerald-400 transition-all overflow-hidden w-9 h-9 flex items-center justify-center bg-slate-800"
            title="View Profile"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-slate-300" />
            )}
          </button>

          {/* Quick Logout Button */}
          <button
            onClick={logoutUser}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
            title={language === 'bn' ? 'লগআউট করুন' : 'Log Out'}
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

