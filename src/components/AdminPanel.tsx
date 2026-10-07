import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskItem, TaskCategory, PaymentMethod } from '../types';
import {
  ShieldAlert,
  Users,
  Wallet,
  CheckSquare,
  Settings,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Search,
  Database,
  ExternalLink,
  Code,
  DollarSign,
  AlertTriangle,
  X,
} from 'lucide-react';
import { sounds } from '../utils/sound';

export const AdminPanel: React.FC = () => {
  const {
    allUsers,
    settings,
    tasks,
    withdrawals,
    transactions,
    language,
    switchUserRole,
    approveWithdrawal,
    rejectWithdrawal,
    addNewTask,
    toggleTaskStatus,
    deleteTaskItem,
    updateAppSettings,
    toggleUserBanState,
    adjustUserBalance,
    resetAllData,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'withdrawals' | 'tasks' | 'users' | 'settings' | 'firebase'
  >('withdrawals');

  // Withdrawal filters & modal state
  const [withdrawFilter, setWithdrawFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedWithdrawalForApprove, setSelectedWithdrawalForApprove] = useState<string | null>(null);
  const [trxIdInput, setTrxIdInput] = useState('');
  const [selectedWithdrawalForReject, setSelectedWithdrawalForReject] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  // Task creation modal state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTitleBn, setNewTaskTitleBn] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('visit');
  const [newTaskReward, setNewTaskReward] = useState(100);
  const [newTaskTimer, setNewTaskTimer] = useState(20);
  const [newTaskUrl, setNewTaskUrl] = useState('https://google.com');

  // User search & adjust balance modal state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUserForCoins, setSelectedUserForCoins] = useState<string | null>(null);
  const [coinAdjustmentAmount, setCoinAdjustmentAmount] = useState<number>(500);
  const [adjustmentReason, setAdjustmentReason] = useState('অ্যাডমিন স্পেশাল বোনাস');

  // System settings state
  const [tempSettings, setTempSettings] = useState(settings);

  // Calculations
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');
  const totalApprovedAmountBdt = withdrawals
    .filter((w) => w.status === 'approved')
    .reduce((sum, w) => sum + w.amountBdt, 0);
  const totalCoinsInCirculation = allUsers.reduce((sum, u) => sum + u.coins, 0);

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (withdrawFilter === 'all') return true;
    return w.status === withdrawFilter;
  });

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.phone.includes(userSearchQuery) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleApproveSubmit = () => {
    if (!selectedWithdrawalForApprove) return;
    const autoTrx = trxIdInput.trim() || `BK${Math.floor(10000000 + Math.random() * 90000000)}X`;
    approveWithdrawal(selectedWithdrawalForApprove, autoTrx);
    setSelectedWithdrawalForApprove(null);
    setTrxIdInput('');
  };

  const handleRejectSubmit = () => {
    if (!selectedWithdrawalForReject) return;
    const reason = rejectReasonInput.trim() || 'ভুল একাউন্ট নম্বর অথবা নিয়মবহির্ভূত কার্যকলাপ';
    rejectWithdrawal(selectedWithdrawalForReject, reason);
    setSelectedWithdrawalForReject(null);
    setRejectReasonInput('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addNewTask({
      title: newTaskTitle,
      titleBn: newTaskTitleBn || newTaskTitle,
      description: newTaskDesc || 'Complete task to earn reward coins',
      descriptionBn: newTaskDesc || 'কয়েন জিততে টাস্কটি সম্পন্ন করুন',
      category: newTaskCategory,
      rewardCoins: Number(newTaskReward) || 100,
      timerSeconds: Number(newTaskTimer) || 20,
      url: newTaskUrl,
      isActive: true,
      iconName: 'Globe',
    });

    setShowAddTaskModal(false);
    setNewTaskTitle('');
    setNewTaskTitleBn('');
    setNewTaskDesc('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppSettings(tempSettings);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">
                {language === 'bn' ? 'অ্যাডমিন কন্ট্রোল সেন্টার' : 'Admin Control Center'}
              </h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                PRO ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn' ? 'উত্তোলন অনুমোদন, টাস্ক নিয়ন্ত্রণ ও ইউজার ব্যালেন্স পরিচালনা' : 'Manage withdrawals, task rewards, user balances and settings'}
            </p>
          </div>
        </div>

        <button
          onClick={() => switchUserRole('user')}
          className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <span>{language === 'bn' ? '← ইউজার অ্যাপে যান' : '← Exit to User App'}</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">
            {language === 'bn' ? 'অপেক্ষমান উত্তোলন' : 'Pending Requests'}
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1.5">
            <span>{pendingWithdrawals.length}</span>
            {pendingWithdrawals.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                Action Needed
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">
            {language === 'bn' ? 'মোট পেইড আউট' : 'Total Paid Out'}
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ৳{totalApprovedAmountBdt.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">
            {language === 'bn' ? 'মোট নিবন্ধিত ইউজার' : 'Total Users'}
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {allUsers.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">
            {language === 'bn' ? 'সক্রিয় টাস্ক' : 'Active Tasks'}
          </span>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {tasks.filter((t) => t.isActive).length}
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'withdrawals', labelBn: `উত্তোলন রিকোয়েস্ট (${pendingWithdrawals.length})`, labelEn: `Withdrawals (${pendingWithdrawals.length})`, icon: Wallet },
          { id: 'tasks', labelBn: 'টাস্ক নিয়ন্ত্রণ', labelEn: 'Task Management', icon: CheckSquare },
          { id: 'users', labelBn: 'ইউজার তালিকা', labelEn: 'Users & Balances', icon: Users },
          { id: 'settings', labelBn: 'অ্যাপ সেটিংস ও নোটিশ', labelEn: 'App Settings & Notice', icon: Settings },
          { id: 'firebase', labelBn: 'ফায়ারবেস কনফিগ', labelEn: 'Firebase Architecture', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveAdminTab(tab.id as any);
                sounds.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Withdrawals Management */}
      {activeAdminTab === 'withdrawals' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setWithdrawFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  withdrawFilter === st
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredWithdrawals.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
                <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-xs font-semibold">কোনো উত্তোলনের রেকর্ড নেই</p>
              </div>
            ) : (
              filteredWithdrawals.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-extrabold text-white">
                        ৳{req.amountBdt} BDT
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {req.method}
                      </span>
                      {req.operator && (
                        <span className="text-[11px] text-slate-400">
                          ({req.operator})
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300 mt-1 font-mono">
                      নাম্বার: <strong className="text-emerald-400">{req.accountNumber}</strong> · {req.userName}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>{req.requestedAt}</span>
                      <span>·</span>
                      <span>{req.coinsDeducted.toLocaleString()} কয়েন কাটা হয়েছে</span>
                    </div>

                    {req.transactionId && (
                      <div className="text-[10px] text-emerald-400 font-mono mt-1">
                        TrxID: {req.transactionId}
                      </div>
                    )}
                    {req.rejectionReason && (
                      <div className="text-[10px] text-rose-400 mt-1">
                        বাতিলের কারণ: {req.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => setSelectedWithdrawalForApprove(req.id)}
                          className="py-1.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                        >
                          Approve (অনুমোদন)
                        </button>
                        <button
                          onClick={() => setSelectedWithdrawalForReject(req.id)}
                          className="py-1.5 px-3.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors"
                        >
                          Reject (বাতিল)
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          req.status === 'approved'
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {req.status === 'approved' ? '✓ APPROVED' : '✗ REJECTED'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Task Management */}
      {activeAdminTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              সকল টাস্ক তালিকা ({tasks.length})
            </h3>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন টাস্ক যোগ করুন</span>
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">
                      {task.titleBn || task.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-800 text-cyan-400 border border-slate-700">
                      {task.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {task.rewardCoins} কয়েন · {task.timerSeconds} সেকেন্ড টাইমার
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                    {task.url}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      task.isActive
                        ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.isActive ? 'Active' : 'Disabled'}
                  </button>
                  <button
                    onClick={() => deleteTaskItem(task.id)}
                    className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Users Management */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="ইউজারের নাম, মোবাইল নম্বর বা ইমেইল দিয়ে খুঁজুন..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>

          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{u.name}</span>
                      {u.isBanned && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">
                          BANNED
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {u.phone} · {u.email}
                    </div>
                    <div className="text-xs text-amber-400 font-bold mt-0.5">
                      {u.coins.toLocaleString()} কয়েন (≈ ৳{(u.coins / settings.coinsPerBdt).toFixed(2)})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedUserForCoins(u.id)}
                    className="py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-colors"
                  >
                    কয়েন সমন্বয়
                  </button>
                  <button
                    onClick={() => toggleUserBanState(u.id)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                      u.isBanned
                        ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {u.isBanned ? 'Unban' : 'Ban User'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: App Configuration & Notice */}
      {activeAdminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base mb-2">
            অ্যাপের সাধারণ কনফিগারেশন
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                প্রতি ১ টাকার কয়েন হার (Coins per 1 BDT)
              </label>
              <input
                type="number"
                value={tempSettings.coinsPerBdt}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, coinsPerBdt: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                সর্বনিম্ন উত্তোলনের পরিমাণ (৳ BDT)
              </label>
              <input
                type="number"
                value={tempSettings.minWithdrawBdt}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, minWithdrawBdt: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                দৈনিক স্পিন লিমিট (Spins / day)
              </label>
              <input
                type="number"
                value={tempSettings.spinLimitDaily}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, spinLimitDaily: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                দৈনিক স্ক্র্যাচ কার্ড লিমিট (Cards / day)
              </label>
              <input
                type="number"
                value={tempSettings.scratchLimitDaily}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, scratchLimitDaily: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                রেফার বোনাস কয়েন (প্রতি সাইনআপ)
              </label>
              <input
                type="number"
                value={tempSettings.referralBonusCoins}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, referralBonusCoins: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                রেফার কমিশন পার্সেন্টেজ (%)
              </label>
              <input
                type="number"
                value={tempSettings.referralCommissionPercent}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, referralCommissionPercent: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              লাইভ নোটিশ বোর্ড (বাংলা)
            </label>
            <textarea
              rows={2}
              value={tempSettings.noticeTextBn}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, noticeTextBn: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              টেলিগ্রাম সাপোর্ট গ্রুপ লিঙ্ক
            </label>
            <input
              type="text"
              value={tempSettings.telegramSupportUrl}
              onChange={(e) =>
                setTempSettings({ ...tempSettings, telegramSupportUrl: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Google AdSense & Ads.txt Official Integration Status */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
                  <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
                  <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
                  <span className="w-2 h-2 rounded-full bg-[#34A853]" />
                </div>
                <h4 className="text-xs font-bold text-white">
                  গুগল অ্যাডসেন্স, অ্যাডমব ও ads.txt ভেরিফিকেশন স্ট্যাটাস
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Google AdMob App ID:</span>
                <span className="font-mono text-cyan-400 font-bold select-all break-all">ca-app-pub-7103808736101367~8427394089</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Publisher ID:</span>
                <span className="font-mono text-emerald-400 font-bold select-all break-all">pub-7103808736101367</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              হোম স্ক্রিনের শীর্ষে গুগল বিজ্ঞাপন এবং রুট ডিরেক্টরিতে অফিশিয়াল ads.txt ও app-ads.txt সংযুক্ত রয়েছে:
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300 select-all break-all">
              google.com, pub-7103808736101367, DIRECT, f08c47fec0942fa0
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
              <a
                href="/ads.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>/ads.txt ওপেন করুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">|</span>
              <a
                href="/app-ads.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>/app-ads.txt ওপেন করুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-mono">
                Publisher: pub-7103808736101367
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow"
            >
              সেটিংস সংরক্ষণ করুন
            </button>

            <button
              type="button"
              onClick={resetAllData}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ডেমো ডেটা রিসেট</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 5: Firebase Integration Architecture */}
      {activeAdminTab === 'firebase' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              Firebase Security Rules & Architecture
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The platform supports local persistence out-of-the-box and includes native schema blueprints for Firebase Firestore & Authentication matching the <code>eran-pro-firebase</code> template structure.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto space-y-1">
            <div className="text-slate-400">// firestore.rules configuration from eran-pro-firebase</div>
            <div>rules_version = '2';</div>
            <div>service cloud.firestore &#123;</div>
            <div className="pl-4">match /databases/&#123;database&#125;/documents &#123;</div>
            <div className="pl-8">match /users/&#123;userId&#125; &#123;</div>
            <div className="pl-12">allow read: if request.auth != null;</div>
            <div className="pl-12">allow write: if request.auth.uid == userId || request.auth.token.admin == true;</div>
            <div className="pl-8">&#125;</div>
            <div className="pl-8">match /withdrawals/&#123;withdrawId&#125; &#123;</div>
            <div className="pl-12">allow create: if request.auth != null;</div>
            <div className="pl-12">allow read, update: if request.auth != null;</div>
            <div className="pl-8">&#125;</div>
            <div className="pl-8">match /tasks/&#123;taskId&#125; &#123;</div>
            <div className="pl-12">allow read: if true;</div>
            <div className="pl-12">allow write: if request.auth.token.admin == true;</div>
            <div className="pl-8">&#125;</div>
            <div className="pl-4">&#125;</div>
            <div>&#125;</div>
          </div>
        </div>
      )}

      {/* Modal: Approve Withdrawal */}
      {selectedWithdrawalForApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <h4 className="font-bold text-white text-sm">
              উত্তোলন অনুমোদন (Approve Payout)
            </h4>
            <p className="text-xs text-slate-300">
              বিকাশ/নগদ থেকে টাকা পাঠানোর পর প্রাপ্ত TrxID প্রদান করুন:
            </p>
            <input
              type="text"
              placeholder="e.g. BK9810298A"
              value={trxIdInput}
              onChange={(e) => setTrxIdInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedWithdrawalForApprove(null)}
                className="py-1.5 px-3 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                বাতিল
              </button>
              <button
                onClick={handleApproveSubmit}
                className="py-1.5 px-4 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow"
              >
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reject Withdrawal */}
      {selectedWithdrawalForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <h4 className="font-bold text-white text-sm">
              উত্তোলন বাতিল (Reject Payout)
            </h4>
            <p className="text-xs text-slate-300">
              বাতিলের কারণ উল্লেখ করুন (কয়েন স্বয়ংক্রিয়ভাবে ইউজারের ব্যালেন্সে ফেরত যাবে):
            </p>
            <input
              type="text"
              placeholder="e.g. ভুল একাউন্ট নাম্বার"
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedWithdrawalForReject(null)}
                className="py-1.5 px-3 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                ফিরে যান
              </button>
              <button
                onClick={handleRejectSubmit}
                className="py-1.5 px-4 rounded-lg bg-rose-600 text-white font-bold text-xs shadow"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adjust User Balance */}
      {selectedUserForCoins && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <h4 className="font-bold text-white text-sm">ইউজার কয়েন ব্যালেন্স সমন্বয়</h4>
            <div>
              <label className="block text-xs text-slate-400 mb-1">কয়েনের পরিমাণ (যোগ/বিয়োগ)</label>
              <input
                type="number"
                value={coinAdjustmentAmount}
                onChange={(e) => setCoinAdjustmentAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">কারণ</label>
              <input
                type="text"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForCoins(null)}
                className="py-1.5 px-3 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  adjustUserBalance(selectedUserForCoins, coinAdjustmentAmount, adjustmentReason);
                  setSelectedUserForCoins(null);
                }}
                className="py-1.5 px-4 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Task */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">নতুন টাস্ক তৈরি করুন</h4>
              <button onClick={() => setShowAddTaskModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">টাস্ক শিরোনাম (English)</label>
                <input
                  required
                  type="text"
                  placeholder="Visit Website & Read Article"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">টাস্ক শিরোনাম (বাংলা)</label>
                <input
                  type="text"
                  placeholder="ওয়েবসাইট ভিজিট করুন ও আর্টিকেল পড়ুন"
                  value={newTaskTitleBn}
                  onChange={(e) => setNewTaskTitleBn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">রিওয়ার্ড কয়েন</label>
                  <input
                    type="number"
                    value={newTaskReward}
                    onChange={(e) => setNewTaskReward(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">টাইমার (সেকেন্ড)</label>
                  <input
                    type="number"
                    value={newTaskTimer}
                    onChange={(e) => setNewTaskTimer(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">ক্যাটাগরি</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="visit">Website Visit</option>
                  <option value="video">Video Watch</option>
                  <option value="social">Social Join</option>
                  <option value="survey">Survey Quiz</option>
                  <option value="app">App Install</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">টার্গেট লিঙ্ক (URL)</label>
                <input
                  type="url"
                  value={newTaskUrl}
                  onChange={(e) => setNewTaskUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="py-1.5 px-3 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  টাস্ক পাবলিশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
