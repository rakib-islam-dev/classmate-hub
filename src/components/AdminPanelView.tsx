import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, User } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Crown, 
  Trash2, 
  Ban, 
  Megaphone, 
  ShoppingBag, 
  MessageSquare, 
  FolderLock, 
  Search, 
  Plus, 
  CheckCircle2, 
  Settings, 
  History, 
  Lock, 
  Radio,
  Sliders,
  X,
  KeyRound,
  HelpCircle
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    promoteUser, 
    deleteUser, 
    banUser, 
    toggleUserVerification,
    adminResetUserPassword,
    resetPassword,
    helpTickets,
    resolveHelpTicket,
    marketplaceItems, 
    deleteMarketplaceItem, 
    posts, 
    deleteDiscussionPost, 
    channels, 
    deleteChannel, 
    createGroupChannel,
    sharedFiles, 
    deleteSharedFile, 
    systemSettings, 
    updateSystemSettings, 
    auditLogs, 
    clearAuditLogs,
    isSuperAdmin,
    language
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'tickets' | 'marketplace' | 'feed' | 'channels' | 'vault' | 'settings' | 'logs'>('users');
  const [ticketReplyText, setTicketReplyText] = useState<{ [id: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'super_admin' | 'admin' | 'moderator' | 'student'>('all');
  
  // Broadcast Announcement State
  const [announcementText, setAnnouncementText] = useState(systemSettings.announcement || '');
  
  // New Channel Modal State
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [newChanName, setNewChanName] = useState('');
  const [newChanCourse, setNewChanCourse] = useState('');
  const [newChanDept, setNewChanDept] = useState('Computer Science & Engineering');
  const [newChanDesc, setNewChanDesc] = useState('');

  // New Student/Admin modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDept, setNewUserDept] = useState('Computer Science & Engineering');
  const [newUserRole, setNewUserRole] = useState<UserRole>('admin');

  // Filtered Users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (roleFilter === 'all') return true;
    if (roleFilter === 'super_admin') return user.role === 'super_admin' || user.id === 'usr_1';
    return user.role === roleFilter;
  });

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({ announcement: announcementText.trim() ? announcementText.trim() : null });
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanName.trim() || !newChanCourse.trim()) return;
    createGroupChannel({
      name: newChanName.trim(),
      courseCode: newChanCourse.trim().toUpperCase(),
      department: newChanDept,
      description: newChanDesc.trim() || undefined
    });
    setNewChanName('');
    setNewChanCourse('');
    setNewChanDesc('');
    setShowChannelModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner / Master Super Admin Identity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-indigo-800/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-52 h-52 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black tracking-wider uppercase shadow-inner">
              <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{language === 'bn' ? 'মাস্টার রুট অ্যাডমিন কন্ট্রোল' : 'Master Root Admin Dashboard'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {language === 'bn' ? 'সুপার অ্যাডমিন ও ক্যাম্পাস কমান্ড সেন্টার' : 'Super Admin & Campus Command Center'}
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {language === 'bn' 
                ? 'এখান থেকে আপনি অ্যাপের সমস্ত ব্যবহারকারী, রোল, নোটস মার্কেটপ্লেস, আলোচনা ফিড, চ্যানেল এবং কেন্দ্রীয় সেটিংস সম্পূর্ণ নিয়ন্ত্রণ করতে পারবেন।' 
                : 'Central authority interface to govern users, assign/revoke admin roles, moderate marketplace listings, manage study channels, and broadcast campus announcements.'}
            </p>

            {/* Immunity Guarantee Notification Box */}
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3 max-w-2xl">
              <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <span className="font-bold text-amber-300">
                  {language === 'bn' ? 'চিরস্থায়ী সুপার অ্যাডমিন সুরক্ষা নীতি: ' : 'Permanent Root Immunity Policy: '}
                </span>
                {language === 'bn' 
                  ? 'প্ল্যাটফর্মের প্রতিষ্ঠাতা ও প্রধান সুপার অ্যাডমিন রকিবুল ইসলামকে (Rakibul Islam) কোনো অ্যাডমিন বা ইউজার ডিমোট, রিমুভ, বা ব্যান করতে পারবে না।' 
                  : 'Founder & Super Admin Rakibul Islam holds permanent immortal root authority. No user or sub-admin can revoke his privileges or remove his account.'}
              </div>
            </div>
          </div>

          {/* Quick Admin Profile Pill */}
          <div className="shrink-0 bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 flex items-center gap-3.5 shadow-xl">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/80 shadow-md"
              />
              <span className="absolute -top-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow">
                <Crown className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-white text-sm sm:text-base">{currentUser.name}</h4>
              </div>
              <p className="text-xs text-amber-300 font-semibold font-mono">{currentUser.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {isSuperAdmin ? '👑 Super Admin (সর্বেসর্বা)' : '🛡️ Admin'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Hub Statistics Meter */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" />
              {language === 'bn' ? 'মোট শিক্ষার্থী' : 'Total Students'}
            </span>
            <p className="text-lg sm:text-xl font-black text-white mt-1">{users.length}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              {language === 'bn' ? 'অ্যাডমিন বৃন্দ' : 'Admins & Staff'}
            </span>
            <p className="text-lg sm:text-xl font-black text-amber-300 mt-1">
              {users.filter(u => u.role === 'admin' || u.role === 'super_admin' || u.id === 'usr_1').length}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-emerald-400" />
              {language === 'bn' ? 'মার্কেট আইটেম' : 'Market Items'}
            </span>
            <p className="text-lg sm:text-xl font-black text-white mt-1">{marketplaceItems.length}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-cyan-400" />
              {language === 'bn' ? 'ফিড পোস্টস' : 'Feed Posts'}
            </span>
            <p className="text-lg sm:text-xl font-black text-white mt-1">{posts.length}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Radio className="w-3 h-3 text-purple-400" />
              {language === 'bn' ? 'স্টাডি চ্যানেল' : 'Study Channels'}
            </span>
            <p className="text-lg sm:text-xl font-black text-white mt-1">{channels.length}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <FolderLock className="w-3 h-3 text-rose-400" />
              {language === 'bn' ? 'ভল্ট ফাইলস' : 'Vault Files'}
            </span>
            <p className="text-lg sm:text-xl font-black text-white mt-1">{sharedFiles.length}</p>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer ${
            activeAdminTab === 'users'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{language === 'bn' ? 'ব্যবহারকারী ও রোল ম্যানেজমেন্ট' : 'User Governance & Roles'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer ${
            activeAdminTab === 'tickets'
              ? 'bg-amber-600 text-white shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>{language === 'bn' ? 'হেল্প ও পাসওয়ার্ড টিকিট' : 'Help & Password Tickets'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black">
            {helpTickets.filter(t => t.status === 'open').length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('marketplace')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer ${
            activeAdminTab === 'marketplace'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{language === 'bn' ? 'মার্কেটপ্লেস লিস্টিং' : 'Marketplace Moderation'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('feed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer ${
            activeAdminTab === 'feed'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'bn' ? 'ক্যাম্পাস পোস্ট ও আলোচনা' : 'Feed Discussions'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('channels')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer ${
            activeAdminTab === 'channels'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>{language === 'bn' ? 'স্টাডি চ্যানেল হাব' : 'Channels Control'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('vault')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer ${
            activeAdminTab === 'vault'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <FolderLock className="w-4 h-4" />
          <span>{language === 'bn' ? 'ভল্ট ফাইলস' : 'Cloud Vault Files'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer ${
            activeAdminTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{language === 'bn' ? 'সিস্টেম ঘোষণা ও সেটিংস' : 'Broadcast & Settings'}</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs cursor-pointer ${
            activeAdminTab === 'logs'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{language === 'bn' ? 'অডিট লগ' : 'Audit Logs'}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black">
            {auditLogs.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: USERS & ROLE GOVERNANCE */}
      {/* ========================================================================= */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'নাম, ইমেইল বা ডিপার্টমেন্ট লিখে খুঁজুন...' : 'Search student name, email, or dept...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm outline-hidden border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as typeof roleFilter)}
                className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-hidden"
              >
                <option value="all">{language === 'bn' ? 'সকল রোল (All)' : 'All Roles'}</option>
                <option value="super_admin">👑 Super Admin</option>
                <option value="admin">🛡️ Admin</option>
                <option value="moderator">🔹 Moderator</option>
                <option value="student">🎓 Student</option>
              </select>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন অ্যাডমিন/ইউজার' : 'Add User/Admin'}</span>
              </button>
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map(user => {
              const isImmortal = user.id === 'usr_1' || Boolean(user.isImmortalSuperAdmin);

              return (
                <div
                  key={user.id}
                  className={`rounded-3xl p-5 bg-white dark:bg-slate-900 border transition-all shadow-sm flex flex-col justify-between ${
                    isImmortal 
                      ? 'border-amber-500/70 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent shadow-amber-500/5 ring-1 ring-amber-500/20' 
                      : user.isBanned 
                      ? 'border-rose-500/50 bg-rose-500/5' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-14 h-14 rounded-2xl object-cover ring-2 ${
                          isImmortal ? 'ring-amber-400' : 'ring-slate-300 dark:ring-slate-700'
                        }`}
                      />
                      {isImmortal && (
                        <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                          <Crown className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {user.name}
                        </h4>
                        
                        {/* Role Badge */}
                        {isImmortal ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <Crown className="w-2.5 h-2.5" />
                            <span>Super Admin (প্রতিষ্ঠাতা)</span>
                          </span>
                        ) : user.role === 'admin' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40">
                            🛡️ Admin (অ্যাডমিন)
                          </span>
                        ) : user.role === 'moderator' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40">
                            🔹 Moderator
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            🎓 Student
                          </span>
                        )}

                        {user.isBanned && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                            🚫 Banned
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                        {user.email} {user.phone ? `• ${user.phone}` : ''}
                      </p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5 truncate">
                        {user.department} ({user.semester})
                      </p>
                    </div>
                  </div>

                  {/* Actions & Role Toggles */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    
                    {/* Role Control Dropdown / Button Group */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-500 font-bold">
                        {language === 'bn' ? 'রোল:' : 'Role:'}
                      </span>
                      
                      {isImmortal ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 text-[11px] font-black" title="Permanent Immortal Founder Authority">
                          <Lock className="w-3 h-3 text-amber-500" />
                          <span>{language === 'bn' ? 'স্থায়ী সুপার অ্যাডমিন (পরিবর্তন অসম্ভব)' : 'Immortal Super Admin (Locked)'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => promoteUser(user.id, 'admin')}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              user.role === 'admin'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                            }`}
                            title="Promote user to Admin"
                          >
                            Admin
                          </button>

                          <button
                            onClick={() => promoteUser(user.id, 'moderator')}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              user.role === 'moderator'
                                ? 'bg-cyan-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/50'
                            }`}
                            title="Promote user to Moderator"
                          >
                            Moderator
                          </button>

                          <button
                            onClick={() => promoteUser(user.id, 'student')}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              (!user.role || user.role === 'student')
                                ? 'bg-slate-700 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                            title="Demote to Student"
                          >
                            Student
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Secondary Mod & Security Controls */}
                    <div className="flex items-center gap-1.5">
                      
                      {/* Verification Toggle */}
                      <button
                        onClick={() => toggleUserVerification(user.id)}
                        className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                          user.verified 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                        }`}
                        title={user.verified ? 'Verified Student Badge (Active)' : 'Grant Verified Badge'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      {/* Ban / Unban Button */}
                      {!isImmortal && (
                        <button
                          onClick={() => banUser(user.id, !user.isBanned)}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            user.isBanned 
                              ? 'bg-rose-600 text-white shadow-xs' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                          }`}
                          title={user.isBanned ? 'Unban User' : 'Ban User from Platform'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}

                      {/* Password Reset by Admin via Firebase Auth */}
                      <button
                        onClick={async () => {
                          const confirmReset = window.confirm(
                            language === 'bn'
                              ? `${user.name} (${user.email})-এর জন্য অফিসিয়াল Firebase Authentication পাসওয়ার্ড রিসেট ইমেইল পাঠাতে চান?`
                              : `Dispatch secure Firebase Authentication password reset link to ${user.name} (${user.email})?`
                          );
                          if (confirmReset) {
                            await adminResetUserPassword(user.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-all cursor-pointer"
                        title={language === 'bn' ? 'Firebase Auth পাসওয়ার্ড রিসেট লিংক পাঠান' : 'Send Firebase Auth Reset Link'}
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>

                      {/* Delete User Button */}
                      {!isImmortal ? (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to completely delete ${user.name}'s account?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="p-1.5 text-amber-500" title="Immortal Super Admin cannot be deleted">
                          <Lock className="w-4 h-4" />
                        </span>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: HELP DESK & PASSWORD RESET TICKETS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'tickets' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <span>{language === 'bn' ? 'হেল্প ডেস্ক ও পাসওয়ার্ড রিসেট ইনবক্স' : 'Help Desk & Password Reset Inbox'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' 
                  ? 'শিক্ষার্থীদের পাঠানো সমস্যা, ড্রাইভ রিকোয়েস্ট ও পাসওয়ার্ড রিসেট টিকিট ব্যবস্থাপনা করুন।' 
                  : 'Manage submitted student tickets, access issues, and one-click password resets.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {helpTickets.filter(t => t.status === 'open').length} {language === 'bn' ? 'অমীমাংসিত' : 'Open'}
              </span>
            </div>
          </div>

          {helpTickets.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400">
              <HelpCircle className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-bold">{language === 'bn' ? 'কোনো অমীমাংসিত হেল্প টিকিট নেই' : 'No support tickets found'}</p>
              <p className="text-xs">{language === 'bn' ? 'শিক্ষার্থীরা হেল্প আইকন ব্যবহার করলে এখানে জমা হবে।' : 'New tickets submitted via help icon will appear here in real-time.'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {helpTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                    ticket.status === 'open' 
                      ? 'border-amber-400/60 dark:border-amber-700/60 shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={ticket.userAvatar} 
                        alt="" 
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700" 
                        referrerPolicy="no-referrer" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{ticket.userName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            ticket.category === 'password_reset' 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700' 
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}>
                            {ticket.category === 'password_reset' ? '🔑 Password' : ticket.category}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block font-mono">{ticket.userEmail}</span>
                      </div>
                    </div>

                    <span className={`self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      ticket.status === 'resolved' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse'
                    }`}>
                      {ticket.status === 'resolved' ? '✅ Resolved' : '⏳ Open'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ticket.subject}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
                    {ticket.voiceAudioUrl && (
                      <div className="mt-2 p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 flex items-center gap-2">
                        <audio src={ticket.voiceAudioUrl} controls className="h-8 max-w-xs" />
                        <span className="text-[11px] text-cyan-800 dark:text-cyan-300 font-bold">ভয়েস মেসেজ</span>
                      </div>
                    )}
                  </div>

                  {ticket.adminReply && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                      <span className="font-bold block mb-0.5">অ্যাডমিন উত্তর / সমাধান:</span>
                      <p>{ticket.adminReply}</p>
                    </div>
                  )}

                  {ticket.status === 'open' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      {ticket.category === 'password_reset' && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                            <KeyRound className="w-4 h-4" />
                            <span>{language === 'bn' ? 'পাসওয়ার্ড রিসেট রিকোয়েস্ট' : 'Password Reset Request'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              const target = users.find(u => 
                                u.id === ticket.userId ||
                                (ticket.userEmail && u.email.toLowerCase() === ticket.userEmail.toLowerCase()) ||
                                (ticket.message && ticket.message.toLowerCase().includes(u.email.toLowerCase())) ||
                                u.name.toLowerCase() === ticket.userName.toLowerCase()
                              );
                              if (target) {
                                await adminResetUserPassword(target.id);
                              } else {
                                const emailCandidate = ticket.userEmail || (ticket.message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]);
                                if (emailCandidate) {
                                  await resetPassword(emailCandidate);
                                  resolveHelpTicket(
                                    ticket.id, 
                                    language === 'bn' 
                                      ? `অ্যাডমিন কর্তৃক Firebase Auth পাসওয়ার্ড রিসেট রিকোয়েস্ট অনুমোদিত হয়েছে। ${emailCandidate} ঠিকানায় অফিসিয়াল পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।` 
                                      : `Admin processed your request. Official Firebase Authentication password reset link dispatched to ${emailCandidate}.`
                                  );
                                } else {
                                  resolveHelpTicket(
                                    ticket.id, 
                                    language === 'bn' 
                                      ? 'আপনার একাউন্টের সঠিক ইমেইল পাওয়া যায়নি। অনুগ্রহ করে নিবন্ধিত ইমেইল প্রদান করে নতুন টিকিট জমা দিন।' 
                                      : 'No registered email found. Please provide your registered account email.'
                                  );
                                }
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform active:scale-95"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? '🔑 রিসেট লিংক পাঠান' : '🔑 Send Reset Link'}</span>
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ticketReplyText[ticket.id] || ''}
                          onChange={e => setTicketReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                          placeholder={language === 'bn' ? 'শিক্ষার্থীকে উত্তর বা নতুন পাসওয়ার্ড লিখে সমাধান করুন...' : 'Write reply or resolution message...'}
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => resolveHelpTicket(ticket.id, ticketReplyText[ticket.id])}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'সমাধান' : 'Resolve'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: MARKETPLACE MODERATION */}
      {/* ========================================================================= */}
      {activeAdminTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {language === 'bn' ? 'মার্কেটপ্লেস লিস্টিং ও ট্রেড নিয়ন্ত্রণ' : 'Marketplace Listings & Trade Moderation'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'অননুমোদিত, স্প্যাম বা নকল বই/নোট লিস্টিং ডিলিট বা মডারেট করুন।' : 'Review and delete suspicious or duplicate trade listings.'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {marketplaceItems.length} {language === 'bn' ? 'টি আইটেম' : 'Active Items'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplaceItems.map(item => (
              <div
                key={item.id}
                className="rounded-3xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                      {item.courseCode}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {item.priceType === 'free' ? 'FREE' : item.priceType === 'trade' ? 'SWAP' : `$${item.price}`}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.sellerAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[120px]">
                      {item.sellerName}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete listing "${item.title}"?`)) {
                        deleteMarketplaceItem(item.id);
                      }
                    }}
                    className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete listing as Admin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: CAMPUS FEED & POSTS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'feed' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {language === 'bn' ? 'ক্যাম্পাস ফিড ও প্রশ্নাবলি মডারেশন' : 'Feed Posts & Questions Moderation'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'অনুপযুক্ত মন্তব্য বা স্প্যাম পোস্ট তাৎক্ষণিকভাবে রিমুভ করুন।' : 'Remove abusive posts, spam links, or off-topic questions.'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
              {posts.length} {language === 'bn' ? 'পোস্ট' : 'Posts'}
            </span>
          </div>

          <div className="space-y-3">
            {posts.map(post => (
              <div
                key={post.id}
                className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">by {post.authorName} ({post.authorDepartment})</span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {post.content}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-xs text-slate-500 font-mono text-right">
                    <span>▲ {post.upvotes}</span> • <span>💬 {post.commentsCount}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete post "${post.title}"?`)) {
                        deleteDiscussionPost(post.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete discussion post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: CHANNELS & VOICE ROOMS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'channels' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {language === 'bn' ? 'অফিসিয়াল স্টাডি চ্যানেল ব্যবস্থাপনা' : 'Study Squad & Course Channels'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'নতুন কোর্স চ্যানেল তৈরি করুন অথবা অপ্রয়োজনীয় চ্যানেল ডিলিট করুন।' : 'Create official course channels and manage squad topics.'}
              </p>
            </div>
            
            <button
              onClick={() => setShowChannelModal(true)}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন চ্যানেল তৈরি' : 'Create Official Channel'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map(chan => (
              <div
                key={chan.id}
                className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                      {chan.courseCode}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {chan.memberCount} members
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    #{chan.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {chan.description || chan.department}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Live WebRTC</span>
                  </span>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete channel #${chan.name}?`)) {
                        deleteChannel(chan.id);
                      }
                    }}
                    className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete channel as Admin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: VAULT FILES */}
      {/* ========================================================================= */}
      {activeAdminTab === 'vault' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {language === 'bn' ? 'ক্লাউড ভল্ট ফাইলস মডারেশন' : 'Cloud Vault File Moderation'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'ক্যাম্পাস ভল্টে শেয়ার্ড হ্যান্ডরিটেন নোটস, স্লাইড ও কোড ফাইল তদারকি করুন।' : 'Audit zero-knowledge encrypted notes and coursework files.'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              {sharedFiles.length} {language === 'bn' ? 'ফাইলস' : 'Encrypted Files'}
            </span>
          </div>

          <div className="space-y-3">
            {sharedFiles.map(file => (
              <div
                key={file.id}
                className="rounded-3xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                      {file.courseCode}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400">({file.size})</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uploaded by {file.uploaderName} • SHA-256: <code className="text-indigo-500">{file.hash.slice(0, 16)}...</code>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">📥 {file.downloadCount} dl</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete file "${file.name}"?`)) {
                        deleteSharedFile(file.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete file from vault"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: SYSTEM BROADCAST & SETTINGS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'settings' && (
        <div className="space-y-6">
          
          {/* Top Campus Broadcast Announcement Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <Megaphone className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'bn' ? 'ক্যাম্পাস ব্রডকাস্ট ব্যানার (সবার জন্য নোটিফিকেশন)' : 'Campus Broadcast Announcement Banner'}
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn' 
                ? 'এই মেসেজটি সমস্ত শিক্ষার্থীর হোমস্ক্রিনে টপ অ্যালার্ট হিসেবে প্রদর্শিত হবে (যেমন: পরীক্ষার নোটিশ, হল বন্ধ বা জরুরি মিটিং)।' 
                : 'This announcement is pinned at the very top of ClassMate for every student.'}
            </p>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3">
              <textarea
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
                placeholder="Type emergency notice or midterm exam announcement..."
                rows={3}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-hidden focus:border-indigo-500"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setAnnouncementText('');
                    updateSystemSettings({ announcement: null });
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                >
                  {language === 'bn' ? 'ঘোষণা মুছুন' : 'Clear Announcement'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {language === 'bn' ? 'ব্রডকাস্ট প্রকাশ করুন' : 'Publish Broadcast'}
                </button>
              </div>
            </form>
          </div>

          {/* Central System Flags */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-500" />
              <span>{language === 'bn' ? 'প্ল্যাটফর্ম নিরাপত্তা ও অপারেশনাল সুইচ' : 'Platform Security & Operational Toggles'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Student Registration Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {language === 'bn' ? 'শিক্ষার্থী রেজিস্ট্রেশন খোলা রাখুন' : 'Allow Student Signups'}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'bn' ? 'নতুন শিক্ষার্থীদের স্বয়ংক্রিয় একাউন্ট তৈরি' : 'Enable public classmate account registration'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.allowStudentRegistrations}
                  onChange={e => updateSystemSettings({ allowStudentRegistrations: e.target.checked })}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {language === 'bn' ? 'রক্ষণাবেক্ষণ মোড (Maintenance Mode)' : 'Maintenance Mode'}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'bn' ? 'সার্ভার আপডেট বা ব্যাকআপের সময় সক্রিয় করুন' : 'Show maintenance badge for campus audits'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.maintenanceMode}
                  onChange={e => updateSystemSettings({ maintenanceMode: e.target.checked })}
                  className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
                />
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeAdminTab === 'logs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {language === 'bn' ? 'রিয়েল-টাইম অ্যাডমিন অডিট হিস্টোরি' : 'Real-time System Audit Trail'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'কে কবে রোল পরিবর্তন করেছেন, পোস্ট বা ইউজার ডিলিট করেছেন তার সম্পূর্ণ রেকর্ড।' : 'Chronological logs of role promotions, bans, deletions, and config edits.'}
              </p>
            </div>
            
            <button
              onClick={() => {
                if (window.confirm('Clear all audit logs history?')) {
                  clearAuditLogs();
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer"
            >
              {language === 'bn' ? 'লগ মুছুন' : 'Clear Logs'}
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                    log.type === 'role' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' :
                    log.type === 'delete' ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400' :
                    log.type === 'ban' ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400' :
                    'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {log.type === 'role' ? <Crown className="w-3.5 h-3.5" /> :
                     log.type === 'delete' ? <Trash2 className="w-3.5 h-3.5" /> :
                     log.type === 'ban' ? <Ban className="w-3.5 h-3.5" /> :
                     <ShieldCheck className="w-3.5 h-3.5" />}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{log.targetName}</span>
                    </div>
                    {log.details && (
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{log.details}</p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 text-slate-400 font-mono text-[11px]">
                  <span>by {log.performedBy}</span>
                  <div className="text-slate-500 text-[10px]">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE OFFICIAL CHANNEL */}
      {/* ========================================================================= */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'bn' ? 'নতুন অফিশিয়াল স্টাডি চ্যানেল' : 'Create Official Course Channel'}
              </h3>
              <button onClick={() => setShowChannelModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'চ্যানেল নাম (উদা: CSE 420 AI Lab)' : 'Channel Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE 420 Machine Learning Squad"
                  value={newChanName}
                  onChange={e => setNewChanName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'কোর্স কোড (Course Code)' : 'Course Code'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE 420"
                  value={newChanCourse}
                  onChange={e => setNewChanCourse(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'ডিপার্টমেন্ট' : 'Department'}
                </label>
                <select
                  value={newChanDept}
                  onChange={e => setNewChanDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
                >
                  <option>Computer Science & Engineering</option>
                  <option>Electrical & Electronic Engineering</option>
                  <option>Data Science & Statistics</option>
                  <option>Business Administration (BBA)</option>
                  <option>Architecture & Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'বিবরণ (ঐচ্ছিক)' : 'Description (Optional)'}
                </label>
                <textarea
                  value={newChanDesc}
                  onChange={e => setNewChanDesc(e.target.value)}
                  placeholder="Study notes exchange and weekly revision call channel..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChannelModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD NEW USER / ADMIN */}
      {/* ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'bn' ? 'নতুন ইউজার বা সাব-অ্যাডমিন যোগ করুন' : 'Enroll New User / Sub-Admin'}
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newUserName.trim() || !newUserEmail.trim()) return;
                const createdUser: User = {
                  id: `usr_${Date.now()}`,
                  name: newUserName.trim(),
                  username: newUserName.trim().toLowerCase().replace(/\s+/g, '_'),
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
                  gender: 'male',
                  email: newUserEmail.trim(),
                  phone: '+880 1700 998877',
                  department: newUserDept,
                  semester: '1st Semester',
                  university: 'ClassMate Campus',
                  cgpa: '3.80',
                  status: 'online',
                  currentStudyFocus: 'Campus Administration',
                  interests: ['Academic Hub', 'Distributed Systems'],
                  bio: 'Campus student member and study group collaborator.',
                  verified: true,
                  tradesCompleted: 0,
                  rating: 5.0,
                  role: newUserRole,
                  joinedDate: 'Spring 2026'
                };
                
                promoteUser(createdUser.id, newUserRole);
                setShowAddUserModal(false);
                setNewUserName('');
                setNewUserEmail('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'ব্যবহারকারীর নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. mahfuz.cse@campus.edu"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'ডিপার্টমেন্ট' : 'Department'}
                </label>
                <select
                  value={newUserDept}
                  onChange={e => setNewUserDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
                >
                  <option>Computer Science & Engineering</option>
                  <option>Electrical & Electronic Engineering</option>
                  <option>Data Science & Statistics</option>
                  <option>Business Administration (BBA)</option>
                  <option>Architecture & Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'প্রদত্ত রোল (Role Assigned)' : 'Role Assigned'}
                </label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden font-bold"
                >
                  <option value="admin">🛡️ Admin (অ্যাডমিন)</option>
                  <option value="moderator">🔹 Moderator (মডারেটর)</option>
                  <option value="student">🎓 Student (সাধারণ শিক্ষার্থী)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {language === 'bn' ? 'তৈরি করুন' : 'Enroll User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
