import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Gift, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({ isOpen, onClose }) => {
  const { user, settings, language, claimDailyBonus } = useApp();

  if (!isOpen || !user) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const isClaimedToday = user.dailyBonusClaimedDate === todayStr;

  const daysReward = [
    { day: 1, coins: settings.dailyBonusCoinsBase, label: 'Day 1' },
    { day: 2, coins: settings.dailyBonusCoinsBase + 20, label: 'Day 2' },
    { day: 3, coins: settings.dailyBonusCoinsBase + 40, label: 'Day 3' },
    { day: 4, coins: settings.dailyBonusCoinsBase + 60, label: 'Day 4' },
    { day: 5, coins: settings.dailyBonusCoinsBase + 80, label: 'Day 5' },
    { day: 6, coins: settings.dailyBonusCoinsBase + 100, label: 'Day 6' },
    { day: 7, coins: 250, label: 'Day 7 (Mega)' },
  ];

  const handleClaim = () => {
    const res = claimDailyBonus();
    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base leading-tight">
                {language === 'bn' ? 'দৈনিক রিওয়ার্ড ক্যালেন্ডার' : 'Daily Streak Rewards'}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-0.5 font-medium">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>
                  {language === 'bn'
                    ? `বর্তমান স্ট্রিক: ${user.dailyStreak} দিন`
                    : `Current Streak: Day ${user.dailyStreak}`}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Day Grid */}
        <div className="p-5">
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            {language === 'bn'
              ? 'প্রতিদিন অ্যাপে প্রবেশ করে রিওয়ার্ড সংগ্রহ করুন। টানা ৭ দিন ক্লেইম করলে মেগা বোনাস ২৫০ কয়েন আনলক হবে!'
              : 'Log in each day to claim escalating coin rewards. Complete 7 consecutive days for the 250 Coins Mega Bonus!'}
          </p>

          <div className="grid grid-cols-4 gap-2.5 mb-5">
            {daysReward.slice(0, 4).map((d) => {
              const isPast = d.day < user.dailyStreak;
              const isCurrent = d.day === user.dailyStreak;
              const isFuture = d.day > user.dailyStreak;

              return (
                <div
                  key={d.day}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    isPast
                      ? 'bg-slate-950/60 border-emerald-500/30 text-emerald-400'
                      : isCurrent
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 ring-2 ring-amber-500/30'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    {language === 'bn' ? `দিন ${d.day}` : `Day ${d.day}`}
                  </span>
                  <div className="my-1 font-extrabold text-sm">
                    +{d.coins}
                  </div>
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="text-[10px] font-bold text-amber-400">
                      {isClaimedToday ? '✓' : 'TODAY'}
                    </span>
                  ) : (
                    <Gift className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {daysReward.slice(4, 7).map((d) => {
              const isPast = d.day < user.dailyStreak;
              const isCurrent = d.day === user.dailyStreak;
              const isMega = d.day === 7;

              return (
                <div
                  key={d.day}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    isMega
                      ? isCurrent
                        ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                        : 'bg-amber-950/30 border-amber-500/30 text-amber-400'
                      : isPast
                      ? 'bg-slate-950/60 border-emerald-500/30 text-emerald-400'
                      : isCurrent
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                    {isMega && <Sparkles className="w-3 h-3 text-amber-400" />}
                    <span>{language === 'bn' ? `দিন ${d.day}` : d.label}</span>
                  </div>
                  <div className="my-1.5 font-extrabold text-base">
                    +{d.coins}
                  </div>
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400">
                      {isMega ? 'MEGA' : 'BONUS'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <button
            onClick={handleClaim}
            disabled={isClaimedToday}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isClaimedToday
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 hover:scale-[1.02]'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>
              {isClaimedToday
                ? language === 'bn'
                  ? 'আজকের বোনাস নেওয়া হয়েছে (কাল আবার আসুন)'
                  : 'Already Claimed (Come back tomorrow)'
                : language === 'bn'
                ? 'আজকের কয়েন বোনাস গ্রহণ করুন'
                : 'Claim Today Bonus'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
