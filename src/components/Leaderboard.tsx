import React from 'react';
import { useApp } from '../context/AppContext';
import { sampleLeaderboardUsers } from '../data/seedData';
import { Trophy, Medal, Crown, Award, CheckSquare, Coins } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { user, settings, language } = useApp();

  if (!user) return null;

  const top3 = sampleLeaderboardUsers.slice(0, 3);
  const remaining = sampleLeaderboardUsers.slice(3);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সেরা আর্নারদের তালিকা' : 'Hall of Fame'}</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {language === 'bn' ? 'সাপ্তাহিক লিডারবোর্ড র‍্যাঙ্কিং' : 'Weekly Top Earners'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'bn'
            ? 'প্রতি সপ্তাহে সেরা ৩ জনকে বিশেষ মেগা বোনাস প্রদান করা হয়।'
            : 'Top 3 earners every week receive special cash prizes and bonus coins.'}
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2.5 items-end mb-6 pt-4">
        {/* 2nd Place */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center relative order-1">
          <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center -top-3 absolute shadow">
            2
          </div>
          <div className="w-12 h-12 rounded-full ring-2 ring-slate-400 overflow-hidden mt-1 mb-2">
            <img src={top3[1].avatar} alt={top3[1].name} className="w-full h-full object-cover" />
          </div>
          <div className="text-xs font-bold text-slate-200 truncate w-full">{top3[1].name}</div>
          <div className="text-xs font-black text-amber-300 mt-0.5">{top3[1].coins.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">≈ ৳{top3[1].bdt}</div>
        </div>

        {/* 1st Place */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 to-slate-900 border-2 border-amber-500/50 flex flex-col items-center text-center relative order-2 shadow-xl shadow-amber-500/10">
          <Crown className="w-6 h-6 text-amber-400 -top-4 absolute animate-bounce" />
          <div className="w-14 h-14 rounded-full ring-2 ring-amber-400 overflow-hidden mt-1 mb-2">
            <img src={top3[0].avatar} alt={top3[0].name} className="w-full h-full object-cover" />
          </div>
          <div className="text-xs font-bold text-white truncate w-full">{top3[0].name}</div>
          <div className="text-sm font-black text-amber-400 mt-0.5">{top3[0].coins.toLocaleString()}</div>
          <div className="text-[10px] text-amber-200/80 font-semibold">≈ ৳{top3[0].bdt}</div>
          <div className="mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
            CHAMPION
          </div>
        </div>

        {/* 3rd Place */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center relative order-3">
          <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center -top-3 absolute shadow">
            3
          </div>
          <div className="w-12 h-12 rounded-full ring-2 ring-amber-600 overflow-hidden mt-1 mb-2">
            <img src={top3[2].avatar} alt={top3[2].name} className="w-full h-full object-cover" />
          </div>
          <div className="text-xs font-bold text-slate-200 truncate w-full">{top3[2].name}</div>
          <div className="text-xs font-black text-amber-300 mt-0.5">{top3[2].coins.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">≈ ৳{top3[2].bdt}</div>
        </div>
      </div>

      {/* Remaining Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2 mb-6">
        {remaining.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-xs font-bold text-slate-400">
                #{item.rank}
              </span>
              <img
                src={item.avatar}
                alt={item.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="text-xs font-bold text-slate-200">{item.name}</div>
                <div className="text-[10px] text-slate-400">
                  {item.tasksDone} {language === 'bn' ? 'টাস্ক সম্পন্ন' : 'tasks completed'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-extrabold text-amber-300">
                {item.coins.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                ≈ ৳{item.bdt}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Your Rank Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-sm">
            #14
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {language === 'bn' ? 'আপনার বর্তমান অবস্থান' : 'Your Ranking'}
            </div>
            <div className="text-[11px] text-slate-300">
              {user.name} ({user.coins.toLocaleString()} {language === 'bn' ? 'কয়েন' : 'Coins'})
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold text-emerald-400">
            {language === 'bn' ? 'টপ ১০-এ উঠতে আরও কাজ করুন' : 'Keep earning to enter Top 10'}
          </span>
        </div>
      </div>
    </div>
  );
};
