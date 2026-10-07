import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Phone,
  Lock,
  Mail,
  User as UserIcon,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Coins,
  ArrowRight,
  Globe,
  Flame,
  Zap,
  Download,
} from 'lucide-react';
import { sounds } from '../utils/sound';

export const AuthGate: React.FC = () => {
  const {
    registerUser,
    loginUser,
    quickDemoLogin,
    quickAdminLogin,
    language,
    toggleLanguage,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Login states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে আপনার পুরো নাম লিখুন' : 'Please enter your full name');
      sounds.playError();
      return;
    }

    if (!phone.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে আপনার মোবাইল নম্বর দিন' : 'Please enter your phone number');
      sounds.playError();
      return;
    }

    if (password.length < 6) {
      setErrorMessage(language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters');
      sounds.playError();
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(language === 'bn' ? 'উভয় পাসওয়ার্ড একই হতে হবে' : 'Passwords do not match');
      sounds.playError();
      return;
    }

    if (!agreedTerms) {
      setErrorMessage(language === 'bn' ? 'আপনাকে শর্তাবলীতে সম্মতি জানাতে হবে' : 'Please accept the terms');
      sounds.playError();
      return;
    }

    const res = registerUser({
      name,
      phone,
      email,
      password,
      referralCode: referralCode.trim() || undefined,
    });

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage(language === 'bn' ? 'মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড পূরণ করুন' : 'Please enter mobile/email and password');
      sounds.playError();
      return;
    }

    const res = loginUser(loginIdentifier, loginPassword);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar for language */}
      <div className="w-full max-w-md flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <img
            src="/app-logo.png"
            alt="Eran Pro Logo"
            className="w-11 h-11 rounded-2xl object-cover shadow-lg shadow-amber-500/20 border border-amber-500/40"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              ERAN PRO
            </span>
            <p className="text-[10px] text-slate-400 font-semibold leading-tight">
              Work • Earn • Grow
            </p>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'bn' ? 'বাংলা' : 'English'}</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl max-w-md w-full p-6 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Logo Centerpiece */}
        <div className="flex flex-col items-center justify-center text-center mb-5">
          <img
            src="/app-logo.png"
            alt="Eran Pro App Logo"
            className="w-20 h-20 rounded-3xl object-cover shadow-2xl shadow-amber-500/30 border-2 border-amber-500/40 mb-3 hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-xl font-black text-white">
            {language === 'bn' ? 'স্বাগতম Eran Pro অ্যাপে' : 'Welcome to Eran Pro'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'মোবাইল দিয়ে ঘরে বসেই প্রতিদিন রিয়েল ইনকাম করুন'
              : 'Work • Earn • Grow with authentic daily micro tasks'}
          </p>
        </div>

        {/* Notice alert */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 mb-5">
          <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            {language === 'bn'
              ? 'কাজ শুরু করতে ও কয়েন ওয়ালেটে জমা করতে প্রথমে রেজিস্ট্রেশন করুন। রেফার কোড থাকলে সাথে সাথে ২০০ কয়েন ফ্রি বোনাস!'
              : 'Registration is required to earn and withdraw. Use a referral code for instant 200 welcome bonus coins!'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
              sounds.playClick();
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'নতুন রেজিস্ট্রেশন (Sign Up)' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
              sounds.playClick();
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'লগইন করুন (Sign In)' : 'Sign In'}
          </button>
        </div>

        {/* Error Message Box */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-4 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mode: Registration Form */}
        {mode === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'আপনার পুরো নাম' : 'Full Name'} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ তানভীর' : 'e.g. Tanvir Ahmed'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট)' : 'Phone Number (11 Digits)'} *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {language === 'bn' ? 'বিকাশ/নগদ যে নম্বরে টাকা নেবেন সেই নম্বরটি ব্যবহার করা সুবিধাজনক।' : 'Recommended to use your bKash or Nagad mobile number.'}
              </span>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'} ({language === 'bn' ? 'ঐচ্ছিক' : 'Optional'})
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Referral Code (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>{language === 'bn' ? 'রেফার কোড' : 'Referral Code'} ({language === 'bn' ? 'ঐচ্ছিক' : 'Optional'})</span>
                <span className="text-[10px] text-amber-400 font-bold">+200 কয়েন বোনাস</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. ERAN96"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-amber-300 font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors uppercase"
                />
                <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'} *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'bn' ? 'নিশ্চিত করুন' : 'Confirm'} *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-800 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-300">
                {language === 'bn'
                  ? 'আমি Eran Pro এর শর্তাবলী ও নিয়ম মেনে কাজ করতে সম্মত।'
                  : 'I agree to the Terms of Service & Payout Rules.'}
              </span>
            </label>

            {/* Submit Register Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>
                {language === 'bn' ? 'একাউন্ট রেজিস্টার করুন ও বোনাস নিন' : 'Register & Claim Bonus'}
              </span>
            </button>
          </form>
        ) : (
          /* Mode: Login Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর বা ইমেইল' : 'Mobile Number or Email'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="01812345678 or email@..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 pl-10 pr-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-all"
            >
              <span>{language === 'bn' ? 'লগইন করুন' : 'Log In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Testing Login Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center">
            {language === 'bn' ? 'টেস্টিং ও ডেমো অ্যাক্সেস:' : 'Fast Demo Shortcuts for Testing:'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={quickDemoLogin}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'ডেমো ইউজার লগইন' : 'Demo User'}</span>
            </button>

            <button
              type="button"
              onClick={quickAdminLogin}
              className="p-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-[11px] font-semibold text-rose-300 hover:text-rose-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>{language === 'bn' ? 'অ্যাডমিন ডিরেক্ট লগইন' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Download Android APK Direct Button */}
      <div className="w-full max-w-md mt-4">
        <a
          href="/EranPro-v1.0.0-release.apk"
          download="EranPro-v1.0.0-release.apk"
          className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block leading-tight font-extrabold text-emerald-400">
                {language === 'bn' ? 'অ্যান্ড্রয়েড APK সরাসরি ডাউনলোড' : 'Download Android APK'}
              </span>
              <span className="text-[10px] text-slate-400">EranPro-v1.0.0-release.apk (194 KB)</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-300">
            DOWNLOAD
          </span>
        </a>
      </div>

      {/* Feature highlights */}
      <div className="max-w-md w-full mt-6 grid grid-cols-2 gap-2.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>বিকাশ/নগদে ইনস্ট্যান্ট পেমেন্ট</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>দৈনিক বোনাস ও স্পিন হুইল</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>প্রতি রেফারে ২০০ কয়েন + ১০%</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>২৪/৭ টেলিগ্রাম সাপোর্ট</span>
        </div>
      </div>
    </div>
  );
};
