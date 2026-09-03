import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  X, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User as UserIcon, 
  ArrowRight, 
  Upload, 
  KeyRound, 
  Users,
  Check,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  HelpCircle,
  RotateCcw,
  Camera
} from 'lucide-react';
import { rakibulAvatar } from '../data/mockData';
import { compressImage } from '../utils/imageCompressor';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginWithCredentials, 
    createAccount, 
    resetPassword,
    users, 
    switchUserPersona, 
    t,
    language,
    showToast 
  } = useApp();

  // Mode: 'signin' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signup');
  
  // Method: 'google' | 'username' | 'phone'
  const [method, setMethod] = useState<'google' | 'username' | 'phone'>('google');

  // Form Fields - initialized cleanly without hardcoded pre-filled values
  const [fullName, setFullName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [countryCode, setCountryCode] = useState('+880');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password specific fields
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  // Academic Fields for Signup
  const [department, setDepartment] = useState('Science (বিজ্ঞান বিভাগ)');
  const [semester, setSemester] = useState('SSC 2027 Batch (Class 10)');
  
  // Avatar Selection & Custom Upload
  const presetAvatars = [
    { label: 'Rakibul Islam (Cadet Uniform)', url: rakibulAvatar },
    { label: 'Student 1 (Male)', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' },
    { label: 'Student 2 (Female)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
    { label: 'Student 3 (Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
    { label: 'Student 4 (Female)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
    { label: 'Student 5 (Male)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' }
  ];

  const [selectedAvatar, setSelectedAvatar] = useState<string>(presetAvatars[0].url);
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OTP State for Mobile Phone verification
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('491823');

  if (!isAuthModalOpen) return null;

  const countryCodes = [
    { code: '+880', country: 'BD (+880)' },
    { code: '+1', country: 'US/CA (+1)' },
    { code: '+91', country: 'IN (+91)' },
    { code: '+44', country: 'UK (+44)' },
    { code: '+971', country: 'UAE (+971)' },
    { code: '+966', country: 'KSA (+966)' },
    { code: '+60', country: 'MY (+60)' },
    { code: '+65', country: 'SG (+65)' }
  ];

  const handleSendOtp = () => {
    if (!phoneDigits.trim()) {
      showToast(
        language === 'bn' ? 'মোবাইল নম্বর প্রয়োজন' : 'Phone Number Required',
        language === 'bn' ? 'অনুগ্রহ করে আপনার সঠিক মোবাইল নম্বরটি লিখুন।' : 'Please enter your mobile phone number.',
        'info'
      );
      return;
    }
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setOtpSent(true);
    setOtpValue(randomCode); // auto-fill for testing
    showToast(
      language === 'bn' ? 'এসএমএস ওটিপি পাঠানো হয়েছে 📲' : 'SMS OTP Sent 📲',
      `${language === 'bn' ? 'ভেরিফিকেশন কোড' : 'Verification code sent to'} ${countryCode} ${phoneDigits}: ${randomCode}`,
      'success'
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 320, 0.85);
        setSelectedAvatar(compressed);
        setIsCustomPhoto(true);
        showToast(
          language === 'bn' ? 'ছবি যুক্ত হয়েছে ✅' : 'Photo Loaded ✅',
          language === 'bn' ? 'আপনার নিজস্ব প্রোফাইল ছবি সফলভাবে লোড হয়েছে।' : 'Profile photo loaded successfully.',
          'success'
        );
      } catch {
        showToast(
          language === 'bn' ? 'ছবি পড়তে সমস্যা হয়েছে' : 'Photo Load Error',
          language === 'bn' ? 'অনুগ্রহ করে ভিন্ন কোনো ছবি নির্বাচন করুন।' : 'Please choose another photo file.',
          'info'
        );
      } finally {
        if (e.target) e.target.value = '';
      }
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      showToast(
        language === 'bn' ? 'তথ্য প্রয়োজন' : 'Identifier Required',
        language === 'bn' ? 'আপনার নিবন্ধিত ইমেইল, ইউজারনেম বা মোবাইল নম্বর দিন।' : 'Please enter your registered email, username, or phone.',
        'info'
      );
      return;
    }
    if (!forgotNewPassword.trim() || forgotNewPassword.length < 4) {
      showToast(
        language === 'bn' ? 'নতুন পাসওয়ার্ড লিখুন' : 'New Password Required',
        language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' : 'Password must be at least 4 characters long.',
        'info'
      );
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      showToast(
        language === 'bn' ? 'পাসওয়ার্ড মেলেনি' : 'Passwords Mismatch',
        language === 'bn' ? 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড একই হতে হবে।' : 'New password and confirmation do not match.',
        'info'
      );
      return;
    }

    const res = resetPassword(forgotIdentifier, forgotNewPassword);
    if (res.success) {
      setAuthMode('signin');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullPhoneNumber = `${countryCode} ${phoneDigits.trim()}`;

    // SIGN IN FLOW
    if (authMode === 'signin') {
      let identifier = '';
      if (method === 'google') identifier = emailInput.trim();
      else if (method === 'username') identifier = usernameInput.trim();
      else identifier = fullPhoneNumber;

      if (!identifier) {
        showToast(
          language === 'bn' ? 'তথ্য প্রয়োজন' : 'Input Required',
          language === 'bn' ? 'অনুগ্রহ করে ইমেইল, ইউজারনেম বা মোবাইল নম্বর দিন।' : 'Please provide your email, username, or phone number.',
          'info'
        );
        return;
      }

      if (!passwordInput.trim()) {
        showToast(
          language === 'bn' ? 'পাসওয়ার্ড দিন' : 'Password Required',
          language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন।' : 'Please enter your password.',
          'info'
        );
        return;
      }

      loginWithCredentials(method, identifier, passwordInput.trim());
      return;
    }

    // SIGN UP (NEW STUDENT ACCOUNT) FLOW
    if (!fullName.trim() || fullName.trim().length < 2) {
      showToast(
        language === 'bn' ? 'নাম প্রয়োজন' : 'Name Required',
        language === 'bn' ? 'অনুগ্রহ করে শিক্ষার্থীর সম্পূর্ণ নাম লিখুন।' : 'Please enter your full student name.',
        'info'
      );
      return;
    }

    let primaryIdentifier = '';
    if (method === 'google') {
      const cleanEmail = emailInput.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        showToast(
          language === 'bn' ? 'সঠিক ইমেইল প্রয়োজন' : 'Valid Email Required',
          language === 'bn' ? 'একটি সঠিক ইমেইল বা জিমেইল ঠিকানা দিন (যেমন: student@gmail.com)।' : 'Please enter a valid email address (e.g. student@gmail.com).',
          'info'
        );
        return;
      }
      primaryIdentifier = cleanEmail;
    } else if (method === 'username') {
      const cleanUname = usernameInput.trim().replace('@', '').toLowerCase();
      if (!cleanUname || cleanUname.length < 3) {
        showToast(
          language === 'bn' ? 'ইউজারনেম প্রয়োজন' : 'Username Required',
          language === 'bn' ? 'কমপক্ষে ৩ অক্ষরের একটি ক্যাম্পাস ইউজারনেম লিখুন।' : 'Username must be at least 3 characters.',
          'info'
        );
        return;
      }
      primaryIdentifier = cleanUname;
    } else {
      const cleanPhone = phoneDigits.trim();
      if (!cleanPhone || cleanPhone.length < 8) {
        showToast(
          language === 'bn' ? 'মোবাইল নম্বর প্রয়োজন' : 'Phone Required',
          language === 'bn' ? 'অনুগ্রহ করে আপনার সঠিক মোবাইল নম্বরটি লিখুন।' : 'Please enter your valid phone number.',
          'info'
        );
        return;
      }
      primaryIdentifier = fullPhoneNumber;
    }

    if (!passwordInput.trim() || passwordInput.trim().length < 4) {
      showToast(
        language === 'bn' ? 'পাসওয়ার্ড সেট করুন' : 'Password Required',
        language === 'bn' ? 'কমপক্ষে ৪ অক্ষরের একটি নিরাপদ পাসওয়ার্ড লিখুন।' : 'Password must be at least 4 characters long.',
        'info'
      );
      return;
    }

    if (passwordInput.trim() !== confirmPasswordInput.trim()) {
      showToast(
        language === 'bn' ? 'পাসওয়ার্ড মেলেনি' : 'Passwords Do Not Match',
        language === 'bn' ? 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড একই হতে হবে।' : 'Password and confirmation password do not match.',
        'info'
      );
      return;
    }

    const cleanUsername = method === 'username'
      ? usernameInput.trim().replace('@', '').toLowerCase()
      : (emailInput.trim() ? emailInput.trim().split('@')[0].toLowerCase().replace(/\./g, '_') : fullName.toLowerCase().trim().replace(/\s+/g, '_'));

    const cleanEmail = method === 'google'
      ? emailInput.trim().toLowerCase()
      : `${cleanUsername}@gmail.com`;

    const res = createAccount({
      name: fullName.trim(),
      method,
      identifier: primaryIdentifier,
      password: passwordInput.trim(),
      email: cleanEmail,
      username: cleanUsername,
      phone: method === 'phone' ? primaryIdentifier : '+880 1700 998877',
      department,
      semester,
      university: 'Quantum Cosmo School, Lama, Bandarban',
      avatar: selectedAvatar,
      bio: `Quantum Cosmo School SSC 2027 student member (${department}). Dedicated to board exam prep, test papers, and note sharing.`,
      currentStudyFocus: `SSC 2027 ${department.split(' ')[0]} Preparation & Study Squad`,
      interests: [department.split(' ')[0], 'SSC 2027', 'CQ/MCQ Solving', 'Notes Sharing']
    });

    if (res && res.success) {
      setFullName('');
      setEmailInput('');
      setUsernameInput('');
      setPhoneDigits('');
      setPasswordInput('');
      setConfirmPasswordInput('');
    }
  };

  // Quick Demo account loader for instant testing without typing
  const handleCadetDemoLogin = () => {
    switchUserPersona('usr_1');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Top Header Banner (Fixed) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white flex items-center justify-between border-b border-indigo-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center text-white shadow-md shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  {t.appName} {t.campusHub}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {language === 'bn' ? 'নিরাপদ অ্যাকাউন্ট' : 'Secure Access'}
                </span>
              </div>
              <p className="text-xs text-indigo-200/90">
                {authMode === 'signup' 
                  ? (language === 'bn' ? 'জিমেইল, ইউজারনেম বা মোবাইল নম্বর দিয়ে অ্যাকাউন্ট তৈরি করুন' : 'Create student account with Gmail, Username, or Phone') 
                  : authMode === 'forgot'
                  ? (language === 'bn' ? 'পাসওয়ার্ড ভুলে গেলে এখান থেকে দ্রুত রিসেট ও রিকভার করুন' : 'Recover and reset your student password instantly')
                  : (language === 'bn' ? 'নোটস, ট্রেড ও স্টাডি রুমে প্রবেশ করতে সাইন ইন করুন' : 'Sign in to access your notes, trades, and study rooms')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl text-indigo-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Scrollable Form Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
          
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-750">
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.createAccount}</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{t.signIn}</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('forgot')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'forgot'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.forgotPassword}</span>
            </button>
          </div>

          {/* FORGOT PASSWORD SPECIFIC FORM */}
          {authMode === 'forgot' ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার ও রিসেট' : 'Instant Password Recovery & Reset'}</span>
                </p>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80">
                  {language === 'bn' 
                    ? 'আপনার অ্যাকাউন্টের ইমেইল, ইউজারনেম বা ফোন নম্বর দিন এবং সরাসরি নতুন পাসওয়ার্ড সেট করুন।' 
                    : 'Enter your registered email, username, or phone number and define a new secure password.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'ইমেইল / ইউজারনেম / মোবাইল নম্বর' : 'Email / Username / Mobile Phone'} *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="e.g. rakibulislamq1673@gmail.com, rakibul_cse, +8801711223344"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.newPassword} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.confirmPassword} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'bn' ? 'পাসওয়ার্ড রিসেট করুন ও লগইন করুন' : 'Reset Password & Sign In'}</span>
              </button>
            </form>
          ) : (
            <>
              {/* Choice of Signin/Signup Method: Gmail vs Username vs Mobile Phone */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>{authMode === 'signup' ? (language === 'bn' ? 'নিবন্ধন মাধ্যম নির্বাচন করুন:' : 'Choose Signup Method:') : (language === 'bn' ? 'লগইন মাধ্যম নির্বাচন করুন:' : 'Choose Login Method:')}</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{method === 'google' ? 'Gmail / Google' : method === 'username' ? 'Username' : 'Mobile SMS'}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('google')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      method === 'google'
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>{t.gmailGoogle}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('username')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      method === 'username'
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{t.usernameId}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('phone')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      method === 'phone'
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t.mobilePhone}</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* 1. Profile Picture Avatar Selector (PROMINENTLY AT THE TOP OF SIGNUP) */}
                {authMode === 'signup' && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>{language === 'bn' ? 'প্রোফাইল ছবি নির্বাচন করুন' : 'Select Profile Picture'} *</span>
                        </span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {language === 'bn' ? 'ছবি আপলোড করুন অথবা নিচের অ্যাভাটার বেছে নিন' : 'Upload your photo or choose an avatar below'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-105"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'ছবি আপলোড' : 'Upload Photo'}</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Active Selected Photo Preview with Camera overlay */}
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-3 ring-indigo-600 shadow-md cursor-pointer group shrink-0"
                        title={language === 'bn' ? 'ছবি পরিবর্তন করতে ক্লিক করুন' : 'Click to change photo'}
                      >
                        <img
                          src={selectedAvatar}
                          alt="Selected Avatar"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                          <Camera className="w-4 h-4" />
                          <span className="text-[9px] font-bold">{language === 'bn' ? 'বদলান' : 'Edit'}</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {isCustomPhoto 
                              ? (language === 'bn' ? 'নিজস্ব ছবি যুক্ত হয়েছে ✅' : 'Custom Photo Uploaded ✅')
                              : (language === 'bn' ? 'ক্যাম্পাস অ্যাভাটার নির্বাচিত' : 'Preset Avatar Selected')}
                          </span>
                        </div>
                        
                        {/* 6 Quick Preset Avatars */}
                        <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-0.5">
                          {presetAvatars.map((av, idx) => {
                            const isSelected = !isCustomPhoto && selectedAvatar === av.url;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSelectedAvatar(av.url);
                                  setIsCustomPhoto(false);
                                }}
                                className={`relative rounded-full overflow-hidden w-8 h-8 sm:w-9 sm:h-9 border-2 transition-all cursor-pointer shrink-0 ${
                                  isSelected
                                    ? 'border-indigo-600 ring-2 ring-indigo-500 scale-110 shadow-sm'
                                    : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100 hover:scale-105'
                                }`}
                                title={av.label}
                              >
                                <img
                                  src={av.url}
                                  alt={av.label}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white stroke-[3]" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Name for Signup */}
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rakibul Islam"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                    />
                  </div>
                )}

                {/* METHOD 1: GMAIL INPUT */}
                {method === 'google' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'bn' ? 'গুগল / জিমেইল ঠিকানা' : 'Google / Gmail Address'} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="name@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* METHOD 2: USERNAME INPUT */}
                {method === 'username' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'bn' ? 'ক্যাম্পাস ইউজারনেম' : 'Campus Username'} *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">@</span>
                      <input
                        type="text"
                        required
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="rakibul_cse"
                        className="w-full pl-8 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* METHOD 3: MOBILE NUMBER WITH SMS OTP */}
                {method === 'phone' && (
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'bn' ? 'মোবাইল ফোন নম্বর (SMS ভেরিফিকেশনসহ)' : 'Mobile Phone Number (SMS Verified)'} *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2.5 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                      >
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.country}</option>
                        ))}
                      </select>

                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={phoneDigits}
                          onChange={(e) => setPhoneDigits(e.target.value)}
                          placeholder="1711223344"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-mono"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer"
                      >
                        {otpSent ? (language === 'bn' ? 'পুনরায় পাঠান' : 'Resend') : (language === 'bn' ? 'OTP পাঠান' : 'Send OTP')}
                      </button>
                    </div>

                    {otpSent && (
                      <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 animate-fade-in space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200">
                            {language === 'bn' ? '৬-সংখ্যার এসএমএস কোড দিন' : 'Enter 6-Digit SMS Code'}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                            OTP: {generatedOtp}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value)}
                          maxLength={6}
                          placeholder="491823"
                          className="w-full px-3 py-2 text-center text-sm font-mono tracking-widest rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Password Fields */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {authMode === 'signup' ? (language === 'bn' ? 'পাসওয়ার্ড সেট করুন' : 'Set Password') : (language === 'bn' ? 'পাসওয়ার্ড' : 'Password')} *
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        {t.forgotPassword}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.confirmPassword}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Academic Details for Signup */}
                {authMode === 'signup' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {language === 'bn' ? 'বিভাগ / মেজর' : 'Department / Major'}
                        </label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                        >
                          <option value="Science (বিজ্ঞান বিভাগ)">Science (বিজ্ঞান বিভাগ)</option>
                          <option value="Business Studies (ব্যবসায় শিক্ষা)">Business Studies (ব্যবসায় শিক্ষা)</option>
                          <option value="Humanities (মানবিক বিভাগ)">Humanities (মানবিক বিভাগ)</option>
                          <option value="General Science (সাধারণ বিজ্ঞান)">General Science (সাধারণ বিজ্ঞান)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {language === 'bn' ? 'এসএসসি ব্যাচ / শ্রেণি' : 'SSC Batch / Class'}
                        </label>
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                        >
                          <option value="SSC 2027 Batch (Class 10)">SSC 2027 Batch (Class 10)</option>
                          <option value="SSC 2027 Batch (Class 9)">SSC 2027 Batch (Class 9)</option>
                          <option value="SSC 2028 Batch (Class 9)">SSC 2028 Batch (Class 9)</option>
                          <option value="Senior / Alumni Member">Senior / Alumni Member</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Encrypted badge */}
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{language === 'bn' ? 'এনক্রিপ্টেড পিয়ার ভেরিফিকেশনের মাধ্যমে সুরক্ষিত ক্যাম্পাস আইডি।' : 'Campus student identity with encrypted end-to-end peer verification.'}</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {authMode === 'signup' 
                      ? (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন ও যোগ দিন' : 'Create Classmate Account & Join Campus') 
                      : (language === 'bn' ? 'ক্যাম্পাস হাবে সাইন ইন করুন' : 'Sign In to Campus Hub')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* Quick Demo Switcher for Testing Classmate Personas - ONLY IN SIGNIN MODE */}
          {authMode === 'signin' && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'সহপাঠী প্রোফাইল সুইচ করুন:' : 'Quick Classmate Switcher:'}</span>
                </span>
                <span className="text-[10px]">{language === 'bn' ? 'যেকোনো সহপাঠীতে ক্লিক করুন' : 'Click any classmate'}</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={handleCadetDemoLogin}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold shrink-0 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                >
                  <img src={rakibulAvatar} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-indigo-500" />
                  <span>Rakibul (Cadet)</span>
                </button>
                {users.filter(u => u.id !== 'usr_1').slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      switchUserPersona(u.id);
                      setIsAuthModalOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-800 dark:text-slate-200 text-xs font-semibold shrink-0 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span>{u.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
