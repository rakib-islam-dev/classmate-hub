import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import { 
  ShoppingBag, 
  MessageSquare, 
  Users, 
  FolderLock, 
  Compass, 
  User, 
  PhoneCall, 
  Video,
  Lock,
  Trees,
  Maximize2,
  Upload,
  Crown,
  Sparkles,
  Film,
  HardDrive,
  Newspaper,
  Gamepad2
} from 'lucide-react';
import { CampusPhotoModal } from './CampusPhotoModal';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    users, 
    startCall, 
    campusPhoto, 
    t, 
    language, 
    isSuperAdmin
  } = useApp();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const onlineClassmatesCount = users.filter(u => u.status === 'online' || u.status === 'studying').length;

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'welcome', label: language === 'bn' ? 'স্বাগতম পোর্টাল' : 'Welcome Portal', icon: Sparkles },
    { id: 'drive', label: language === 'bn' ? 'পার্সোনাল ড্রাইভ' : 'Personal Drive', icon: HardDrive },
    { id: 'reels', label: language === 'bn' ? 'ক্যাম্পাস রিলস' : 'Campus Reels', icon: Film, badge: 'Hot' },
    { id: 'edu_news', label: language === 'bn' ? 'শিক্ষামূলক সংবাদ' : 'SSC 2027 News', icon: Newspaper },
    { id: 'games', label: language === 'bn' ? 'ট্রুথ অর ডেয়ার' : 'Truth / Dare Games', icon: Gamepad2 },
    { id: 'feed', label: t.feed, icon: Compass },
    { id: 'messages', label: t.messages, icon: MessageSquare },
    { id: 'classmates', label: t.classmates, icon: Users, badge: `${onlineClassmatesCount}` },
    { id: 'files', label: t.vault, icon: FolderLock },
    { id: 'marketplace', label: t.marketplace, icon: ShoppingBag },
    { id: 'admin', label: t.admin || 'অ্যাডমিন প্যানেল', icon: Crown, badge: isSuperAdmin ? '👑 Super' : 'Admin' },
    { id: 'profile', label: t.profile, icon: User },
  ];

  return (
    <>
      {/* Desktop Left Navigation Bar */}
      <aside className="w-64 shrink-0 h-full hidden md:flex flex-col justify-between p-4 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-y-auto">
        
        <div className="space-y-4">
          <div className="px-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {language === 'bn' ? 'একাডেমিক মডিউল' : 'Academic Modules'}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Study Call Launcher */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <PhoneCall className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold">{t.instantStudyRoom}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              {language === 'bn' 
                ? 'এক ক্লিকে সহপাঠীদের সাথে এইচডি অডিও বা ভিডিও স্টাডি কল চালু করুন।' 
                : 'Instant group HD audio or video study call with interactive notes.'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => startCall('CSE & Math Voice Squad', 'audio', true, 'CSE 311', ['usr_1', 'usr_2', 'usr_3'])}
                className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>{language === 'bn' ? 'অডিও কল' : 'Audio Call'}</span>
              </button>
              <button
                onClick={() => startCall('CSE 311 Final Revision Room', 'video', true, 'CSE 311', ['usr_1', 'usr_2', 'usr_3'])}
                className="py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Video className="w-3 h-3" />
                <span>{language === 'bn' ? 'ভিডিও রুম' : 'Video Room'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Campus Photo Preview & E2E Security Badge */}
        <div className="space-y-2.5 pt-3">
          <div 
            onClick={() => setIsPhotoModalOpen(true)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-emerald-300/40 dark:border-emerald-800/40 shadow-xs hover:shadow-md transition-all"
            title={language === 'bn' ? 'আমাদের স্কুলের ছবি ও ল্যান্ডমার্ক দেখুন বা আসল ছবি আপলোড করুন' : 'View or upload our real school photograph'}
          >
            <img 
              src={campusPhoto} 
              alt="Our School Campus" 
              referrerPolicy="no-referrer"
              className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent p-2.5 flex flex-col justify-between">
              <span className="self-start text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/90 text-white backdrop-blur-xs flex items-center gap-1">
                <Trees className="w-2.5 h-2.5" /> 
                <span>{t.ourSchoolPicture}</span>
              </span>
              <div className="flex items-center justify-between text-white">
                <span className="text-[10px] font-bold flex items-center gap-1">
                  <Upload className="w-2.5 h-2.5" />
                  <span>{language === 'bn' ? 'ছবি দেখুন / পরিবর্তন' : 'View / Change Photo'}</span>
                </span>
                <Maximize2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-white" />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'bn' ? 'নিরাপদ এনক্রিপ্টেড হাব' : 'End-to-End Encrypted'}</span>
            </div>
            <p className="text-[10px] leading-tight">
              {language === 'bn'
                ? 'ক্লাসের সকল চ্যাট, ছবি ও নোটস সুরক্ষিত ও ভেরিফায়েড।'
                : 'Peer chats, photos & notes are securely verified.'}
            </p>
          </div>
        </div>

      </aside>

      <CampusPhotoModal 
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 py-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 truncate max-w-[60px]">{item.label.split(' ')[0]}</span>
              {item.badge && typeof item.badge === 'number' && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
