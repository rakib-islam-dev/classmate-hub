import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  FolderLock, 
  Film, 
  MessageSquare, 
  ArrowRight, 
  Gamepad2, 
  Newspaper, 
  HelpCircle, 
  UserPlus, 
  Search,
  Award,
  CheckCircle2
} from 'lucide-react';

export const WelcomeView: React.FC = () => {
  const { 
    setActiveTab, 
    isLoggedIn,
    currentUser,
    setIsAuthModalOpen, 
    setIsHelpModalOpen, 
    setIsGoogleSearchOpen, 
    language, 
    appLogo, 
    campusPhoto, 
    users, 
    reels, 
    personalDriveItems,
    posts 
  } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-indigo-200 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-white transition-colors">
        {/* Background Image with Ambient Glow */}
        <div className="absolute inset-0 z-0">
          <img 
            src={campusPhoto} 
            alt="Quantum Cosmo School Campus" 
            className="w-full h-full object-cover opacity-15 dark:opacity-25 scale-105 transform filter blur-[1px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/20 rounded-full filter blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 md:p-12 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={appLogo} 
                alt="Quantum Cosmo School Emblem" 
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-400/50 shadow-lg shadow-indigo-500/30 bg-white dark:bg-slate-900"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-400/20">
                    Official Batch Platform
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Secured
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight">
                  Quantum Cosmo School, Lama, Bandarban
                </h2>
              </div>
            </div>

            {/* SSC 2027 Badge */}
            <div className="px-4 py-2 rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 text-right shadow-xs">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-300">Target Session</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                SSC 2027 BATCH
              </p>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-indigo-950 via-indigo-800 to-violet-900 dark:from-white dark:via-indigo-100 dark:to-indigo-300 bg-clip-text text-transparent">
              {language === 'bn' 
                ? 'কোয়ান্টাম কসমো স্কুল SSC 2027 ব্যাচের নিজস্ব স্মার্ট ক্যাম্পাস প্ল্যাটফর্মে স্বাগতম! 🌟' 
                : 'Welcome to Quantum Cosmo School SSC 2027 Official Campus Hub! 🌟'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'আমাদের ব্যাচের সকল সহপাঠীদের জন্য একসাথে পড়ালেখা, ব্যক্তিগত ক্লাউড ড্রাইভ, ক্যাম্পাস রিলস, গ্রুপ চ্যাট, অডিও/ভিডিও স্টাডি রুম এবং নোটস শেয়ারিংয়ের সমন্বিত হাব।'
                : 'A dedicated all-in-one digital campus for SSC 2027 students. Access your personal drive, school reels, encrypted squad chats, live study rooms, and exam preparation.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-sm shadow-xl shadow-indigo-600/40 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>{language === 'bn' ? 'লগইন / নতুন অ্যাকাউন্ট খুলুন 🚀' : 'Login / Register 🚀'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-sm border border-slate-300 dark:border-white/20 shadow-xs backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>{language === 'bn' ? 'ক্যাম্পাসে প্রবেশ করুন' : 'Enter Campus'}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/40 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>{language === 'bn' ? `ক্যাম্পাসে চলুন, ${currentUser.name.split(' ')[0]}!` : `Enter Campus (${currentUser.name.split(' ')[0]})`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('drive')}
                  className="px-5 py-3 rounded-2xl bg-emerald-600/10 dark:bg-emerald-600/30 hover:bg-emerald-600/20 dark:hover:bg-emerald-600/40 text-emerald-800 dark:text-emerald-300 font-bold text-sm border border-emerald-500/30 dark:border-emerald-500/40 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FolderLock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{language === 'bn' ? 'আমার পার্সোনাল ড্রাইভ' : 'My Personal Drive'}</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setIsAuthModalOpen(true);
                } else {
                  setActiveTab('reels');
                }
              }}
              className="px-5 py-3 rounded-2xl bg-rose-600/10 dark:bg-rose-600/20 hover:bg-rose-600/20 dark:hover:bg-rose-600/30 text-rose-800 dark:text-rose-300 font-bold text-sm border border-rose-500/30 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Film className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span>{language === 'bn' ? 'ক্যাম্পাস রিলস' : 'Campus Reels'}</span>
            </button>
          </div>

          {/* Guest Auth Notice if not logged in */}
          {!isLoggedIn && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-ping" />
                <span>
                  {language === 'bn' 
                    ? '🔒 নিরাপত্তা নোটিশ: স্কুলের অভ্যন্তরীণ ড্রাইভ, রিলস, চ্যাট এবং অ্যাকাডেমিক ফিচারে প্রবেশের জন্য লগইন বা রেজিস্ট্রেশন বাধ্যতামূলক।' 
                    : '🔒 Security Note: Login or Registration is strictly required to access internal campus drive, reels, squads & notes.'}
                </span>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-xs"
              >
                {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
              </button>
            </div>
          )}

          {/* Live Batch Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-white/5 backdrop-blur-xs border border-slate-200 dark:border-white/10 shadow-xs">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{language === 'bn' ? 'নিবন্ধিত সহপাঠী' : 'Batch Classmates'}</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{users.length} {language === 'bn' ? 'জন' : 'Students'}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-white/5 backdrop-blur-xs border border-slate-200 dark:border-white/10 shadow-xs">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{language === 'bn' ? 'শেয়ার্ড ড্রাইভ ও ফাইল' : 'Vault Files'}</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{personalDriveItems.length + 18} {language === 'bn' ? 'টি' : 'Files'}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-white/5 backdrop-blur-xs border border-slate-200 dark:border-white/10 shadow-xs">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{language === 'bn' ? 'ক্যাম্পাস রিলস' : 'Batch Reels'}</p>
              <p className="text-lg font-black text-rose-600 dark:text-rose-400">{reels.length} {language === 'bn' ? 'টি ভিডিও' : 'Reels'}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-white/5 backdrop-blur-xs border border-slate-200 dark:border-white/10 shadow-xs">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{language === 'bn' ? 'পড়ালেখার পোস্ট' : 'Discussions'}</p>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-300">{posts.length} {language === 'bn' ? 'টি' : 'Posts'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Modules Navigation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {language === 'bn' ? 'আমাদের বিশেষ মডিউলসমূহ' : 'Special Batch Modules'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'SSC 2027 ব্যাচের জন্য তৈরি প্রতিটি সুবিধায় সরাসরি প্রবেশ করুন' : 'Quick access to all batch tools'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Personal Drive */}
          <div 
            onClick={() => setActiveTab('drive')}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderLock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{language === 'bn' ? '১. পার্সোনাল ড্রাইভ' : '1. Personal Drive'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Cloud Storage
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'bn' 
                  ? 'আপনার ব্যক্তিগত ছবি, ভিডিও, ক্লাস নোটস এবং দরকারি ফাইল সুরক্ষিতভাবে সংরক্ষণ করুন।' 
                  : 'Store your personal pictures, study videos, documents and notes securely.'}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>{language === 'bn' ? 'ড্রাইভ খুলুন' : 'Open Drive'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. School Reels */}
          <div 
            onClick={() => setActiveTab('reels')}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 dark:hover:border-rose-500 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{language === 'bn' ? '২. ক্যাম্পাস রিলস' : '2. Campus Reels'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  Video Feed
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'bn' 
                  ? 'স্কুলের স্মৃতি, স্পোর্টস, বিজ্ঞান প্রজেক্ট এবং শর্ট ভিডিও রিলস দেখুন ও আপলোড করুন।' 
                  : 'Watch and share campus reels, sports moments, science projects & short videos.'}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>{language === 'bn' ? 'রিলস দেখুন' : 'Watch Reels'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Educational News & Auto Updates */}
          <div 
            onClick={() => setActiveTab('edu_news')}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Newspaper className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{language === 'bn' ? '৩. শিক্ষামূলক খবর ও টিপস' : '3. Daily Edu Updates'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  SSC 2027
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'bn' 
                  ? 'SSC 2027 স্পেশাল সাজেশন্স, বিজ্ঞান ও উচ্চতর গণিতের সমাধান এবং শিক্ষামূলক সংবাদ।' 
                  : 'SSC 2027 exam suggestions, model tests, science tips, and auto updates.'}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>{language === 'bn' ? 'খবর পড়ুন' : 'Read Updates'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Study Squads & Chathub */}
          <div 
            onClick={() => setActiveTab('messages')}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{language === 'bn' ? '৪. স্টাডি গ্রুপ ও মেসেজিং' : '4. Study Squads'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  E2E Encrypted
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'bn' 
                  ? 'নিজের গ্রুপ তৈরি করুন, সহপাঠী যোগ বা বাদ দিন এবং ভয়েস মেসেজ ও ফাইল পাঠান।' 
                  : 'Create custom study channels, invite batchmates, and send voice notes.'}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>{language === 'bn' ? 'চ্যাট শুরু করুন' : 'Open Messages'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Study Games & Truth or Dare */}
          <div 
            onClick={() => setActiveTab('games')}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{language === 'bn' ? '৫. ট্রুথ অর ডেয়ার ও গেমস' : '5. Batch Games'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Fun & Bonding
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'bn' 
                  ? 'সহপাঠীদের সাথে ট্রুথ অর ডেয়ার গেম এবং SSC কুইজ খেলে পড়ালেখার ক্লান্তি দূর করুন।' 
                  : 'Play interactive Truth or Dare challenges and SSC quizzes with classmates.'}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>{language === 'bn' ? 'গেম খেলুন' : 'Play Games'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Help Desk & Password Recovery */}
          <div 
            onClick={() => setIsHelpModalOpen(true)}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{language === 'bn' ? '৬. হেল্প ডেস্ক ও পাসওয়ার্ড হেল্প' : '6. Help & Recovery'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                  24/7 Support
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'bn' 
                  ? 'পাসওয়ার্ড ভুলে গেলে বা কোনো সমস্যা হলে সরাসরি অ্যাডমিনের কাছে ভয়েস বা টেক্সট টিকিট পাঠান।' 
                  : 'Forgot password or need help? Submit a voice or text support ticket to the admin.'}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <span>{language === 'bn' ? 'সহায়তা নিন' : 'Get Help'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Direct In-App Google Search Tool */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
            <Search className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'গুগল সার্চ ও স্টাডি অ্যাসিস্ট্যান্ট' : 'In-App Google Search'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            {language === 'bn' ? 'পড়ালেখার যেকোনো বিষয় সরাসরি অ্যাপের ভেতরে সার্চ করুন' : 'Search any topic or question directly within the app'}
          </h3>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
            {language === 'bn' 
              ? 'এনসিটিবি বইয়ের বিষয়, বিজ্ঞান ও সাধারণ জ্ঞানের যেকোনো তথ্য এক ক্লিকে খুঁজুন।' 
              : 'Quickly look up SSC definitions, formulas, and study resources without leaving the platform.'}
          </p>
        </div>
        <button
          onClick={() => setIsGoogleSearchOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-sm shadow-lg hover:bg-indigo-50 transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Search className="w-4 h-4 text-indigo-600" />
          <span>{language === 'bn' ? 'সার্চ ওপেন করুন' : 'Open Search'}</span>
        </button>
      </div>

      {/* Quantum Cosmo School Batch Pledge */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <Award className="w-4 h-4" />
          <span>{language === 'bn' ? 'আমাদের লক্ষ্য' : 'Our Batch Mission'}</span>
        </div>
        <h4 className="text-lg font-black text-slate-900 dark:text-white">
          {language === 'bn' ? 'SSC 2027 ব্যাচ: শতভাগ জিপিএ ৫.০০ ও দেশসেরা ফলাফল' : 'SSC 2027: 100% GPA 5.00 & Excellence'}
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {language === 'bn'
            ? 'কোয়ান্টাম কসমো স্কুলের একতা, শৃঙ্খলা ও নৈতিকতা ধারণ করে আমরা প্রত্যেকে একে অপরকে পড়ালেখায় সাহায্য করব এবং একসাথে সাফল্যের চূড়ায় পৌঁছাব।'
            : 'United by discipline, moral values, and hard work, we support each other to reach the peak of academic success.'}
        </p>
      </div>
    </div>
  );
};
