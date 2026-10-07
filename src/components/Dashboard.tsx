import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  ArrowUpRight,
  Gift,
  Disc,
  Sparkles,
  Brain,
  CheckSquare,
  Users,
  Trophy,
  History,
  TrendingUp,
  ShieldCheck,
  Flame,
  ChevronRight,
  Send,
  ExternalLink,
  Smartphone,
  Download,
} from 'lucide-react';
import { DailyBonusModal } from './DailyBonusModal';
import { GoogleAdBanner } from './GoogleAdBanner';
import { sounds } from '../utils/sound';

interface DashboardProps {
  onOpenWallet: () => void;
  onOpenProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenWallet, onOpenProfile }) => {
  const { user, settings, language, setActiveTab, transactions } = useApp();
  const [showDailyBonusModal, setShowDailyBonusModal] = useState(false);

  if (!user) return null;

  const bdtValue = (user.coins / settings.coinsPerBdt).toFixed(2);
  const todayStr = new Date().toISOString().slice(0, 10);
  const isDailyBonusClaimed = user.dailyBonusClaimedDate === todayStr;

  const quickActions = [
    {
      id: 'daily',
      titleBn: 'দৈনিক বোনাস',
      titleEn: 'Daily Check-in',
      subtitleBn: isDailyBonusClaimed ? 'আজ ক্লেম করা হয়েছে' : `দিন ${user.dailyStreak} সংগ্রহ করুন`,
      subtitleEn: isDailyBonusClaimed ? 'Claimed Today' : `Claim Day ${user.dailyStreak}`,
      icon: Gift,
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30',
      action: () => setShowDailyBonusModal(true),
      tag: isDailyBonusClaimed ? 'DONE' : 'NEW',
      tagColor: isDailyBonusClaimed ? 'text-slate-400' : 'text-amber-400 font-black',
    },
    {
      id: 'spin',
      titleBn: 'লাকি স্পিন',
      titleEn: 'Lucky Spin',
      subtitleBn: `${user.spinsLeftToday} স্পিন বাকি`,
      subtitleEn: `${user.spinsLeftToday} spins left`,
      icon: Disc,
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
      action: () => {
        sounds.playClick();
        setActiveTab('spin');
      },
      tag: `${user.spinsLeftToday}/${settings.spinLimitDaily}`,
      tagColor: 'text-emerald-400',
    },
    {
      id: 'scratch',
      titleBn: 'স্ক্র্যাচ কার্ড',
      titleEn: 'Scratch Card',
      subtitleBn: `${user.scratchCardsLeftToday} কার্ড বাকি`,
      subtitleEn: `${user.scratchCardsLeftToday} cards left`,
      icon: Sparkles,
      iconColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30',
      action: () => {
        sounds.playClick();
        setActiveTab('scratch');
      },
      tag: `${user.scratchCardsLeftToday}/${settings.scratchLimitDaily}`,
      tagColor: 'text-cyan-400',
    },
    {
      id: 'quiz',
      titleBn: 'গণিত কুইজ',
      titleEn: 'Math Quiz',
      subtitleBn: `${user.mathQuizzesLeftToday} কুইজ বাকি`,
      subtitleEn: `${user.mathQuizzesLeftToday} quizzes left`,
      icon: Brain,
      iconColor: 'text-purple-400',
      badgeBg: 'bg-purple-500/10 border-purple-500/30',
      action: () => {
        sounds.playClick();
        setActiveTab('quiz');
      },
      tag: `${user.mathQuizzesLeftToday}/${settings.mathQuizLimitDaily}`,
      tagColor: 'text-purple-400',
    },
    {
      id: 'tasks',
      titleBn: 'টাস্ক ও অফার',
      titleEn: 'Task Offers',
      subtitleBn: 'ভিডিও ও ওয়েব ভিজিট',
      subtitleEn: 'Video & Web Visits',
      icon: CheckSquare,
      iconColor: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 border-sky-500/30',
      action: () => {
        sounds.playClick();
        setActiveTab('tasks');
      },
      tag: '+250 COINS',
      tagColor: 'text-sky-400 font-bold',
    },
    {
      id: 'refer',
      titleBn: 'রেফার এবং আয়',
      titleEn: 'Refer & Earn',
      subtitleBn: `প্রতি রেফারে ${settings.referralBonusCoins} কয়েন`,
      subtitleEn: `${settings.referralBonusCoins} coins / friend`,
      icon: Users,
      iconColor: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/30',
      action: () => {
        sounds.playClick();
        setActiveTab('refer');
      },
      tag: '+10% COMM',
      tagColor: 'text-indigo-400 font-bold',
    },
  ];

  const recentTx = transactions.slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Google AdSense Sponsored Ad - Top of Home Screen */}
      <GoogleAdBanner slot="home-top-header" />

      {/* App Branding & Welcome Banner with Official Logo */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="/app-logo.png"
            alt="Eran Pro Logo"
            className="w-12 h-12 rounded-2xl object-cover shadow-lg shadow-amber-500/20 border border-amber-500/30 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-white">
                {language === 'bn' ? `স্বাগতম, ${user.name}!` : `Welcome, ${user.name}!`}
              </h2>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                OFFICIAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Work • Earn • Grow · {language === 'bn' ? 'প্রতিদিনের সহজ টাস্ক ও বিকাশ/নগদে ক্যাশআউট' : 'Daily micro tasks & instant cashouts'}
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Hero Card */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">
                {language === 'bn' ? 'মোট ব্যালেন্স' : 'Total Balance'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% VERIFIED
              </span>
            </div>

            <button
              onClick={onOpenProfile}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'হিস্ট্রি' : 'History'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight">
                  {user.coins.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base font-bold text-amber-400/80">
                  {language === 'bn' ? 'কয়েন' : 'Coins'}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-300 mt-1 flex items-center gap-2">
                <span>≈ ৳{bdtValue} BDT</span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">
                  {language === 'bn' ? '১০০ কয়েন = ১ টাকা' : '100 Coins = 1 BDT'}
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenWallet}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                <span>{language === 'bn' ? 'টাকা উত্তোলন (Cashout)' : 'Withdraw Cash'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 mt-6 pt-4 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <div className="text-[10px] text-slate-400 font-medium">
                {language === 'bn' ? 'আজকের আয়' : "Today's Earned"}
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">
                +{user.todayEarned} {language === 'bn' ? 'কয়েন' : 'Coins'}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <div className="text-[10px] text-slate-400 font-medium">
                {language === 'bn' ? 'রেফারেল আয়' : 'Referral Coins'}
              </div>
              <div className="text-xs font-bold text-indigo-400 mt-0.5">
                +{user.referralEarnings}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{language === 'bn' ? 'স্ট্রিক' : 'Streak'}</span>
              </div>
              <div className="text-xs font-bold text-amber-300 mt-0.5">
                {user.dailyStreak} {language === 'bn' ? 'দিন' : 'Days'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Banner Quick Access */}
      {!isDailyBonusClaimed && (
        <div
          onClick={() => setShowDailyBonusModal(true)}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-slate-900 border border-amber-500/40 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all shadow-lg group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>{language === 'bn' ? 'আজকের দৈনিক বোনাস প্রস্তুত!' : 'Daily Bonus is Ready!'}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                  FREE
                </span>
              </div>
              <div className="text-[11px] text-amber-300/90 mt-0.5">
                {language === 'bn'
                  ? `দিন ${user.dailyStreak} স্ট্রিক ক্লেইম করে কয়েন সংগ্রহ করুন`
                  : `Claim your Day ${user.dailyStreak} streak coins now`}
              </div>
            </div>
          </div>

          <button className="py-1.5 px-3.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow">
            {language === 'bn' ? 'ক্লেম করুন' : 'Claim'}
          </button>
        </div>
      )}

      {/* Grid of Earning Methods */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-extrabold text-white text-base">
            {language === 'bn' ? 'আয়ের মাধ্যমসমূহ' : 'Ways to Earn'}
          </h3>
          <span className="text-xs text-slate-400">
            {language === 'bn' ? 'প্রতিদিন নতুন রিওয়ার্ড' : 'Daily Fresh Tasks'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={action.action}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition-all shadow-md flex flex-col justify-between group active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${action.badgeBg} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${action.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-mono ${action.tagColor}`}>
                      {action.tag}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm leading-tight group-hover:text-emerald-400 transition-colors">
                    {language === 'bn' ? action.titleBn : action.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {language === 'bn' ? action.subtitleBn : action.subtitleEn}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                  <span>{language === 'bn' ? 'শুরু করুন' : 'Play Now'}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Shortcut Banner */}
      <div
        onClick={() => {
          sounds.playClick();
          setActiveTab('leaderboard');
        }}
        className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">
              {language === 'bn' ? 'সাপ্তাহিক লিডারবোর্ড দেখুন' : 'View Weekly Leaderboard'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {language === 'bn' ? 'টপ আর্নাররা প্রতি সপ্তাহে আকর্ষণীয় পুরস্কার জেতেন' : 'Compete with top earners for extra weekly bonus rewards'}
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </div>

      {/* Official Telegram Channel Banner */}
      <a
        href="https://t.me/eranbdincome"
        target="_blank"
        rel="noopener noreferrer"
        className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/70 via-slate-900 to-sky-900/30 border border-sky-500/40 hover:border-sky-400 transition-all flex items-center justify-between group shadow-lg shadow-sky-950/40"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
            <Send className="w-5 h-5 -rotate-12 fill-sky-400/20 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                {language === 'bn' ? 'অফিসিয়াল টেলিগ্রাম চ্যানেল (@eranbdincome)' : 'Official Telegram Channel (@eranbdincome)'}
              </h4>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                OFFICIAL
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {language === 'bn'
                ? 'পেমেন্ট প্রুফ, নতুন আপডেট ও গিভঅ্যাওয়ে পেতে এখনই টেলিগ্রামে জয়েন করুন।'
                : 'Join our channel for instant payment proofs, giveaways & daily updates.'}
            </p>
          </div>
        </div>

        <div className="py-2 px-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black shrink-0 transition-colors hidden sm:flex items-center gap-1.5 shadow-md shadow-sky-500/20">
          <span>{language === 'bn' ? 'জয়েন করুন' : 'Join Channel'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </a>

      {/* Download Android APK Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white">
                {language === 'bn' ? 'Eran Pro অফিসিয়াল Android APK' : 'Official Eran Pro Android App'}
              </h4>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                v1.0.0
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {language === 'bn'
                ? 'সরাসরি মোবাইলে ইনস্টল করতে APK ডাউনলোড করুন (১৯৪ KB)।'
                : 'Download and install APK directly to your phone (194 KB).'}
            </p>
          </div>
        </div>

        <a
          href="/EranPro-v1.0.0-release.apk"
          download="EranPro-v1.0.0-release.apk"
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 shrink-0 hover:scale-105"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'APK ডাউনলোড' : 'Download APK'}</span>
        </a>
      </div>

      {/* Recent Activity / Transactions Preview */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-extrabold text-white text-sm">
            {language === 'bn' ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activity'}
          </h3>
          <button
            onClick={onOpenProfile}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {language === 'bn' ? 'সব দেখুন' : 'View All'}
          </button>
        </div>

        <div className="space-y-2">
          {recentTx.map((tx) => (
            <div
              key={tx.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-slate-200">{tx.details}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{tx.createdAt}</div>
              </div>
              <div
                className={`font-mono font-bold text-right shrink-0 ${
                  tx.amountCoins > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {tx.amountCoins > 0 ? `+${tx.amountCoins}` : tx.amountCoins}{' '}
                <span className="text-[10px] font-normal">{language === 'bn' ? 'কয়েন' : 'Coins'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Bonus Streak Modal */}
      <DailyBonusModal
        isOpen={showDailyBonusModal}
        onClose={() => setShowDailyBonusModal(false)}
      />
    </div>
  );
};
