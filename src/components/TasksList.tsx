import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TaskItem, TaskCategory } from '../types';
import {
  CheckSquare,
  PlayCircle,
  Globe,
  Send,
  HelpCircle,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Flame,
  Tv,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { AdsterraBanner } from './AdsterraBanner';

export const TasksList: React.FC = () => {
  const { tasks, user, language, completeTaskItem } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTaskModal, setActiveTaskModal] = useState<TaskItem | null>(null);
  const [taskCountdown, setTaskCountdown] = useState<number>(0);
  const [isTaskReadyToClaim, setIsTaskReadyToClaim] = useState<boolean>(false);

  if (!user) return null;

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'video':
        return <PlayCircle className="w-5 h-5 text-rose-400" />;
      case 'visit':
        return <Globe className="w-5 h-5 text-sky-400" />;
      case 'social':
        return <Send className="w-5 h-5 text-indigo-400" />;
      case 'survey':
        return <HelpCircle className="w-5 h-5 text-amber-400" />;
      case 'app':
        return <Smartphone className="w-5 h-5 text-emerald-400" />;
      default:
        return <CheckSquare className="w-5 h-5 text-cyan-400" />;
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (!t.isActive) return false;
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const handleStartTask = (task: TaskItem) => {
    if (task.completedBy.includes(user.id)) return;
    setActiveTaskModal(task);
    setTaskCountdown(task.timerSeconds);
    setIsTaskReadyToClaim(false);
    sounds.playClick();
  };

  // Countdown timer inside task modal
  useEffect(() => {
    if (!activeTaskModal) return;

    if (taskCountdown <= 0) {
      setIsTaskReadyToClaim(true);
      return;
    }

    const timer = setInterval(() => {
      setTaskCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTaskModal, taskCountdown]);

  const handleClaimReward = () => {
    if (!activeTaskModal || !isTaskReadyToClaim) return;
    const success = completeTaskItem(activeTaskModal.id);
    if (success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
    setActiveTaskModal(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'মাইক্রো টাস্ক জোন' : 'Task Offerwall'}</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {language === 'bn' ? 'সহজ টাস্ক পূরণ করে কয়েন আয় করুন' : 'Complete Micro Tasks & Get Paid'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'bn'
            ? 'ভিডিও দেখা, ওয়েবসাইট ভিজিট বা সোশাল চ্যানেলে যুক্ত হয়ে নিয়মিত কয়েন জিতুন।'
            : 'Watch videos, visit partner sites, and complete easy offers to boost your daily balance.'}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[
          { id: 'all', labelBn: 'সকল টাস্ক', labelEn: 'All Tasks' },
          { id: 'visit', labelBn: 'ওয়েবসাইট ভিজিট', labelEn: 'Web Visit' },
          { id: 'video', labelBn: 'ভিডিও টাস্ক', labelEn: 'Video Watch' },
          { id: 'social', labelBn: 'সোশাল জয়েন', labelEn: 'Social Groups' },
          { id: 'survey', labelBn: 'জরিপ ও কুইজ', labelEn: 'Surveys' },
          { id: 'app', labelBn: 'অ্যাপ ইনস্টল', labelEn: 'App Offers' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedCategory(tab.id);
              sounds.playClick();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {language === 'bn' ? tab.labelBn : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
            <CheckSquare className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold">
              {language === 'bn' ? 'এই ক্যাটাগরিতে বর্তমানে কোনো টাস্ক নেই' : 'No tasks available in this category'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.completedBy.includes(user.id);
            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-lg'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(task.category)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm leading-snug">
                      {language === 'bn' ? task.titleBn || task.title : task.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {language === 'bn' ? task.descriptionBn || task.description : task.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{task.timerSeconds}s</span>
                      </span>
                      <span>·</span>
                      <span className="text-amber-400 font-bold">
                        +{task.rewardCoins} {language === 'bn' ? 'কয়েন' : 'Coins'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center w-full sm:w-auto">
                  {isCompleted ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'bn' ? 'সম্পন্ন হয়েছে' : 'Completed'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartTask(task)}
                      className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'টাস্ক শুরু করুন' : 'Start Task'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sponsored Ad Banner in Task Wall */}
      <div className="mt-6 flex flex-col items-center">
        <AdsterraBanner />
      </div>

      {/* Task Execution Modal */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  {getCategoryIcon(activeTaskModal.category)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm leading-tight">
                    {language === 'bn' ? activeTaskModal.titleBn : activeTaskModal.title}
                  </h3>
                  <span className="text-xs text-amber-400 font-semibold">
                    +{activeTaskModal.rewardCoins} {language === 'bn' ? 'কয়েন রিওয়ার্ড' : 'Coins Reward'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTaskModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-3 font-medium">
                <Tv className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'কয়েন পেতে নিচের বিজ্ঞাপনটি পুরো সময় দেখুন। টাইমার শেষ হলে কয়েন ক্লেইম করুন!'
                    : 'Watch the sponsored ad below to completion to claim your reward coins!'}
                </span>
              </div>

              {/* Progress & Countdown Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center mb-3 text-center">
                <div className="flex items-center justify-between w-full mb-1 px-1">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {isTaskReadyToClaim
                      ? (language === 'bn' ? '✓ অ্যাড দেখা সম্পন্ন!' : '✓ Ad Completed!')
                      : (language === 'bn' ? 'বিজ্ঞাপন দেখার সময় বাকি:' : 'Ad Viewing Time Left:')}
                  </span>
                  <span className="text-sm font-black text-cyan-400 font-mono">
                    {taskCountdown}s
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 mb-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-1000"
                    style={{
                      width: `${((activeTaskModal.timerSeconds - taskCountdown) / activeTaskModal.timerSeconds) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  {isTaskReadyToClaim
                    ? (language === 'bn' ? 'অভিনন্দন! এখন কয়েন সংগ্রহ বাটনে চাপুন' : 'Great! Click below to collect your coins')
                    : (language === 'bn' ? 'অনুগ্রহ করে বিজ্ঞাপনটি মনোযোগ দিয়ে দেখুন' : 'Please keep the ad visible until countdown ends')}
                </span>
              </div>

              {/* Live 300x250 Adsterra Ad Unit */}
              <AdsterraBanner />

              {/* External Visit Button */}
              {activeTaskModal.url && (
                <a
                  href={activeTaskModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2 mb-3 mt-2"
                >
                  <span>{language === 'bn' ? 'অফার ওয়েবসাইট ভিজিট করুন' : 'Visit Offer Website'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}

              {/* Claim Reward Button */}
              <button
                onClick={handleClaimReward}
                disabled={!isTaskReadyToClaim}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isTaskReadyToClaim
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25 animate-pulse cursor-pointer hover:scale-[1.01]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/70'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isTaskReadyToClaim
                    ? language === 'bn'
                      ? `কয়েন সংগ্রহ করুন (+${activeTaskModal.rewardCoins} কয়েন)`
                      : `Claim Reward (+${activeTaskModal.rewardCoins} Coins)`
                    : language === 'bn'
                    ? `অ্যাড দেখুন (${taskCountdown}s পর কয়েন আনলক হবে)`
                    : `Watch Ad (${taskCountdown}s to unlock)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
