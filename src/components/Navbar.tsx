import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  ShieldCheck, 
  ChevronDown,
  Trees,
  Languages,
  Sparkles,
  HelpCircle,
  Search,
  LogIn,
  LogOut,
  UserCheck,
  Wifi
} from 'lucide-react';
import { CampusPhotoModal } from './CampusPhotoModal';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    isLoggedIn,
    logout,
    isDarkMode, 
    toggleDarkMode, 
    language,
    toggleLanguage,
    t,
    setIsAuthModalOpen, 
    users, 
    switchUserPersona, 
    setActiveTab, 
    activeCall,
    setIsCallModalOpen,
    appLogo,
    setIsHelpModalOpen,
    setIsGoogleSearchOpen
  } = useApp();

  const [isCampusPhotoOpen, setIsCampusPhotoOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand & Logo (Admin can customize appLogo) */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" onClick={() => setActiveTab('welcome')}>
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
              {appLogo ? (
                <img src={appLogo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <GraduationCap className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                  SSC 2027
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" title="Connected to Real-time Internet Cloud Database">
                  <Wifi className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">LIVE</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                Quantum Cosmo School • ক্লাউড নেটওয়ার্ক
              </p>
            </div>
          </div>

          {/* Global Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Google Study Search trigger */}
            <button
              onClick={() => setIsGoogleSearchOpen(true)}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title={language === 'bn' ? 'গুগল স্টাডি সার্চ' : 'Google Study Search'}
            >
              <Search className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'bn' ? 'গুগল সার্চ' : 'Search'}</span>
            </button>

            {/* Help / Password Recovery Modal trigger */}
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl border border-cyan-200 dark:border-cyan-900 bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 text-cyan-700 dark:text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title={language === 'bn' ? 'হেল্প ডেস্ক ও পাসওয়ার্ড সহায়তা' : 'Help & Support Desk'}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
              <span className="hidden sm:inline">{language === 'bn' ? 'সহায়তা' : 'Help'}</span>
            </button>

            {/* Campus Aerial Photo Button */}
            <button
              onClick={() => setIsCampusPhotoOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title={language === 'bn' ? 'আমাদের স্কুলের ছবি ও ল্যান্ডমার্ক দেখুন / আপলোড করুন' : 'View or upload our school campus photograph'}
            >
              <Trees className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">{t.ourSchoolPicture}</span>
            </button>

            {/* Active Call Indicator if call is ongoing */}
            {activeCall && (
              <button
                onClick={() => setIsCallModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold animate-pulse hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="hidden sm:inline">{t.liveCallActive}</span>
              </button>
            )}

            {/* Language Switcher: Bangla বাংলা <-> English */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/80 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title={language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
            >
              <Languages className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
              title={isDarkMode ? (language === 'bn' ? 'লাইট মোডে পরিবর্তন করুন' : 'Switch to Light Mode') : (language === 'bn' ? 'ডার্ক মোডে পরিবর্তন করুন' : 'Switch to Dark Mode')}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* User Profile or Guest Login/Register Button */}
            {!isLoggedIn ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === 'bn' ? 'লগইন / রেজিস্টার' : 'Login / Register'}</span>
              </button>
            ) : (
              <div className="relative group">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50 dark:bg-slate-850 transition-all text-left cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                      currentUser.status === 'online' ? 'bg-emerald-500' :
                      currentUser.status === 'studying' ? 'bg-amber-500' :
                      currentUser.status === 'in_call' ? 'bg-indigo-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{currentUser.name}</span>
                      {currentUser.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block line-clamp-1">{currentUser.department.split(' ')[0]}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Quick Persona Dropdown Menu on hover/focus */}
                <div className="absolute right-0 top-full mt-1.5 w-64 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.academicProfile}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-0.5">
                        <UserCheck className="w-2.5 h-2.5" /> Logged In
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">{t.quickSwitch}</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => switchUserPersona(u.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                          u.id === currentUser.id 
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div className="truncate flex-1">
                          <span className="block truncate">{u.name}</span>
                          <span className="text-[10px] text-slate-400">{u.department.split(' ')[0]}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'অন্য অ্যাকাউন্ট যুক্ত করুন' : t.createAccount}</span>
                    </button>

                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </header>

      <CampusPhotoModal
        isOpen={isCampusPhotoOpen}
        onClose={() => setIsCampusPhotoOpen(false)}
      />
    </>
  );
};
