import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ExternalLink,
  Info,
  Sparkles,
  CheckCircle2,
  X,
  ShieldCheck,
  Gift,
  Check,
} from 'lucide-react';
import { sounds } from '../utils/sound';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface GoogleAdBannerProps {
  className?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

export const GoogleAdBanner: React.FC<GoogleAdBannerProps> = ({
  className = '',
  slot = 'top-home',
  format = 'auto',
}) => {
  const { user, language, claimAdReward } = useApp();
  const [adLoaded, setAdLoaded] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isClaimedToday, setIsClaimedToday] = useState(false);
  const [claimTimer, setClaimTimer] = useState(5);
  const [canClaim, setCanClaim] = useState(false);

  const publisherId = 'pub-7103808736101367';
  const clientTag = 'ca-pub-7103808736101367';
  const admobAppId = 'ca-app-pub-7103808736101367~8427394089';
  const adsTxtEntry = 'google.com, pub-7103808736101367, DIRECT, f08c47fec0942fa0';

  // Push to adsbygoogle on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore adsbygoogle duplicate push errors
      console.log('Google Adsense initialized:', e);
    }
  }, []);

  // Ad reward countdown timer for interactive engagement
  useEffect(() => {
    if (isClaimedToday) return;
    const interval = setInterval(() => {
      setClaimTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isClaimedToday]);

  const handleClaimReward = () => {
    if (!canClaim || isClaimedToday) return;
    sounds.playCoin();
    if (claimAdReward) {
      claimAdReward(15, 'Google AdSense Home Top Banner');
    }
    setIsClaimedToday(true);
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-xl transition-all ${className}`}>
      {/* Top Banner Header: Google Ads Label & Info */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-1.5">
          {/* Google 4-color icon dot */}
          <div className="flex items-center -space-x-0.5">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
            <span className="w-2 h-2 rounded-full bg-[#34A853]" />
          </div>
          <span className="font-extrabold text-slate-200 tracking-wide">
            Google Ads
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
            {language === 'bn' ? 'বিজ্ঞাপন' : 'Ad'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
            {publisherId}
          </span>
          <button
            onClick={() => setShowInfoModal(true)}
            title="Google AdSense & ads.txt Verification Info"
            className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors flex items-center gap-1 text-[10px]"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{language === 'bn' ? 'তথ্য' : 'Info'}</span>
          </button>
        </div>
      </div>

      {/* Main Google Ad Content Area */}
      <div className="p-3 sm:p-4">
        {/* Real Google AdSense Tag */}
        <div className="w-full flex justify-center overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', minHeight: '90px', width: '100%' }}
            data-ad-client={clientTag}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>

        {/* High-fidelity Fallback & Interactive Sponsored Banner */}
        <div className="mt-2.5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800/90 p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-teal-400 p-0.5 shrink-0 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white">
                  {language === 'bn'
                    ? 'গুগল স্পন্সরড পার্টনার অফার'
                    : 'Google Sponsored Partner Spotlight'}
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  +15 COINS
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {language === 'bn'
                  ? 'হোম স্ক্রিনে বিজ্ঞাপন দেখে প্রতিদিন অতিরিক্ত রিওয়ার্ড সংগ্রহ করুন'
                  : 'View featured top ad to claim your free coin rewards daily'}
              </p>
            </div>
          </div>

          {/* Interactive Claim / Ad Action Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            {isClaimedToday ? (
              <div className="py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ক্লেইম সম্পন্ন' : 'Claimed'}</span>
              </div>
            ) : canClaim ? (
              <button
                onClick={handleClaimReward}
                className="w-full sm:w-auto py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? '১৫ কয়েন ক্লেইম করুন' : 'Claim +15 Coins'}</span>
              </button>
            ) : (
              <div className="py-1.5 px-3 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>
                  {language === 'bn' ? `অপেক্ষা করুন: ${claimTimer}s` : `Wait: ${claimTimer}s`}
                </span>
              </div>
            )}

            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Visit Sponsor"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Info & ads.txt Verification Details Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {language === 'bn' ? 'গুগল অ্যাডসেন্স বিবরণ' : 'Google AdSense Details'}
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-medium mb-1">
                  {language === 'bn' ? 'গুগল অ্যাডমব অ্যাপ আইডি (AdMob App ID):' : 'Google AdMob App ID:'}
                </div>
                <div className="font-mono text-cyan-400 font-bold selection:bg-cyan-500/30 break-all select-all">
                  {admobAppId}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-medium mb-1">
                  {language === 'bn' ? 'পাবলিশার আইডি (Publisher ID):' : 'Publisher ID:'}
                </div>
                <div className="font-mono text-emerald-400 font-bold selection:bg-emerald-500/30">
                  {publisherId}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-medium mb-1">
                  {language === 'bn' ? 'অফিসিয়াল ads.txt ভেরিফিকেশন রেকর্ড:' : 'Authorized ads.txt Entry:'}
                </div>
                <div className="font-mono text-[11px] text-amber-300 bg-slate-900 p-2 rounded border border-slate-800 break-all select-all">
                  {adsTxtEntry}
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  {language === 'bn'
                    ? 'ads.txt এবং app-ads.txt সফলভাবে যুক্ত আছে এবং গুগল ক্রলারের জন্য উন্মুক্ত।'
                    : 'ads.txt & app-ads.txt are configured and accessible at root.'}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href="/ads.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>/ads.txt {language === 'bn' ? 'দেখুন' : 'View'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setShowInfoModal(false)}
                  className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
