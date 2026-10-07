import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, ExternalLink, ShieldCheck } from 'lucide-react';

const LIVE_NOTIFICATIONS_BN = [
  'সাদিয়া আক্তার এইমাত্র বিকাশ থেকে ১০০ টাকা উত্তোলন করেছেন!',
  'রাকিব হাসান লাকি স্পিনে ২০০ কয়েন জিতেছেন!',
  'তানভীর আহমেদ এইমাত্র নগদ দিয়ে ৫০ টাকা ক্যাশআউট পেয়েছেন!',
  'ফারহানা রহমান গণিত কুইজ খেলে ৮০ কয়েন জিতেছেন!',
  'মেহেদী হাসান ৩ জন বন্ধুকে রেফার করে ৬০০ কয়েন বোনাস পেয়েছেন!',
  'সুমন দাস মোবাইল রিচার্জ ৫০ টাকা সফলভাবে পেয়েছেন!',
];

const LIVE_NOTIFICATIONS_EN = [
  'Sadia Akter just withdrew ৳100 via bKash!',
  'Rakib Hasan won 200 coins on Lucky Spin!',
  'Tanvir Ahmed just cashed out ৳50 via Nagad!',
  'Farhana Rahman earned 80 coins on Math Quiz!',
  'Mehedi Hasan received 600 coins referral bonus!',
  'Sumon Das received ৳50 Mobile Recharge successfully!',
];

export const NoticeBanner: React.FC = () => {
  const { settings, language } = useApp();
  const [currentLiveIndex, setCurrentLiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLiveIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS_BN.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const liveText =
    language === 'bn'
      ? LIVE_NOTIFICATIONS_BN[currentLiveIndex]
      : LIVE_NOTIFICATIONS_EN[currentLiveIndex];

  const adminNotice =
    language === 'bn' ? settings.noticeTextBn : settings.noticeTextEn;

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        {/* Admin Announcement Ticker */}
        <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
          <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 text-[11px]">
            <Megaphone className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'জরুরি নোটিশ' : 'Notice'}</span>
          </div>
          <div className="truncate text-slate-300 font-medium">
            {adminNotice}
          </div>
        </div>

        {/* Live Community Wins & Support Button */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3 shrink-0 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-semibold text-[11px] truncate max-w-[210px] sm:max-w-[240px]">
              {liveText}
            </span>
          </div>

          {settings.telegramSupportUrl && (
            <a
              href="https://t.me/eranbdincome"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:text-sky-300 hover:bg-sky-500/25 transition-all shrink-0"
            >
              <span>{language === 'bn' ? 'টেলিগ্রাম চ্যানেল (@eranbdincome)' : 'Telegram (@eranbdincome)'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
