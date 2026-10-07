import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, RefreshCcw, Gift, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

export const ScratchCard: React.FC = () => {
  const { user, settings, language, useScratchReward, showToast } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<number>(() => getRandomPrize());
  const [isScratching, setIsScratching] = useState(false);
  const scratchThrottleRef = useRef<number>(0);

  if (!user) return null;

  function getRandomPrize(): number {
    const prizes = [25, 40, 50, 60, 80, 100, 120, 150, 200];
    return prizes[Math.floor(Math.random() * prizes.length)];
  }

  // Initialize Canvas
  const initCard = (prize: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset state
    setIsRevealed(false);
    setCurrentPrize(prize);

    // Setup High DPI
    const width = 300;
    const height = 180;
    canvas.width = width;
    canvas.height = height;

    // Draw scratchable silver-golden shimmer surface
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#94A3B8'); // slate-400
    gradient.addColorStop(0.3, '#E2E8F0'); // silver shine
    gradient.addColorStop(0.5, '#CBD5E1');
    gradient.addColorStop(0.7, '#F1F5F9');
    gradient.addColorStop(1, '#94A3B8');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add pattern / stars
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★  ERAN PRO LUCKY CARD  ★', width / 2, height / 2 - 12);

    ctx.fillStyle = '#475569';
    ctx.font = '12px Plus Jakarta Sans, sans-serif';
    ctx.fillText(
      language === 'bn' ? 'ঘষে পুরষ্কার দেখুন' : 'Scratch here to reveal',
      width / 2,
      height / 2 + 14
    );
  };

  useEffect(() => {
    initCard(currentPrize);
  }, []);

  const scratchAt = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Sound effect
    const now = Date.now();
    if (now - scratchThrottleRef.current > 120) {
      sounds.playScratch();
      scratchThrottleRef.current = now;
    }

    // Check percentage scratched every few strokes
    checkPercentage();
  };

  const checkPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    // Sample every 4th pixel for performance
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const ratio = transparentCount / (totalPixels / 4);
    if (ratio > 0.38) {
      revealFullCard();
    }
  };

  const revealFullCard = () => {
    if (isRevealed) return;
    setIsRevealed(true);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Reward user
    useScratchReward(currentPrize);
    sounds.playWin();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleNextCard = () => {
    if (user.scratchCardsLeftToday <= 0) {
      sounds.playError();
      showToast(
        language === 'bn' ? 'আজকের সব কার্ড শেষ!' : 'All scratch cards used today!',
        'error'
      );
      return;
    }

    const nextPrize = getRandomPrize();
    initCard(nextPrize);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'bn' ? 'স্ক্র্যাচ অ্যান্ড উইন' : 'Scratch & Win'}</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {language === 'bn' ? 'কার্ড ঘষুন এবং কয়েন জিতুন!' : 'Scratch & Reveal Hidden Cash!'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'bn'
            ? 'আঙুল বা মাউস দিয়ে রুপালি প্রলেপটি ঘষুন ও কয়েন সংগ্রহ করুন।'
            : 'Rub your finger or mouse over the silver foil to unveil your instant coins.'}
        </p>
      </div>

      {/* Card Wrapper */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Counter Info */}
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <div className="text-xs text-slate-400">
            {language === 'bn' ? 'আজকের বাকি কার্ড:' : 'Cards left today:'}{' '}
            <span className="font-bold text-amber-400 text-sm">
              {user.scratchCardsLeftToday} / {settings.scratchLimitDaily}
            </span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সর্বোচ্চ ২০০ কয়েন' : 'Up to 200 Coins'}</span>
          </div>
        </div>

        {/* Scratch Card Surface Container */}
        <div className="relative w-[300px] h-[180px] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/60 bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 flex flex-col items-center justify-center select-none">
          {/* Underlying Hidden Prize */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2">
              <Gift className="w-6 h-6 animate-bounce" />
            </div>
            <div className="text-xs font-semibold text-slate-300">
              {language === 'bn' ? 'আপনি পেয়েছেন' : 'You Discovered'}
            </div>
            <div className="text-3xl font-extrabold text-amber-400 mt-0.5">
              +{currentPrize} <span className="text-sm font-semibold">{language === 'bn' ? 'কয়েন' : 'Coins'}</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 font-medium">
              {isRevealed
                ? (language === 'bn' ? '✓ ওয়ালেটে যোগ হয়েছে!' : '✓ Added to Wallet!')
                : (language === 'bn' ? 'ঘষা চালিয়ে যান...' : 'Keep scratching...')}
            </div>
          </div>

          {/* Interactive Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 scratch-card-canvas cursor-pointer z-10"
            onMouseDown={() => setIsScratching(true)}
            onMouseUp={() => setIsScratching(false)}
            onMouseLeave={() => setIsScratching(false)}
            onMouseMove={(e) => {
              if (isScratching) {
                scratchAt(e.clientX, e.clientY);
              }
            }}
            onTouchStart={() => setIsScratching(true)}
            onTouchEnd={() => setIsScratching(false)}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                scratchAt(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
          />
        </div>

        {/* Reveal or Next Card Button */}
        <div className="w-full mt-6 flex flex-col sm:flex-row gap-3">
          {!isRevealed ? (
            <button
              onClick={revealFullCard}
              disabled={user.scratchCardsLeftToday <= 0}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ প্রকাশ করুন' : 'Instant Reveal'}</span>
            </button>
          ) : (
            <button
              onClick={handleNextCard}
              disabled={user.scratchCardsLeftToday <= 0}
              className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                user.scratchCardsLeftToday <= 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <RefreshCcw className="w-4 h-4" />
              <span>
                {user.scratchCardsLeftToday <= 0
                  ? language === 'bn'
                    ? 'আজকের সব কার্ড শেষ'
                    : 'No Cards Left Today'
                  : language === 'bn'
                  ? 'পরবর্তী কার্ড স্ক্র্যাচ করুন'
                  : 'Play Next Card'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
