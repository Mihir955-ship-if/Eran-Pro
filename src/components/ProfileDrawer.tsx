import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  X,
  Coins,
  Calendar,
  Phone,
  Mail,
  Shield,
  History,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  Send,
  Youtube,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWallet: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, onOpenWallet }) => {
  const { user, settings, transactions, language, resetAllData, switchUserRole, logoutUser } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');

  if (!isOpen || !user) return null;

  const userTransactions = transactions.filter((t) => t.userId === user.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'bn' ? 'লেনদেন হিস্ট্রি' : 'Transactions'} ({userTransactions.length})
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              {/* User Bio Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500/50"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-base leading-tight">
                      {user.name}
                    </h3>
                    {user.role === 'admin' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate max-w-[170px]">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Balance Summary Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">
                      {language === 'bn' ? 'বর্তমান ব্যালেন্স' : 'Current Balance'}
                    </span>
                    <div className="text-2xl font-black text-amber-400 mt-0.5">
                      {user.coins.toLocaleString()}{' '}
                      <span className="text-xs font-semibold">{language === 'bn' ? 'কয়েন' : 'Coins'}</span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      ≈ ৳{(user.coins / settings.coinsPerBdt).toFixed(2)} BDT
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWallet();
                    }}
                    className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-amber-500/20"
                  >
                    {language === 'bn' ? 'উত্তোলন করুন' : 'Withdraw'}
                  </button>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    {language === 'bn' ? 'সর্বমোট আয়' : 'Total Earned'}
                  </span>
                  <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                    {user.totalEarned.toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    {language === 'bn' ? 'আজকের আয়' : "Today's Earned"}
                  </span>
                  <div className="text-base font-extrabold text-cyan-400 mt-0.5">
                    {user.todayEarned.toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    {language === 'bn' ? 'রেফারেল আয়' : 'Referral Coins'}
                  </span>
                  <div className="text-base font-extrabold text-indigo-400 mt-0.5">
                    +{user.referralEarnings.toLocaleString()}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400">
                    {language === 'bn' ? 'যোগদানের তারিখ' : 'Member Since'}
                  </span>
                  <div className="text-xs font-bold text-slate-300 mt-1">
                    {user.joinedDate}
                  </div>
                </div>
              </div>

              {/* Official Support Channels */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                  {language === 'bn' ? 'সাহায্য ও যোগাযোগ' : 'Help & Support'}
                </span>

                {settings.telegramSupportUrl && (
                  <a
                    href="https://t.me/eranbdincome"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 text-xs font-semibold text-sky-400 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Send className="w-4 h-4 text-sky-400" />
                      <span>{language === 'bn' ? 'অফিসিয়াল টেলিগ্রাম চ্যানেল (@eranbdincome)' : 'Telegram Channel (@eranbdincome)'}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}

                {settings.whatsappSupportNumber && (
                  <a
                    href={`https://wa.me/${settings.whatsappSupportNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-emerald-400 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ হেল্পডেস্ক' : 'WhatsApp Helpdesk'}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}

                {settings.youtubeTutorialUrl && (
                  <a
                    href={settings.youtubeTutorialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-xs font-semibold text-rose-400 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Youtube className="w-4 h-4 text-rose-400" />
                      <span>{language === 'bn' ? 'কাজের ভিডিও টিউটোরিয়াল' : 'How-to-Work Video'}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}
              </div>

              {/* Reset Data for Testing */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={resetAllData}
                  className="py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'bn' ? 'ডেমো ডেটা রিসেট' : 'Reset Demo Data'}</span>
                </button>

                <button
                  onClick={() => switchUserRole(user.role === 'admin' ? 'user' : 'admin')}
                  className="py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3 h-3 text-rose-400" />
                  <span>
                    {user.role === 'admin'
                      ? (language === 'bn' ? 'সাধারণ ইউজার মোড' : 'Switch to Regular User')
                      : (language === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট' : 'Switch to Admin')}
                  </span>
                </button>
              </div>

              {/* App Info & Logo */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <img
                  src="/app-logo.png"
                  alt="Eran Pro"
                  className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-black text-white">Eran Pro Mobile v1.0.0</div>
                  <div className="text-[10px] text-slate-400">Work • Earn • Grow · 100% Genuine</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  onClose();
                  logoutUser();
                }}
                className="w-full py-3 px-4 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all mt-4"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>{language === 'bn' ? 'একাউন্ট থেকে লগআউট করুন' : 'Log Out from Account'}</span>
              </button>
            </div>
          ) : (
            /* Transactions History */
            <div className="space-y-2.5">
              {userTransactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <History className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                  <p className="text-xs font-semibold">
                    {language === 'bn' ? 'কোনো লেনদেন রেকর্ড নেই' : 'No transactions recorded'}
                  </p>
                </div>
              ) : (
                userTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{tx.details}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{tx.createdAt}</div>
                    </div>
                    <div
                      className={`text-xs font-black text-right shrink-0 ${
                        tx.amountCoins > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.amountCoins > 0 ? `+${tx.amountCoins}` : tx.amountCoins}{' '}
                      <span className="text-[10px] font-normal">{language === 'bn' ? 'কয়েন' : 'Coins'}</span>
                    </div>
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
