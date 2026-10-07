import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { NoticeBanner } from './components/NoticeBanner';
import { Dashboard } from './components/Dashboard';
import { SpinWheel } from './components/SpinWheel';
import { ScratchCard } from './components/ScratchCard';
import { MathQuiz } from './components/MathQuiz';
import { TasksList } from './components/TasksList';
import { ReferEarn } from './components/ReferEarn';
import { Leaderboard } from './components/Leaderboard';
import { AdminPanel } from './components/AdminPanel';
import { WithdrawModal } from './components/WithdrawModal';
import { WalletPage } from './components/WalletPage';
import { ProfileDrawer } from './components/ProfileDrawer';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { AuthGate } from './components/AuthGate';
import {
  Home,
  Disc,
  Sparkles,
  Brain,
  CheckSquare,
  Users,
  Trophy,
  Shield,
  Heart,
  Send,
  Wallet,
} from 'lucide-react';
import { sounds } from './utils/sound';

const MainAppContent: React.FC = () => {
  const { user, activeTab, setActiveTab, isAdminMode, language, settings } = useApp();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Strict Authentication Gate: User cannot access tasks or app without registering / logging in!
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        <ToastContainer />
        <AuthGate />
      </div>
    );
  }

  const desktopTabs = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'wallet', labelBn: 'উত্তোলন (বিকাশ/নগদ)', labelEn: 'Withdraw', icon: Wallet },
    { id: 'spin', labelBn: 'লাকি স্পিন', labelEn: 'Lucky Spin', icon: Disc },
    { id: 'scratch', labelBn: 'স্ক্র্যাচ কার্ড', labelEn: 'Scratch Card', icon: Sparkles },
    { id: 'quiz', labelBn: 'গণিত কুইজ', labelEn: 'Math Quiz', icon: Brain },
    { id: 'tasks', labelBn: 'টাস্ক ও অফার', labelEn: 'Tasks & Offers', icon: CheckSquare },
    { id: 'refer', labelBn: 'রেফার করুন', labelEn: 'Refer & Earn', icon: Users },
    { id: 'leaderboard', labelBn: 'লিডারবোর্ড', labelEn: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300 pb-20 sm:pb-12">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
      />

      {/* Marquee & Live Notification Banner */}
      <NoticeBanner />

      {/* Desktop Sub-navigation Header Tabs */}
      {!isAdminMode && (
        <div className="hidden sm:block border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-sm sticky top-16 z-30">
          <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {isAdminMode ? (
          <AdminPanel />
        ) : (
          <>
            {activeTab === 'home' && (
              <Dashboard
                onOpenWallet={() => setIsWalletOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            )}
            {activeTab === 'wallet' && <WalletPage />}
            {activeTab === 'spin' && <SpinWheel />}
            {activeTab === 'scratch' && <ScratchCard />}
            {activeTab === 'quiz' && <MathQuiz />}
            {activeTab === 'tasks' && <TasksList />}
            {activeTab === 'refer' && <ReferEarn />}
            {activeTab === 'leaderboard' && <Leaderboard />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-12 py-6 bg-slate-950/80 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">ERAN PRO</span>
            <span>·</span>
            <span>
              {language === 'bn'
                ? '১০০% বিশ্বস্ত মাইক্রো টাস্ক আর্নিং প্ল্যাটফর্ম'
                : '100% Genuine Micro Task Earning Platform'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            {settings.telegramSupportUrl && (
              <a
                href="https://t.me/eranbdincome"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors flex items-center gap-1.5 font-medium"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram: @eranbdincome</span>
              </a>
            )}
            <button
              onClick={() => setIsWalletOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              {language === 'bn' ? 'উত্তোলন' : 'Cashout'}
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      {!isAdminMode && <BottomNav />}

      {/* Cashout / Wallet Modal */}
      <WithdrawModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />

      {/* User Profile & Transactions Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenWallet={() => setIsWalletOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
