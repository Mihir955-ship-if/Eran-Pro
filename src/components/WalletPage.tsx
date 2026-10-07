import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import {
  Wallet,
  Coins,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Send,
  HelpCircle,
  ExternalLink,
  History,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

export const WalletPage: React.FC = () => {
  const { user, settings, withdrawals, language, submitWithdrawal } = useApp();
  const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bkash');
  const [accountType, setAccountType] = useState<'personal' | 'agent'>('personal');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedAmountBdt, setSelectedAmountBdt] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [rechargeOperator, setRechargeOperator] = useState('Grameenphone');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) return null;

  const userWithdrawals = withdrawals.filter((w) => w.userId === user.id);
  const effectiveAmount = customAmount ? Math.max(0, parseInt(customAmount) || 0) : selectedAmountBdt;
  const requiredCoins = effectiveAmount * settings.coinsPerBdt;
  const hasEnoughCoins = user.coins >= requiredCoins && effectiveAmount >= settings.minWithdrawBdt;

  const presetAmounts = [50, 100, 200, 500, 1000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (effectiveAmount < settings.minWithdrawBdt) {
      setErrorMsg(
        language === 'bn'
          ? `সর্বনিম্ন উত্তোলনের পরিমাণ ৳${settings.minWithdrawBdt}`
          : `Minimum withdrawal is ৳${settings.minWithdrawBdt}`
      );
      sounds.playError();
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে একাউন্ট নম্বর দিন' : 'Please enter your account number');
      sounds.playError();
      return;
    }

    if (selectedMethod !== 'binance' && !/^[0-9+]{11,14}$/.test(accountNumber.trim())) {
      setErrorMsg(
        language === 'bn'
          ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)'
          : 'Please provide a valid 11-digit mobile number'
      );
      sounds.playError();
      return;
    }

    if (user.coins < requiredCoins) {
      setErrorMsg(
        language === 'bn'
          ? `আপনার ব্যালেন্সে পর্যাপ্ত কয়েন নেই! প্রয়োজন ${requiredCoins.toLocaleString()} কয়েন`
          : `Insufficient coin balance! Required ${requiredCoins.toLocaleString()} coins`
      );
      sounds.playError();
      return;
    }

    const res = submitWithdrawal(
      selectedMethod,
      `${accountNumber.trim()} (${accountType === 'personal' ? 'Personal' : 'Agent'})`,
      effectiveAmount,
      selectedMethod === 'recharge' ? rechargeOperator : undefined
    );

    if (res.success) {
      sounds.playWin();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      setSuccessMsg(
        language === 'bn'
          ? `৳${effectiveAmount} উত্তোলনের আবেদন সফলভাবে গৃহীত হয়েছে! ১-৩ ঘণ্টার মধ্যে পেমেন্ট পাবেন।`
          : `Withdrawal request for ৳${effectiveAmount} submitted successfully!`
      );
      setAccountNumber('');
      setCustomAmount('');
      setActiveTab('history');
    } else {
      sounds.playError();
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Wallet className="w-6 h-6" />
            </span>
            <span>{language === 'bn' ? 'টাকা উত্তোলন (Withdraw)' : 'Cashout & Wallet'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'বিকাশ (bKash) ও নগদ (Nagad) এর মাধ্যমে সরাসরি আপনার মোবাইলে টাকা নিন'
              : 'Fast & secure payouts directly to bKash, Nagad, Rocket & Mobile Recharge'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`py-2 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'withdraw'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{language === 'bn' ? 'উত্তোলন করুন' : 'Withdraw Now'}</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{language === 'bn' ? 'উত্তোলন হিস্ট্রি' : 'History'} ({userWithdrawals.length})</span>
          </button>
        </div>
      </div>

      {/* Balance Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
          <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? 'বর্তমান ব্যালেন্স' : 'Current Balance'}</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {user.coins.toLocaleString()}{' '}
            <span className="text-xs text-slate-400 font-normal">কয়েন</span>
          </div>
          <div className="text-xs text-emerald-400 font-bold mt-1">
            = {(user.coins / settings.coinsPerBdt).toFixed(2)} ৳ BDT
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>{language === 'bn' ? 'সর্বনিম্ন উত্তোলন' : 'Min Cashout'}</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            ৳{settings.minWithdrawBdt}{' '}
            <span className="text-xs text-slate-400 font-normal">
              ({(settings.minWithdrawBdt * settings.coinsPerBdt).toLocaleString()} কয়েন)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {language === 'bn' ? 'রেট: ১০০ কয়েন = ১ টাকা' : 'Rate: 100 Coins = 1 BDT'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'পেমেন্ট সময়কাল' : 'Processing Time'}</span>
          </div>
          <div className="text-base font-bold text-emerald-400">
            {language === 'bn' ? '১ থেকে ৩ ঘণ্টার মধ্যে' : 'Within 1 - 3 Hours'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {language === 'bn' ? 'সরাসরি বিকাশ ও নগদে' : 'Instant mobile transfer'}
          </div>
        </div>
      </div>

      {activeTab === 'withdraw' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Withdrawal Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* bKash & Nagad Primary Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2.5">
                  {language === 'bn' ? '১. পেমেন্ট মেথড নির্বাচন করুন (Select Method)' : '1. Choose Payment Method'}
                </label>
                
                {/* Big bKash & Nagad Highlights */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* bKash Option */}
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMethod('bkash');
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center relative overflow-hidden group ${
                      selectedMethod === 'bkash'
                        ? 'border-[#e2136e] bg-[#e2136e]/15 shadow-lg shadow-[#e2136e]/20 scale-[1.02]'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#e2136e] text-white flex items-center justify-center font-black text-lg shadow-md mb-2 group-hover:scale-105 transition-transform">
                      বিকাশ
                    </div>
                    <span className="font-extrabold text-white text-sm">bKash (বিকাশ)</span>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                      {language === 'bn' ? 'ইনস্ট্যান্ট পেমেন্ট' : 'Instant Payout'}
                    </span>
                    {selectedMethod === 'bkash' && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#e2136e] ring-4 ring-[#e2136e]/20" />
                    )}
                  </button>

                  {/* Nagad Option */}
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMethod('nagad');
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center relative overflow-hidden group ${
                      selectedMethod === 'nagad'
                        ? 'border-[#f7941d] bg-[#f7941d]/15 shadow-lg shadow-[#f7941d]/20 scale-[1.02]'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f7941d] to-[#ea1d24] text-white flex items-center justify-center font-black text-lg shadow-md mb-2 group-hover:scale-105 transition-transform">
                      নগদ
                    </div>
                    <span className="font-extrabold text-white text-sm">Nagad (নগদ)</span>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                      {language === 'bn' ? 'ইনস্ট্যান্ট পেমেন্ট' : 'Instant Payout'}
                    </span>
                    {selectedMethod === 'nagad' && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#f7941d] ring-4 ring-[#f7941d]/20" />
                    )}
                  </button>
                </div>

                {/* Secondary Methods: Rocket & Recharge */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMethod('rocket');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedMethod === 'rocket'
                        ? 'bg-purple-950/40 border-purple-500 text-purple-300 ring-1 ring-purple-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Rocket (রকেট)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMethod('recharge');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedMethod === 'recharge'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Recharge (রিচার্জ)</span>
                  </button>
                </div>
              </div>

              {/* If Mobile Recharge: Select Operator */}
              {selectedMethod === 'recharge' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'bn' ? 'মোবাইল অপারেটর নির্বাচন করুন' : 'Select Mobile Operator'}
                  </label>
                  <select
                    value={rechargeOperator}
                    onChange={(e) => setRechargeOperator(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Grameenphone">Grameenphone (জিপি)</option>
                    <option value="Banglalink">Banglalink (বাংলালিংক)</option>
                    <option value="Robi">Robi (রবি)</option>
                    <option value="Airtel">Airtel (এয়ারটেল)</option>
                    <option value="Teletalk">Teletalk (টেলিটক)</option>
                  </select>
                </div>
              )}

              {/* Account Type: Personal or Agent */}
              {(selectedMethod === 'bkash' || selectedMethod === 'nagad' || selectedMethod === 'rocket') && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'bn' ? 'অ্যাকাউন্টের ধরন (Account Type)' : 'Account Type'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('personal')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        accountType === 'personal'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {language === 'bn' ? 'পার্সোনাল (Personal)' : 'Personal'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('agent')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        accountType === 'agent'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {language === 'bn' ? 'এজেন্ট (Agent)' : 'Agent'}
                    </button>
                  </div>
                </div>
              )}

              {/* Payout Amount Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-200">
                    {language === 'bn' ? '২. উত্তোলনের পরিমাণ (৳ BDT)' : '2. Select Payout Amount (৳)'}
                  </label>
                  <span className="text-[11px] text-amber-400 font-semibold">
                    {language === 'bn' ? 'প্রয়োজন:' : 'Required:'} {requiredCoins.toLocaleString()} কয়েন
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-2.5">
                  {presetAmounts.map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedAmountBdt(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2.5 px-1 rounded-xl border text-center text-xs font-black transition-all ${
                        selectedAmountBdt === amt && !customAmount
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md border-emerald-400 scale-105'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Field */}
                <div className="relative">
                  <input
                    type="number"
                    min={settings.minWithdrawBdt}
                    step={10}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={
                      language === 'bn'
                        ? 'অথবা অন্য কোনো পরিমাণ লিখুন (যেমন: ১৫০, ৩০০)...'
                        : 'Or type custom amount (e.g. 150, 300)...'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-bold">
                    ৳ BDT
                  </span>
                </div>
              </div>

              {/* Account Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  {language === 'bn'
                    ? `৩. ${selectedMethod === 'bkash' ? 'বিকাশ' : selectedMethod === 'nagad' ? 'নগদ' : selectedMethod.toUpperCase()} একাউন্ট নম্বর দিন`
                    : `3. Enter ${selectedMethod.toUpperCase()} Account Number`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono tracking-wider font-bold"
                  />
                  <Smartphone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {language === 'bn'
                    ? 'আপনার সঠিক ১১ ডিজিটের নম্বর দিন। ভুল নম্বরে টাকা গেলে কর্তৃপক্ষ দায়ী নয়।'
                    : 'Ensure your 11-digit mobile number is correct.'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!hasEnoughCoins}
                className={`w-full py-4 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  hasEnoughCoins
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 hover:scale-[1.01] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                }`}
              >
                <ArrowUpRight className="w-5 h-5" />
                <span>
                  {hasEnoughCoins
                    ? language === 'bn'
                      ? `${selectedMethod === 'bkash' ? 'বিকাশে' : selectedMethod === 'nagad' ? 'নগদে' : selectedMethod.toUpperCase()} ৳${effectiveAmount} উত্তোলন কনফার্ম করুন`
                      : `Confirm ৳${effectiveAmount} Withdrawal to ${selectedMethod.toUpperCase()}`
                    : language === 'bn'
                    ? `পর্যাপ্ত কয়েন নেই (${user.coins.toLocaleString()} / ${requiredCoins.toLocaleString()})`
                    : `Insufficient Coins (${user.coins.toLocaleString()} / ${requiredCoins.toLocaleString()})`}
                </span>
              </button>
            </form>
          </div>

          {/* Right Column: Bangladeshi Withdrawal Instructions & Support */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'টাকা উত্তোলনের নিয়মাবলী' : 'Withdrawal Guidelines'}</span>
              </h3>

              <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    ১
                  </span>
                  <span>
                    <strong>বিকাশ ও নগদ:</strong> সর্বনিম্ন উত্তোলন ৳{settings.minWithdrawBdt} (৫,০০০ কয়েন)।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    ২
                  </span>
                  <span>
                    <strong>পেমেন্ট সময়:</strong> আবেদনের ১ থেকে ৩ ঘণ্টার মধ্যে সরাসরি আপনার নম্বরে টাকা পৌঁছে যায়।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    ৩
                  </span>
                  <span>
                    <strong>সঠিক নম্বর:</strong> অনুরোধ জমা দেওয়ার আগে আপনার ১১ ডিজিটের নম্বরটি ভালোভাবে দেখে নিন।
                  </span>
                </li>
              </ul>

              {/* Official Telegram Channel Link */}
              <div className="pt-3 border-t border-slate-800">
                <a
                  href="https://t.me/eranbdincome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 hover:border-sky-400 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="w-4 h-4 text-sky-400 -rotate-12" />
                    <div>
                      <span className="block text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                        পেমেন্ট প্রুফ ও টেলিগ্রাম সাপোর্ট
                      </span>
                      <span className="text-[10px] text-sky-400">@eranbdincome</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Withdrawal History Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="font-extrabold text-white text-base mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>{language === 'bn' ? 'আপনার সকল উত্তোলন হিস্ট্রি' : 'Withdrawal Transactions'}</span>
          </h3>

          {userWithdrawals.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Wallet className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">
                {language === 'bn' ? 'এখনও কোনো উত্তোলনের আবেদন করেননি' : 'No withdrawal records found'}
              </p>
              <button
                onClick={() => setActiveTab('withdraw')}
                className="mt-3 text-xs text-emerald-400 font-bold hover:underline"
              >
                {language === 'bn' ? 'এখনই টাকা উত্তোলন করুন →' : 'Withdraw now →'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userWithdrawals.map((w) => {
                const isApproved = w.status === 'approved';
                const isPending = w.status === 'pending';
                const isRejected = w.status === 'rejected';

                return (
                  <div
                    key={w.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between flex-wrap gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          w.method === 'bkash'
                            ? 'bg-[#e2136e]/20 text-[#e2136e] border border-[#e2136e]/30'
                            : w.method === 'nagad'
                            ? 'bg-[#f7941d]/20 text-[#f7941d] border border-[#f7941d]/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {w.method.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">
                          ৳{w.amountBdt} BDT
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {w.accountNumber} · {new Date(w.requestedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          isApproved
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isPending
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isPending && <Clock className="w-3.5 h-3.5 animate-spin" />}
                        {isRejected && <XCircle className="w-3.5 h-3.5" />}
                        <span>
                          {isApproved
                            ? (language === 'bn' ? 'সফল (Paid)' : 'Approved')
                            : isPending
                            ? (language === 'bn' ? 'অপেক্ষমাণ (Pending)' : 'Pending')
                            : (language === 'bn' ? 'বাতিল (Rejected)' : 'Rejected')}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
