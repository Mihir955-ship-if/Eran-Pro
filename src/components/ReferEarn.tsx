import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Copy,
  Check,
  Share2,
  Sparkles,
  Gift,
  Coins,
  Send,
  MessageCircle,
} from 'lucide-react';
import { sounds } from '../utils/sound';

export const ReferEarn: React.FC = () => {
  const { user, settings, language, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const referralLink = `https://eranpro.app/join?ref=${user.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    sounds.playCoin();
    showToast(
      language === 'bn' ? 'রেফার কোড কপি হয়েছে!' : 'Referral code copied!',
      'success'
    );
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = (platform: 'whatsapp' | 'telegram' | 'native') => {
    const text =
      language === 'bn'
        ? `🔥 Eran Pro অ্যাপে জয়েন করে প্রতিদিন ৩০০-৫০০ টাকা আয় করুন! আমার রেফার কোড ${user.referralCode} ব্যবহার করে পাবেন ২০০ কয়েন ফ্রি সাইনআপ বোনাস! লিঙ্ক: ${referralLink}`
        : `🔥 Earn daily rewards with Eran Pro! Use my invite code ${user.referralCode} to get 200 free coins bonus! Link: ${referralLink}`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'Eran Pro Earning App',
          text,
          url: referralLink,
        }).catch(() => {});
      } else {
        handleCopy();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'রেফারেল প্রোগ্রাম' : 'Refer & Earn'}</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {language === 'bn' ? 'বন্ধুদের রেফার করুন ও আনলিমিটেড আয় করুন' : 'Invite Friends & Earn Lifetime Rewards'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'bn'
            ? `প্রতি রেফারে ${settings.referralBonusCoins} কয়েন বোনাস এবং আজীবন ${settings.referralCommissionPercent}% কমিশন পান।`
            : `Earn ${settings.referralBonusCoins} coins per signup + ${settings.referralCommissionPercent}% lifetime commission on their task rewards.`}
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">
                {language === 'bn' ? 'মোট রেফার ফ্রেন্ড' : 'Total Referred'}
              </div>
              <div className="text-xl font-extrabold text-white mt-0.5">
                {user.referralCount} <span className="text-xs font-normal text-slate-400">{language === 'bn' ? 'জন' : 'users'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">
                {language === 'bn' ? 'রেফার আয়' : 'Referral Coins'}
              </div>
              <div className="text-xl font-extrabold text-amber-300 mt-0.5">
                +{user.referralEarnings.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-indigo-500/30 text-center">
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            {language === 'bn' ? 'আপনার ইউনিক রেফার কোড:' : 'Your Unique Referral Code:'}
          </span>
          <div className="flex items-center justify-center gap-3">
            <div className="px-6 py-3 rounded-xl bg-slate-900 border-2 border-dashed border-indigo-500/60 font-mono text-2xl font-black text-indigo-300 tracking-widest shadow-inner">
              {user.referralCode}
            </div>
            <button
              onClick={handleCopy}
              className="py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied!') : (language === 'bn' ? 'কপি কোড' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2.5">
            {language === 'bn' ? 'সরাসরি বন্ধুদের সাথে শেয়ার করুন:' : 'Share Directly with Friends:'}
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => handleShare('whatsapp')}
              className="py-3 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => handleShare('telegram')}
              className="py-3 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Telegram</span>
            </button>

            <button
              onClick={() => handleShare('native')}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-300" />
              <span>{language === 'bn' ? 'অন্যান্য' : 'More'}</span>
            </button>
          </div>
        </div>

        {/* 3 Step Instruction */}
        <div className="border-t border-slate-800 pt-5">
          <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">
            {language === 'bn' ? 'কীভাবে রেফারেল কমিশন কাজ করে?' : 'How Referral Bonus Works'}
          </h4>
          <div className="space-y-3">
            {[
              {
                step: '1',
                titleBn: 'রেফার কোড বন্ধুদের পাঠান',
                titleEn: 'Share your code or link with friends',
                descBn: 'তারা জয়েন করার সময় আপনার কোড প্রদান করবে।',
                descEn: 'They enter your referral code when joining.',
              },
              {
                step: '2',
                titleBn: 'ইনস্ট্যান্ট ২০০ কয়েন পান',
                titleEn: 'Receive instant 200 Coins',
                descBn: 'বন্ধু সফলভাবে সাইন আপ করলে আপনার একাউন্টে কয়েন যোগ হবে।',
                descEn: 'Both you and your friend receive starting welcome coins.',
              },
              {
                step: '3',
                titleBn: 'আজীবন ১০% কমিশন উপভোগ করুন',
                titleEn: 'Earn 10% Lifetime Task Commission',
                descBn: 'আপনার রেফার করা ব্যক্তি যত টাস্ক সম্পন্ন করবে তার ১০% কমিশন আপনি পাবেন!',
                descEn: 'Whenever they complete tasks or quizzes, you automatically earn 10% commission!',
              },
            ].map((st) => (
              <div key={st.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0 mt-0.5">
                  {st.step}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {language === 'bn' ? st.titleBn : st.titleEn}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {language === 'bn' ? st.descBn : st.descEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
