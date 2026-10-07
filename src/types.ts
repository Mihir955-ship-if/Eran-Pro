export type Language = 'bn' | 'en';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  coins: number;
  totalEarned: number;
  todayEarned: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  referralEarnings: number;
  joinedDate: string;
  isBanned: boolean;
  dailyBonusClaimedDate?: string;
  dailyStreak: number;
  spinsLeftToday: number;
  scratchCardsLeftToday: number;
  mathQuizzesLeftToday: number;
  tasksCompletedToday: number;
}

export type TransactionType =
  | 'daily_bonus'
  | 'spin_wheel'
  | 'scratch_card'
  | 'math_quiz'
  | 'task_reward'
  | 'referral_bonus'
  | 'withdrawal'
  | 'admin_adjustment';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amountCoins: number;
  amountCurrency?: number;
  details: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'rejected';
}

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'recharge' | 'binance';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  method: PaymentMethod;
  accountNumber: string;
  operator?: string; // for mobile recharge
  amountBdt: number;
  coinsDeducted: number;
  status: 'pending' | 'approved' | 'rejected';
  transactionId?: string;
  rejectionReason?: string;
  requestedAt: string;
  processedAt?: string;
}

export type TaskCategory = 'video' | 'visit' | 'social' | 'survey' | 'app';

export interface TaskItem {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  category: TaskCategory;
  rewardCoins: number;
  timerSeconds: number;
  url: string;
  completedBy: string[];
  isActive: boolean;
  iconName: string;
}

export interface AppSettings {
  coinsPerBdt: number; // e.g. 100 coins = 1 BDT (1000 coins = 10 BDT)
  minWithdrawBdt: number; // e.g. 50 BDT
  dailyBonusCoinsBase: number; // e.g. 50
  spinLimitDaily: number; // e.g. 10
  scratchLimitDaily: number; // e.g. 10
  mathQuizLimitDaily: number; // e.g. 15
  referralBonusCoins: number; // e.g. 200
  referralCommissionPercent: number; // e.g. 10%
  noticeTextBn: string;
  noticeTextEn: string;
  telegramSupportUrl: string;
  whatsappSupportNumber: string;
  youtubeTutorialUrl: string;
  maintenanceMode: boolean;
}

export type AppTab =
  | 'home'
  | 'spin'
  | 'scratch'
  | 'quiz'
  | 'tasks'
  | 'wallet'
  | 'refer'
  | 'leaderboard'
  | 'profile';
