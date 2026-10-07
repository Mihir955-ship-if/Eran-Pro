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
  X,
  CreditCard,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { user, settings, withdrawals, language, submitWithdrawal } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'withdraw' | 'history'>('withdraw');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedAmountBdt, setSelectedAmountBdt] = useState<number>(50);
  const [rechargeOperator, setRechargeOperator] = useState('Grameenphone');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !user) return null;

  const userWithdrawals = withdrawals.filter((w) => w.userId === user.id);
  const requiredCoins = selectedAmountBdt * settings.coinsPerBdt;
  const hasEnoughCoins = user.coins >= requiredCoins;

  const paymentOptions: { id: PaymentMethod; name: string; iconBg: string; min: number }[] = [
    { id: 'bkash', name: 'bKash (বিকাশ)', iconBg: 'bg-pink-600', min: 50 },
    { id: 'nagad', name: 'Nagad (নগদ)', iconBg: 'bg-orange-600', min: 50 },
    { id: 'rocket', name: 'Rocket (রকেট)', iconBg: 'bg-purple-600', min: 100 },
    { id: 'recharge', name: 'Mobile Recharge (রিচার্জ)', iconBg: 'bg-emerald-600', min: 50 },
    { id: 'binance', name: 'Binance USDT (ক্রিপ্টো)', iconBg: 'bg-amber-600', min: 200 },
  ];

  const presetAmounts = [50, 100, 200, 500, 1000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!accountNumber.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে অ্যাকাউন্ট নম্বর দিন' : 'Please enter your account number');
      sounds.playError();
      return;
    }

    if (selectedMethod !== 'binance' && !/^[0-9+]{10,14}$/.test(accountNumber.trim())) {
      setErrorMsg(language === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন' : 'Please provide a valid 11-digit mobile number');
      sounds.playError();
      return;
    }

    const res = submitWithdrawal(
      selectedMethod,
      accountNumber.trim(),
      selectedAmountBdt,
      selectedMethod === 'recharge' ? rechargeOperator : undefined
    );

    if (res.success) {
      setSuccessMsg(res.message);
      setAccountNumber('');
      setActiveSubTab('history');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base leading-tight">
                {language === 'bn' ? 'টাকা উত্তোলন ও ওয়ালেট' : 'Cashout & Wallet'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn' ? 'সরাসরি বিকাশ, নগদ ও রকেটে টাকা নিন' : 'Direct payouts to mobile wallets'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Bar & Subtabs */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <div className="text-xs text-slate-400">
                {language === 'bn' ? 'বর্তমান ব্যালেন্স:' : 'Available Balance:'}
              </div>
              <div className="text-base font-extrabold text-amber-300">
                {user.coins.toLocaleString()}{' '}
                <span className="text-xs font-normal text-amber-400/80">
                  ({(user.coins / settings.coinsPerBdt).toFixed(2)} ৳)
                </span>
              </div>
            </div>
          </div>

          {/* Subtab Segmented Control */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('withdraw')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'withdraw'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? 'উত্তোলন করুন' : 'Withdraw'}
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'history'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? 'উত্তোলন হিস্ট্রি' : 'History'} ({userWithdrawals.length})
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeSubTab === 'withdraw' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Method'}
                </label>
                
                {/* bKash & Nagad Primary Highlights */}
                <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('bkash');
                      sounds.playClick();
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-3 relative ${
                      selectedMethod === 'bkash'
                        ? 'border-[#e2136e] bg-[#e2136e]/15 ring-2 ring-[#e2136e]/30'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#e2136e] text-white flex items-center justify-center font-black text-sm shrink-0">
                      বিকাশ
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white">bKash (বিকাশ)</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">ইনস্ট্যান্ট পেমেন্ট</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('nagad');
                      sounds.playClick();
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-3 relative ${
                      selectedMethod === 'nagad'
                        ? 'border-[#f7941d] bg-[#f7941d]/15 ring-2 ring-[#f7941d]/30'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f7941d] to-[#ea1d24] text-white flex items-center justify-center font-black text-sm shrink-0">
                      নগদ
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white">Nagad (নগদ)</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">ইনস্ট্যান্ট পেমেন্ট</div>
                    </div>
                  </button>
                </div>

                {/* Secondary Methods: Rocket & Mobile Recharge */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('rocket');
                      sounds.playClick();
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
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
                      setSelectedMethod('recharge');
                      sounds.playClick();
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {language === 'bn' ? 'মোবাইল অপারেটর' : 'Mobile Operator'}
                  </label>
                  <select
                    value={rechargeOperator}
                    onChange={(e) => setRechargeOperator(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Grameenphone">Grameenphone (জিপি)</option>
                    <option value="Banglalink">Banglalink (বাংলালিংক)</option>
                    <option value="Robi">Robi (রবি)</option>
                    <option value="Airtel">Airtel (এয়ারটেল)</option>
                    <option value="Teletalk">Teletalk (টেলিটক)</option>
                  </select>
                </div>
              )}

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {language === 'bn' ? 'টাকার পরিমাণ (৳)' : 'Select Payout Amount (৳)'}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {presetAmounts.map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => {
                        setSelectedAmountBdt(amt);
                        sounds.playClick();
                      }}
                      className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition-all ${
                        selectedAmountBdt === amt
                          ? 'bg-emerald-500 text-slate-950 shadow-md border-emerald-400'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>
                    {language === 'bn' ? 'প্রয়োজনীয় কয়েন:' : 'Coins required:'}{' '}
                    <strong className="text-amber-400">{requiredCoins.toLocaleString()}</strong>
                  </span>
                  <span>
                    {language === 'bn' ? 'রেট: ১০০ কয়েন = ১ টাকা' : 'Rate: 100 Coins = 1 BDT'}
                  </span>
                </div>
              </div>

              {/* Account Number Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {selectedMethod === 'binance'
                    ? language === 'bn'
                      ? 'বাইনান্স পে আইডি / USDT BEP-20 অ্যাড্রেস'
                      : 'Binance Pay ID / USDT BEP-20'
                    : language === 'bn'
                    ? `${selectedMethod.toUpperCase()} একাউন্ট নম্বর (১১ ডিজিট)`
                    : `${selectedMethod.toUpperCase()} Account Number (11 Digits)`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={
                      selectedMethod === 'binance'
                        ? 'e.g. 192847291 or 0x...'
                        : '01XXXXXXXXX'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <Smartphone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!hasEnoughCoins}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  hasEnoughCoins
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.01]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>
                  {hasEnoughCoins
                    ? language === 'bn'
                      ? `৳${selectedAmountBdt} উত্তোলনের আবেদন জমা দিন`
                      : `Submit ৳${selectedAmountBdt} Withdrawal`
                    : language === 'bn'
                    ? 'পর্যাপ্ত কয়েন ব্যালেন্স নেই'
                    : 'Insufficient Coins'}
                </span>
              </button>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'bn' ? 'পেমেন্ট নিশ্চয়তা নোটিশ:' : 'Payout Guarantee:'}</span>
                </div>
                <p>
                  {language === 'bn'
                    ? '• উত্তোলনের আবেদন করার ১ থেকে ২৪ ঘণ্টার মধ্যে পেমেন্ট সফলভাবে পাঠানো হয়।'
                    : '• Withdrawals are processed safely within 1-24 hours.'}
                </p>
                <p>
                  {language === 'bn'
                    ? '• ভুল নাম্বারে আবেদন করলে অ্যাডমিন বাতিল করে কয়েন ফেরত দিয়ে দেবে।'
                    : '• If incorrect number is submitted, admin will reject & refund coins.'}
                </p>
              </div>
            </form>
          ) : (
            /* History Subtab */
            <div className="space-y-3">
              {userWithdrawals.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                  <p className="text-xs font-semibold">
                    {language === 'bn' ? 'কোনো পূর্ববর্তী উত্তোলনের রেকর্ড নেই' : 'No withdrawal records yet'}
                  </p>
                </div>
              ) : (
                userWithdrawals.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-sm uppercase">
                          {item.method}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {item.accountNumber}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        ৳{item.amountBdt}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
                      <span>{item.requestedAt}</span>
                      <div>
                        {item.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'সফল (পেইড)' : 'Paid'}</span>
                          </span>
                        ) : item.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'বাতিল' : 'Rejected'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'অপেক্ষমান' : 'Pending'}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {item.transactionId && (
                      <div className="text-[10px] text-emerald-300 font-mono bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/20">
                        TrxID: {item.transactionId}
                      </div>
                    )}
                    {item.rejectionReason && (
                      <div className="text-[10px] text-rose-300 bg-rose-950/40 p-1.5 rounded-lg border border-rose-500/20">
                        {language === 'bn' ? 'কারণ: ' : 'Reason: '} {item.rejectionReason}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
