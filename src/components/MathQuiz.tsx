import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Brain, Clock, CheckCircle2, XCircle, Sparkles, Award } from 'lucide-react';
import { sounds } from '../utils/sound';

interface Question {
  text: string;
  options: number[];
  answer: number;
}

export const MathQuiz: React.FC = () => {
  const { user, settings, language, recordQuizReward, showToast } = useApp();
  const [question, setQuestion] = useState<Question>(() => generateQuestion());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizScore, setQuizScore] = useState(0);

  if (!user) return null;

  function generateQuestion(): Question {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 30) + 5;
    let b = Math.floor(Math.random() * 20) + 2;
    let ans = 0;

    if (op === '+') {
      ans = a + b;
    } else if (op === '-') {
      if (a < b) [a, b] = [b, a]; // keep positive
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      ans = a * b;
    }

    // Generate 3 unique wrong options close to the answer
    const wrongSet = new Set<number>();
    while (wrongSet.size < 3) {
      const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = ans + offset;
      if (wrong !== ans && wrong > 0) {
        wrongSet.add(wrong);
      }
    }

    const allOptions = [ans, ...Array.from(wrongSet)].sort(() => Math.random() - 0.5);

    return {
      text: `${a} ${op === '*' ? '×' : op} ${b} = ?`,
      options: allOptions,
      answer: ans,
    };
  }

  // Timer countdown
  useEffect(() => {
    if (isAnswered || user.mathQuizzesLeftToday <= 0) return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, user.mathQuizzesLeftToday]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    sounds.playError();
    showToast(
      language === 'bn' ? 'সময় শেষ হয়ে গেছে!' : 'Time up!',
      'error',
      language === 'bn' ? 'পরবর্তী প্রশ্নে চেষ্টা করুন' : 'Try the next question'
    );
  };

  const handleSelect = (option: number) => {
    if (isAnswered || user.mathQuizzesLeftToday <= 0) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === question.answer) {
      setIsCorrect(true);
      const reward = 25;
      recordQuizReward(reward);
      setQuizScore((prev) => prev + 1);
      sounds.playCoin();
      showToast(
        language === 'bn' ? 'সঠিক উত্তর!' : 'Correct Answer!',
        'success',
        language === 'bn' ? `+${reward} কয়েন যোগ হয়েছে` : `+${reward} coins added to balance`
      );
    } else {
      setIsCorrect(false);
      sounds.playError();
      showToast(
        language === 'bn' ? 'ভুল উত্তর!' : 'Incorrect Answer!',
        'error',
        language === 'bn' ? `সঠিক উত্তর ছিল: ${question.answer}` : `Correct answer was: ${question.answer}`
      );
    }
  };

  const handleNextQuestion = () => {
    if (user.mathQuizzesLeftToday <= 0) {
      sounds.playError();
      showToast(
        language === 'bn' ? 'আজকের সব কুইজ শেষ!' : 'All quizzes completed today!',
        'error'
      );
      return;
    }

    setQuestion(generateQuestion());
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTimeLeft(20);
    sounds.playClick();
  };

  const progressPercent = (timeLeft / 20) * 100;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <Brain className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'bn' ? 'ব্রেইন পাওয়ার কুইজ' : 'Math Quiz Arena'}</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {language === 'bn' ? 'সহজ অংক সমাধান করুন ও আয় করুন' : 'Solve Quick Math & Earn Coins'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'bn'
            ? 'প্রতিটি সঠিক উত্তরে ২৫ কয়েন। ২০ সেকেন্ডের মধ্যে সঠিক উত্তর দিন।'
            : 'Earn 25 coins for every correct calculation within 20 seconds.'}
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Top Info Bar */}
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <div className="text-xs text-slate-400">
            {language === 'bn' ? 'আজকের বাকি কুইজ:' : 'Quizzes left:'}{' '}
            <span className="font-bold text-amber-400 text-sm">
              {user.mathQuizzesLeftToday} / {settings.mathQuizLimitDaily}
            </span>
          </div>
          <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>
              {language === 'bn' ? `স্কোর: ${quizScore}` : `Solved: ${quizScore}`}
            </span>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 mb-6 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft > 10
                ? 'bg-emerald-500'
                : timeLeft > 5
                ? 'bg-amber-500'
                : 'bg-rose-500 animate-pulse'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Time Remaining Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-6">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>
            {timeLeft} {language === 'bn' ? 'সেকেন্ড বাকি' : 'seconds remaining'}
          </span>
        </div>

        {/* Math Question Board */}
        <div className="w-full py-8 px-4 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-slate-800 flex items-center justify-center text-center shadow-inner mb-6">
          <span className="text-4xl font-extrabold text-white tracking-widest font-mono">
            {question.text}
          </span>
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="grid grid-cols-2 gap-3.5 w-full mb-6">
          {question.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isThisAnswer = opt === question.answer;

            let btnStyle = 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-700 text-slate-100';

            if (isAnswered) {
              if (isThisAnswer) {
                btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
              } else if (isSelected && !isThisAnswer) {
                btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
              } else {
                btnStyle = 'bg-slate-950/60 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || user.mathQuizzesLeftToday <= 0}
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-xl border font-bold text-xl transition-all flex items-center justify-between shadow-md active:scale-95 ${btnStyle}`}
              >
                <span className="font-mono">{opt}</span>
                {isAnswered && isThisAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                {isAnswered && isSelected && !isThisAnswer && (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button: Next Question */}
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            disabled={user.mathQuizzesLeftToday <= 0}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              user.mathQuizzesLeftToday <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {user.mathQuizzesLeftToday <= 0
                ? language === 'bn'
                  ? 'আজকের সব কুইজ সম্পন্ন'
                  : 'No Quizzes Left Today'
                : language === 'bn'
                ? 'পরবর্তী প্রশ্ন'
                : 'Next Question'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
