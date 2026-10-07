import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Disc, Sparkles, RefreshCw, Trophy, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

interface WheelSegment {
  value: number;
  label: string;
  color: string;
  textColor: string;
}

const SEGMENTS: WheelSegment[] = [
  { value: 50, label: '50', color: '#10B981', textColor: '#FFFFFF' }, // emerald
  { value: 10, label: '10', color: '#3B82F6', textColor: '#FFFFFF' }, // blue
  { value: 200, label: '200', color: '#F59E0B', textColor: '#FFFFFF' }, // amber
  { value: 25, label: '25', color: '#8B5CF6', textColor: '#FFFFFF' }, // purple
  { value: 500, label: '500 🌟', color: '#EC4899', textColor: '#FFFFFF' }, // pink
  { value: 15, label: '15', color: '#06B6D4', textColor: '#FFFFFF' }, // cyan
  { value: 100, label: '100', color: '#F97316', textColor: '#FFFFFF' }, // orange
  { value: 30, label: '30', color: '#6366F1', textColor: '#FFFFFF' }, // indigo
];

export const SpinWheel: React.FC = () => {
  const { user, settings, language, useSpinReward, showToast } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<number | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  if (!user) return null;

  const numSegments = SEGMENTS.length;
  const segmentAngle = 360 / numSegments;

  const handleSpin = () => {
    if (isSpinning) return;

    if (user.spinsLeftToday <= 0) {
      sounds.playError();
      showToast(
        language === 'bn' ? 'আজকের সব স্পিন শেষ!' : 'Daily spins exhausted!',
        'error',
        language === 'bn' ? 'আগামীকাল নতুন স্পিন পাবেন' : 'Come back tomorrow for fresh spins.'
      );
      return;
    }

    setIsSpinning(true);
    setWonPrize(null);

    // Pick random segment
    const targetSegmentIndex = Math.floor(Math.random() * numSegments);
    const selectedSegment = SEGMENTS[targetSegmentIndex];

    // Compute target rotation
    // Add 5-7 full spins (1800 - 2520 degrees)
    const extraSpins = 360 * 6;
    // Align pointer at top (270 degrees or 90 degrees offset)
    // The top pointer points at angle: (360 - (targetSegmentIndex * segmentAngle + segmentAngle / 2))
    const targetAngle = 360 - (targetSegmentIndex * segmentAngle + segmentAngle / 2);
    const currentModulo = rotation % 360;
    const finalRotation = rotation + (360 - currentModulo) + extraSpins + targetAngle;

    setRotation(finalRotation);

    // Simulate clicking ticks as wheel spins
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      sounds.playTick();
      if (tickCount > 24) {
        clearInterval(tickInterval);
      }
    }, 150);
    audioIntervalRef.current = tickInterval;

    // After animation finishes (4 seconds)
    setTimeout(() => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setIsSpinning(false);
      setWonPrize(selectedSegment.value);
      useSpinReward(selectedSegment.value);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      sounds.playWin();
    }, 4000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header Info */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Disc className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span>{language === 'bn' ? 'লাকি স্পিন ও উইন' : 'Lucky Spin Wheel'}</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          {language === 'bn' ? 'স্পিন ঘুরিয়ে কয়েন জিতুন!' : 'Spin & Win Real Coins!'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'bn'
            ? 'প্রতিদিন ১০টি স্পিন সুযোগ। সর্বোচ্চ ৫০০ কয়েন জেতার দারুণ সুযোগ!'
            : 'Spin daily to win up to 500 instant coins straight to your wallet.'}
        </p>
      </div>

      {/* Wheel Card Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Spins Left Badge */}
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <div className="text-xs text-slate-400">
            {language === 'bn' ? 'আজকের বাকি স্পিন:' : 'Spins remaining:'}{' '}
            <span className="font-bold text-amber-400 text-sm">
              {user.spinsLeftToday} / {settings.spinLimitDaily}
            </span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সর্বোচ্চ ৫০০ কয়েন' : 'Up to 500 Coins'}</span>
          </div>
        </div>

        {/* SVG Spin Wheel Assembly */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Wheel Pointer Needle (Top Center) */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-6 h-7 bg-amber-400 clip-triangle shadow-lg filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                 style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
            <div className="w-3 h-3 rounded-full bg-white -mt-5 border border-slate-900 shadow" />
          </div>

          {/* Outer Glowing Border Ring */}
          <div className="p-3 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-slate-700/60 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <div
              className="w-72 h-72 sm:w-80 sm:h-80 rounded-full relative transition-transform ease-out shadow-2xl overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: isSpinning ? '4000ms' : '0ms',
                transitionTimingFunction: 'cubic-bezier(0.15, 0.9, 0.2, 1)',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {SEGMENTS.map((seg, idx) => {
                  const angle = segmentAngle;
                  const startAngle = idx * angle;
                  const endAngle = startAngle + angle;

                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  // Text position in middle of segment
                  const midAngle = startAngle + angle / 2;
                  const textX = 50 + 32 * Math.cos((Math.PI * midAngle) / 180);
                  const textY = 50 + 32 * Math.sin((Math.PI * midAngle) / 180);

                  return (
                    <g key={idx}>
                      <path
                        d={pathData}
                        fill={seg.color}
                        stroke="#0f172a"
                        strokeWidth="1"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill={seg.textColor}
                        fontSize="5"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                      >
                        {seg.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Center Hub */}
              <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-900 border-4 border-amber-400 shadow-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Won Prize Banner */}
        {wonPrize !== null && !isSpinning && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in zoom-in-95 duration-200 w-full">
            <span className="text-xs font-semibold text-emerald-300">
              {language === 'bn' ? 'অভিনন্দন! আপনি জিতেছেন' : 'Congratulations! You won'}
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              +{wonPrize} {language === 'bn' ? 'কয়েন' : 'Coins'}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full mt-5">
          <button
            onClick={handleSpin}
            disabled={isSpinning || user.spinsLeftToday <= 0}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all ${
              isSpinning
                ? 'bg-slate-800 text-slate-400 cursor-wait'
                : user.spinsLeftToday <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>
              {isSpinning
                ? language === 'bn'
                  ? 'হুইল ঘুরছে...'
                  : 'Spinning...'
                : user.spinsLeftToday <= 0
                ? language === 'bn'
                  ? 'আজকের স্পিন শেষ'
                  : 'No Spins Left Today'
                : language === 'bn'
                ? 'এখনই স্পিন করুন'
                : 'Spin Now'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
