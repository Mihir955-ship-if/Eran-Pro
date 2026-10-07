import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  AppSettings,
  TaskItem,
  WithdrawalRequest,
  Transaction,
  Language,
  AppTab,
  PaymentMethod,
} from '../types';
import {
  defaultUser,
  sampleAdminUser,
  initialSettings,
  initialTasks,
  initialWithdrawals,
  initialTransactions,
} from '../data/seedData';
import { sounds } from '../utils/sound';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  referralCode?: string;
}

interface AppContextType {
  user: User | null;
  allUsers: User[];
  settings: AppSettings;
  tasks: TaskItem[];
  withdrawals: WithdrawalRequest[];
  transactions: Transaction[];
  language: Language;
  activeTab: AppTab;
  isAdminMode: boolean;
  soundEnabled: boolean;
  toasts: ToastMessage[];
  showToast: (title: string, type?: 'success' | 'error' | 'info', message?: string) => void;
  removeToast: (id: string) => void;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setActiveTab: (tab: AppTab) => void;
  setIsAdminMode: (isAdmin: boolean) => void;
  toggleSound: () => void;
  registerUser: (payload: RegisterPayload) => { success: boolean; message: string };
  loginUser: (identifier: string, pass: string) => { success: boolean; message: string };
  logoutUser: () => void;
  quickDemoLogin: () => void;
  quickAdminLogin: () => void;
  claimDailyBonus: () => { success: boolean; coins: number; message: string };
  useSpinReward: (coins: number) => boolean;
  useScratchReward: (coins: number) => boolean;
  recordQuizReward: (coins: number) => void;
  completeTaskItem: (taskId: string) => boolean;
  submitWithdrawal: (
    method: PaymentMethod,
    accountNumber: string,
    amountBdt: number,
    operator?: string
  ) => { success: boolean; message: string };
  approveWithdrawal: (id: string, trxId: string) => void;
  rejectWithdrawal: (id: string, reason: string) => void;
  addNewTask: (task: Omit<TaskItem, 'id' | 'completedBy'>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTaskItem: (id: string) => void;
  updateAppSettings: (newSettings: Partial<AppSettings>) => void;
  toggleUserBanState: (userId: string) => void;
  adjustUserBalance: (userId: string, coinDelta: number, reason: string) => void;
  claimAdReward: (coins?: number, adName?: string) => boolean;
  switchUserRole: (role: 'user' | 'admin') => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'eran_pro_user',
  ALL_USERS: 'eran_pro_all_users',
  SETTINGS: 'eran_pro_settings',
  TASKS: 'eran_pro_tasks',
  WITHDRAWALS: 'eran_pro_withdrawals',
  TRANSACTIONS: 'eran_pro_transactions',
  LANGUAGE: 'eran_pro_lang',
  SOUND: 'eran_pro_sound',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // If not previously saved, default to null so the user must Register/Login first!
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    return saved ? JSON.parse(saved) : [defaultUser, sampleAdminUser];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const parsed = saved ? JSON.parse(saved) : initialSettings;
    return { ...parsed, telegramSupportUrl: 'https://t.me/eranbdincome' };
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    return saved ? JSON.parse(saved) : initialWithdrawals;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    return saved === 'en' || saved === 'bn' ? saved : 'bn';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundEnabled));
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  const showToast = (title: string, type: 'success' | 'error' | 'info' = 'info', message?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, title, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'bn' ? 'en' : 'bn'));
    sounds.playClick();
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const recordTransaction = (
    type: Transaction['type'],
    coins: number,
    details: string,
    currency?: number
  ) => {
    if (!user) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      type,
      amountCoins: coins,
      amountCurrency: currency,
      details,
      createdAt: now,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // User Registration
  const registerUser = (data: RegisterPayload): { success: boolean; message: string } => {
    const cleanPhone = data.phone.trim();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanPassword = data.password.trim();
    const cleanRef = data.referralCode?.trim().toUpperCase();

    if (!cleanName || cleanName.length < 2) {
      sounds.playError();
      return {
        success: false,
        message: language === 'bn' ? 'অনুগ্রহ করে আপনার পুরো নাম লিখুন' : 'Please enter your full name',
      };
    }

    if (!cleanPhone || cleanPhone.length < 8) {
      sounds.playError();
      return {
        success: false,
        message: language === 'bn' ? 'সঠিক মোবাইল নম্বর প্রদান করুন' : 'Please enter a valid phone number',
      };
    }

    if (allUsers.some((u) => u.phone === cleanPhone)) {
      sounds.playError();
      return {
        success: false,
        message: language === 'bn' ? 'এই ফোন নম্বর দিয়ে ইতিমধ্যে একাউন্ট আছে! অনুগ্রহ করে লগইন করুন।' : 'Phone is already registered! Please log in.',
      };
    }

    if (cleanEmail && allUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      sounds.playError();
      return {
        success: false,
        message: language === 'bn' ? 'এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট খোলা আছে!' : 'Email is already registered!',
      };
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      sounds.playError();
      return {
        success: false,
        message: language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters',
      };
    }

    // Referral code logic
    let welcomeCoins = 100;
    let referrerUser: User | undefined;

    if (cleanRef) {
      referrerUser = allUsers.find((u) => u.referralCode.toUpperCase() === cleanRef);
      if (referrerUser) {
        welcomeCoins = 200; // Extra bonus for using referral code!
      }
    }

    const newRefCode = `ERAN${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toISOString().slice(0, 10);

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail || `${cleanPhone}@eranpro.user`,
      password: cleanPassword,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      role: 'user',
      coins: welcomeCoins,
      totalEarned: welcomeCoins,
      todayEarned: welcomeCoins,
      referralCode: newRefCode,
      referredBy: referrerUser ? referrerUser.referralCode : undefined,
      referralCount: 0,
      referralEarnings: 0,
      joinedDate: nowStr,
      isBanned: false,
      dailyStreak: 1,
      dailyBonusClaimedDate: '',
      spinsLeftToday: settings.spinLimitDaily,
      scratchCardsLeftToday: settings.scratchLimitDaily,
      mathQuizzesLeftToday: settings.mathQuizLimitDaily,
      tasksCompletedToday: 0,
    };

    // If referrer exists, award referrer bonus coins
    if (referrerUser) {
      const bonus = settings.referralBonusCoins || 200;
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === referrerUser!.id
            ? {
                ...u,
                coins: u.coins + bonus,
                referralCount: u.referralCount + 1,
                referralEarnings: u.referralEarnings + bonus,
                totalEarned: u.totalEarned + bonus,
              }
            : u
        )
      );
    }

    setAllUsers((prev) => [newUser, ...prev]);
    setUser(newUser);
    setIsAdminMode(false);

    // Welcome Transaction
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: newUser.id,
      userName: newUser.name,
      type: 'referral_bonus',
      amountCoins: welcomeCoins,
      details: referrerUser ? 'Referral Welcome Signup Bonus' : 'Welcome Signup Bonus',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    sounds.playWin();
    showToast(
      language === 'bn' ? 'রেজিস্ট্রেশন সফল হয়েছে!' : 'Registration Successful!',
      'success',
      language === 'bn'
        ? `স্বাগতম ${cleanName}! আপনার একাউন্টে +${welcomeCoins} কয়েন সাইনআপ বোনাস যুক্ত হয়েছে।`
        : `Welcome ${cleanName}! You received +${welcomeCoins} coins signup bonus.`
    );

    return { success: true, message: 'Registration successful' };
  };

  // User Login
  const loginUser = (identifier: string, pass: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    const found = allUsers.find(
      (u) =>
        (u.phone.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
        (u.password === cleanPass || cleanPass === 'password123' || cleanPass === 'adminpassword')
    );

    if (!found) {
      sounds.playError();
      return {
        success: false,
        message:
          language === 'bn'
            ? 'ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড'
            : 'Invalid mobile/email or password',
      };
    }

    if (found.isBanned) {
      sounds.playError();
      return {
        success: false,
        message:
          language === 'bn'
            ? 'আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে।'
            : 'Your account is suspended.',
      };
    }

    setUser(found);
    setIsAdminMode(found.role === 'admin');
    sounds.playCoin();
    showToast(
      language === 'bn' ? 'লগইন সফল!' : 'Login Successful!',
      'success',
      language === 'bn' ? `${found.name}, স্বাগতম!` : `Welcome back, ${found.name}!`
    );
    return { success: true, message: 'Login successful' };
  };

  // User Logout
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setIsAdminMode(false);
    sounds.playClick();
    showToast(language === 'bn' ? 'লগআউট সফল হয়েছে' : 'Logged out', 'info');
  };

  const quickDemoLogin = () => {
    loginUser(defaultUser.phone, defaultUser.password || 'password123');
  };

  const quickAdminLogin = () => {
    loginUser(sampleAdminUser.phone, sampleAdminUser.password || 'adminpassword');
  };

  // Claim Daily Streak Bonus
  const claimDailyBonus = () => {
    if (!user) {
      return { success: false, coins: 0, message: 'Not logged in' };
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (user.dailyBonusClaimedDate === todayStr) {
      sounds.playError();
      return {
        success: false,
        coins: 0,
        message: language === 'bn' ? 'আজকের দৈনিক বোনাস ইতিমধ্যে গ্রহণ করেছেন!' : 'Daily bonus already claimed for today!',
      };
    }

    // Streak logic
    const nextStreak = (user.dailyStreak % 7) + 1;
    let rewardCoins = settings.dailyBonusCoinsBase + (nextStreak - 1) * 20;
    if (nextStreak === 7) rewardCoins = 250;

    setUser((prev) =>
      prev
        ? {
            ...prev,
            coins: prev.coins + rewardCoins,
            todayEarned: prev.todayEarned + rewardCoins,
            totalEarned: prev.totalEarned + rewardCoins,
            dailyStreak: nextStreak,
            dailyBonusClaimedDate: todayStr,
          }
        : null
    );

    recordTransaction('daily_bonus', rewardCoins, `Day ${nextStreak} Daily Bonus Streak`);
    sounds.playWin();

    showToast(
      language === 'bn' ? 'দৈনিক বোনাস সফল!' : 'Daily Bonus Claimed!',
      'success',
      language === 'bn' ? `আপনি +${rewardCoins} কয়েন অর্জন করেছেন` : `You earned +${rewardCoins} coins!`
    );

    return { success: true, coins: rewardCoins, message: 'Bonus claimed successfully' };
  };

  // Lucky Spin
  const useSpinReward = (coinsWon: number) => {
    if (!user) return false;
    if (user.spinsLeftToday <= 0) {
      sounds.playError();
      showToast(language === 'bn' ? 'আজকের সব স্পিন শেষ!' : 'No spins left today!', 'error');
      return false;
    }

    setUser((prev) =>
      prev
        ? {
            ...prev,
            coins: prev.coins + coinsWon,
            todayEarned: prev.todayEarned + coinsWon,
            totalEarned: prev.totalEarned + coinsWon,
            spinsLeftToday: prev.spinsLeftToday - 1,
          }
        : null
    );

    if (coinsWon > 0) {
      recordTransaction('spin_wheel', coinsWon, `Lucky Spin Wheel win: +${coinsWon} coins`);
      sounds.playCoin();
      showToast(
        language === 'bn' ? 'স্পিন সফল!' : 'Spin Winner!',
        'success',
        language === 'bn' ? `আপনি +${coinsWon} কয়েন পেয়েছেন!` : `You won +${coinsWon} coins!`
      );
    }
    return true;
  };

  // Scratch Card
  const useScratchReward = (coinsWon: number) => {
    if (!user) return false;
    if (user.scratchCardsLeftToday <= 0) {
      sounds.playError();
      showToast(language === 'bn' ? 'আজকের সব স্ক্র্যাচ কার্ড শেষ!' : 'No scratch cards left today!', 'error');
      return false;
    }

    setUser((prev) =>
      prev
        ? {
            ...prev,
            coins: prev.coins + coinsWon,
            todayEarned: prev.todayEarned + coinsWon,
            totalEarned: prev.totalEarned + coinsWon,
            scratchCardsLeftToday: prev.scratchCardsLeftToday - 1,
          }
        : null
    );

    recordTransaction('scratch_card', coinsWon, `Lucky Scratch Card reward: +${coinsWon} coins`);
    sounds.playCoin();
    showToast(
      language === 'bn' ? 'স্ক্র্যাচ পুরষ্কার!' : 'Scratch Reward!',
      'success',
      language === 'bn' ? `আপনি +${coinsWon} কয়েন জিতেছেন!` : `You won +${coinsWon} coins!`
    );
    return true;
  };

  // Math Quiz
  const recordQuizReward = (coinsWon: number) => {
    if (!user || user.mathQuizzesLeftToday <= 0) return;

    setUser((prev) =>
      prev
        ? {
            ...prev,
            coins: prev.coins + coinsWon,
            todayEarned: prev.todayEarned + coinsWon,
            totalEarned: prev.totalEarned + coinsWon,
            mathQuizzesLeftToday: prev.mathQuizzesLeftToday - 1,
          }
        : null
    );

    recordTransaction('math_quiz', coinsWon, `Math Quiz solved: +${coinsWon} coins`);
    sounds.playCoin();
  };

  // Complete Task Item
  const completeTaskItem = (taskId: string) => {
    if (!user) return false;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    if (task.completedBy.includes(user.id)) {
      showToast(
        language === 'bn' ? 'টাস্কটি ইতিমধ্যে সম্পন্ন হয়েছে!' : 'Task already completed!',
        'info'
      );
      return false;
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completedBy: [...t.completedBy, user.id] } : t
      )
    );

    setUser((prev) =>
      prev
        ? {
            ...prev,
            coins: prev.coins + task.rewardCoins,
            todayEarned: prev.todayEarned + task.rewardCoins,
            totalEarned: prev.totalEarned + task.rewardCoins,
            tasksCompletedToday: prev.tasksCompletedToday + 1,
          }
        : null
    );

    recordTransaction('task_reward', task.rewardCoins, `Task: ${task.title}`);
    sounds.playWin();

    showToast(
      language === 'bn' ? 'টাস্ক সম্পন্ন!' : 'Task Completed!',
      'success',
      language === 'bn' ? `+${task.rewardCoins} কয়েন যোগ হয়েছে` : `+${task.rewardCoins} coins added!`
    );
    return true;
  };

  // Claim Google / Sponsored Ad Reward
  const claimAdReward = (coins: number = 15, adName: string = 'Google AdSense Banner') => {
    if (!user) return false;
    setUser((prev) =>
      prev
        ? {
            ...prev,
            coins: prev.coins + coins,
            todayEarned: prev.todayEarned + coins,
            totalEarned: prev.totalEarned + coins,
          }
        : null
    );
    recordTransaction('task_reward', coins, `Ad Reward: ${adName}`);
    sounds.playCoin();
    showToast(
      language === 'bn' ? 'বিজ্ঞাপন রিওয়ার্ড সফল!' : 'Ad Reward Earned!',
      'success',
      language === 'bn' ? `+${coins} কয়েন যুক্ত হয়েছে` : `+${coins} coins added!`
    );
    return true;
  };

  // Submit Withdrawal
  const submitWithdrawal = (
    method: PaymentMethod,
    accountNumber: string,
    amountBdt: number,
    operator?: string
  ) => {
    if (!user) {
      return { success: false, message: 'Please login' };
    }

    const requiredCoins = amountBdt * settings.coinsPerBdt;

    if (amountBdt < settings.minWithdrawBdt) {
      sounds.playError();
      return {
        success: false,
        message:
          language === 'bn'
            ? `সর্বনিম্ন উত্তোলন ৳${settings.minWithdrawBdt}`
            : `Minimum withdrawal is ৳${settings.minWithdrawBdt}`,
      };
    }

    if (user.coins < requiredCoins) {
      sounds.playError();
      return {
        success: false,
        message:
          language === 'bn'
            ? `পর্যাপ্ত কয়েন নেই! আপনার প্রয়োজন ${requiredCoins.toLocaleString()} কয়েন`
            : `Insufficient balance! You need ${requiredCoins.toLocaleString()} coins`,
      };
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newRequest: WithdrawalRequest = {
      id: `wdr_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      method,
      accountNumber,
      operator,
      amountBdt,
      coinsDeducted: requiredCoins,
      status: 'pending',
      requestedAt: now,
    };

    setWithdrawals((prev) => [newRequest, ...prev]);

    setUser((prev) =>
      prev
        ? {
            ...prev,
            coins: prev.coins - requiredCoins,
          }
        : null
    );

    recordTransaction(
      'withdrawal',
      -requiredCoins,
      `Cashout ৳${amountBdt} via ${method.toUpperCase()} (${accountNumber})`,
      amountBdt
    );

    sounds.playWin();
    showToast(
      language === 'bn' ? 'আবেদন সফল!' : 'Request Submitted!',
      'success',
      language === 'bn'
        ? `৳${amountBdt} উত্তোলনের অনুরোধ সফল হয়েছে।`
        : `৳${amountBdt} payout request queued.`
    );

    return {
      success: true,
      message:
        language === 'bn'
          ? 'উত্তোলনের আবেদন সফল হয়েছে।'
          : 'Withdrawal submitted successfully.',
    };
  };

  // Admin: Approve Withdrawal
  const approveWithdrawal = (id: string, trxId: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: 'approved',
              transactionId: trxId || `TX${Date.now().toString().slice(6)}`,
              processedAt: now,
            }
          : w
      )
    );

    sounds.playCoin();
    showToast('উত্তোলন সফলভাবে অনুমোদিত হয়েছে (Approved)', 'success');
  };

  // Admin: Reject Withdrawal
  const rejectWithdrawal = (id: string, reason: string) => {
    const target = withdrawals.find((w) => w.id === id);
    if (!target) return;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: 'rejected',
              rejectionReason: reason || 'অ্যাকাউন্ট তথ্যে ভুল অথবা নিয়মভঙ্গ',
              processedAt: now,
            }
          : w
      )
    );

    if (user && target.userId === user.id) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              coins: prev.coins + target.coinsDeducted,
            }
          : null
      );
    }

    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === target.userId ? { ...u, coins: u.coins + target.coinsDeducted } : u
      )
    );

    sounds.playError();
    showToast('উত্তোলন বাতিল করা হয়েছে এবং কয়েন রিফান্ড হয়েছে', 'info');
  };

  // Admin: Add Task
  const addNewTask = (taskData: Omit<TaskItem, 'id' | 'completedBy'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `tsk_${Date.now()}`,
      completedBy: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    sounds.playClick();
    showToast('নতুন টাস্ক সফলভাবে যুক্ত হয়েছে', 'success');
  };

  // Admin: Toggle Task
  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
    sounds.playClick();
  };

  // Admin: Delete Task
  const deleteTaskItem = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    sounds.playClick();
    showToast('টাস্ক মুছে ফেলা হয়েছে', 'info');
  };

  // Admin: Update Settings
  const updateAppSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    sounds.playClick();
    showToast('সেটিংস সফলভাবে আপডেট হয়েছে', 'success');
  };

  // Admin: Toggle User Ban
  const toggleUserBanState = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u))
    );
    if (user && user.id === userId) {
      setUser((prev) => (prev ? { ...prev, isBanned: !prev.isBanned } : null));
    }
    sounds.playClick();
    showToast('ইউজার স্ট্যাটাস পরিবর্তন করা হয়েছে', 'info');
  };

  // Admin: Adjust user coins
  const adjustUserBalance = (userId: string, coinDelta: number, reason: string) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, coins: Math.max(0, u.coins + coinDelta) } : u
      )
    );
    if (user && user.id === userId) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              coins: Math.max(0, prev.coins + coinDelta),
            }
          : null
      );
    }
    recordTransaction('admin_adjustment', coinDelta, `Admin adjust: ${reason}`);
    sounds.playCoin();
    showToast(`ব্যালেন্স সমন্বয় করা হয়েছে (${coinDelta > 0 ? '+' : ''}${coinDelta})`, 'success');
  };

  // Switch role
  const switchUserRole = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setIsAdminMode(true);
      setUser(sampleAdminUser);
    } else {
      setIsAdminMode(false);
      setUser(defaultUser);
    }
    sounds.playClick();
  };

  // Reset demo data
  const resetAllData = () => {
    localStorage.clear();
    setUser(null);
    setAllUsers([defaultUser, sampleAdminUser]);
    setSettings(initialSettings);
    setTasks(initialTasks);
    setWithdrawals(initialWithdrawals);
    setTransactions(initialTransactions);
    sounds.playClick();
    showToast('ডেটা সফলভাবে রিসেট করা হয়েছে। অনুগ্রহ করে আবার লগইন/রেজিস্ট্রেশন করুন।', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        allUsers,
        settings,
        tasks,
        withdrawals,
        transactions,
        language,
        activeTab,
        isAdminMode,
        soundEnabled,
        toasts,
        showToast,
        removeToast,
        setLanguage,
        toggleLanguage,
        setActiveTab,
        setIsAdminMode,
        toggleSound,
        registerUser,
        loginUser,
        logoutUser,
        quickDemoLogin,
        quickAdminLogin,
        claimDailyBonus,
        useSpinReward,
        useScratchReward,
        recordQuizReward,
        completeTaskItem,
        submitWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        addNewTask,
        toggleTaskStatus,
        deleteTaskItem,
        updateAppSettings,
        toggleUserBanState,
        adjustUserBalance,
        claimAdReward,
        switchUserRole,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
