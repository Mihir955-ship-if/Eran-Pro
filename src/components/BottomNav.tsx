import React from 'react';
import { useApp } from '../context/AppContext';
import { AppTab } from '../types';
import {
  Home,
  Disc,
  Sparkles,
  CheckSquare,
  Wallet,
  Users,
  Trophy,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();

  const navItems: { id: AppTab; labelBn: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'spin', labelBn: 'স্পিন', labelEn: 'Spin', icon: Disc },
    { id: 'scratch', labelBn: 'স্ক্র্যাচ', labelEn: 'Scratch', icon: Sparkles },
    { id: 'tasks', labelBn: 'টাস্ক', labelEn: 'Tasks', icon: CheckSquare },
    { id: 'wallet', labelBn: 'ওয়ালেট', labelEn: 'Wallet', icon: Wallet },
    { id: 'refer', labelBn: 'রেফার', labelEn: 'Refer', icon: Users },
    { id: 'leaderboard', labelBn: 'র‍্যাঙ্ক', labelEn: 'Ranks', icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 sm:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none">
                {language === 'bn' ? item.labelBn : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
