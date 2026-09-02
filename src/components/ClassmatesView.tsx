import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, AcademicStatus } from '../types';
import { 
  Search, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  Video,
  Phone,
  UserPlus
} from 'lucide-react';

export const ClassmatesView: React.FC = () => {
  const { users, currentUser, setActiveChatTarget, setActiveTab, startCall, setIsAuthModalOpen, t, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.currentStudyFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AcademicStatus) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{language === 'bn' ? 'অনলাইন' : 'Online'}</span>
          </span>
        );
      case 'studying':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{language === 'bn' ? 'পড়াশোনায় ব্যস্ত' : 'Studying'}</span>
          </span>
        );
      case 'in_call':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>{language === 'bn' ? 'কলে আছেন' : 'In Call'}</span>
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>{language === 'bn' ? 'ক্লাসে আছেন' : 'In Class'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {language === 'bn' ? 'অফলাইন' : 'Offline'}
          </span>
        );
    }
  };

  const handleStartDirectChat = (user: User) => {
    if (user.id === currentUser.id) return;
    setActiveChatTarget({ type: 'direct', id: user.id });
    setActiveTab('messages');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
            {language === 'bn' ? `ক্যাম্পাস ডিরেক্টরি (${users.length} জন সহপাঠী)` : `Campus Directory & Study Squads (${users.length} Classmates)`}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1.5">
            {t.classmatesHeader}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {t.classmatesSub}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-center shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.register}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'নাম, বিভাগ বা স্টাডি ফোকাস দিয়ে খুঁজুন...' : 'Search classmates by name, major, course focus, or tags...'}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-900 dark:text-white outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {['All', 'online', 'studying', 'in_call'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {st === 'online' ? (language === 'bn' ? '🟢 অনলাইন' : '🟢 Online') :
                 st === 'studying' ? (language === 'bn' ? '🟡 পড়াশোনায়' : '🟡 Studying') :
                 st === 'in_call' ? (language === 'bn' ? '🟣 গ্রুপ কলে' : '🟣 In Call') : 
                 (language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Classmates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => {
          const isMe = user.id === currentUser.id;

          return (
            <div
              key={user.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-4 ${
                isMe 
                  ? 'border-indigo-400 dark:border-indigo-700 ring-2 ring-indigo-500/20' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                
                {/* User Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30" />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                        user.status === 'online' ? 'bg-emerald-500' :
                        user.status === 'studying' ? 'bg-amber-500' :
                        user.status === 'in_call' ? 'bg-indigo-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</h3>
                        {user.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.department}</p>
                      <p className="text-[11px] text-slate-400">{user.semester} • CGPA {user.cgpa}</p>
                    </div>
                  </div>

                  {getStatusBadge(user.status)}
                </div>

                {/* Live Focus Box */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                    {language === 'bn' ? 'লাইভ স্টাডি ফোকাস' : 'Live Study Focus'}
                  </span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                    {user.currentStudyFocus}
                  </p>
                </div>

                {/* Interests */}
                <div className="flex flex-wrap gap-1">
                  {user.interests.map((int, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {int}
                    </span>
                  ))}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{user.rating.toFixed(1)} ({user.tradesCompleted} {language === 'bn' ? 'বিনিময়' : 'trades'})</span>
                </div>

                {!isMe ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startCall(`Audio Study Call with ${user.name}`, 'audio', false, 'Voice Study', [user.id])}
                      className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                      title={t.startAudioCall}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => startCall(`Video Study Room with ${user.name}`, 'video', false, 'Study Session', [user.id])}
                      className="p-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                      title={t.startVideoCall}
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStartDirectChat(user)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>{language === 'bn' ? 'মেসেজ' : 'Chat'}</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {language === 'bn' ? 'আপনার সক্রিয় প্রোফাইল' : 'Your Active Profile'}
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
