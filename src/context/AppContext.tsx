import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  MarketplaceItem, 
  DirectMessage, 
  GroupChannel, 
  ChannelMessage, 
  DiscussionPost, 
  SharedFile, 
  ActiveStudyCall, 
  ActiveTab, 
  AcademicStatus,
  AdminAuditLog,
  SystemSettings,
  UserRole
} from '../types';
import { 
  mockUsers, 
  mockMarketplaceItems, 
  mockDirectMessages, 
  mockChannels, 
  mockChannelMessages, 
  mockDiscussionPosts, 
  mockSharedFiles,
  mockAuditLogs,
  defaultSystemSettings
} from '../data/mockData';
import { computeSha256Digest } from '../utils/crypto';
import { Language, translations, Translations } from '../utils/translations';
import { soundManager } from '../utils/audioFX';
import defaultSchoolCampusImage from '../assets/images/school_campus_aerial_1788088291861.jpg';

interface ToastInfo {
  title: string;
  desc: string;
  type: 'success' | 'info' | 'call';
}

interface AppContextType {
  // Navigation & Language & Theme
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Campus Real Photo
  campusPhoto: string;
  setCampusPhoto: (photoUrl: string) => void;
  resetCampusPhoto: () => void;

  // User Profile & Roles
  currentUser: User;
  users: User[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  updateUserProfile: (profile: Partial<User>) => void;
  updateUserStatus: (status: AcademicStatus, focus?: string) => void;
  switchUserPersona: (userId: string) => void;

  // Master Admin Controls
  promoteUser: (userId: string, newRole: UserRole) => void;
  deleteUser: (userId: string) => void;
  banUser: (userId: string, isBanned: boolean) => void;
  toggleUserVerification: (userId: string) => void;
  deleteMarketplaceItem: (itemId: string) => void;
  deleteDiscussionPost: (postId: string) => void;
  deleteChannel: (channelId: string) => void;
  createGroupChannel: (channel: { name: string; courseCode: string; department: string; description?: string; avatar?: string; isPrivate?: boolean }) => void;
  inviteToGroupChannel: (channelId: string, userId: string) => void;
  deleteSharedFile: (fileId: string) => void;
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  auditLogs: AdminAuditLog[];
  clearAuditLogs: () => void;

  // Marketplace
  marketplaceItems: MarketplaceItem[];
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'likes' | 'views' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerDepartment' | 'sellerRating' | 'sellerVerified' | 'status'>) => void;
  toggleLikeItem: (id: string) => void;

  // Chat & Channels
  directMessages: DirectMessage[];
  channels: GroupChannel[];
  channelMessages: { [channelId: string]: ChannelMessage[] };
  activeChatTarget: { type: 'direct' | 'channel'; id: string };
  setActiveChatTarget: (target: { type: 'direct' | 'channel'; id: string }) => void;
  sendDirectMessage: (receiverId: string, content: string, attachment?: DirectMessage['attachment']) => Promise<void>;
  sendChannelMessage: (channelId: string, content: string, attachment?: ChannelMessage['attachment']) => void;

  // Feed & Discussions
  posts: DiscussionPost[];
  addPost: (post: Omit<DiscussionPost, 'id' | 'createdAt' | 'upvotes' | 'commentsCount' | 'comments' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorDepartment' | 'authorSemester'>) => void;
  toggleUpvotePost: (postId: string) => void;
  addCommentToPost: (postId: string, commentText: string) => void;

  // Cloud Vault
  sharedFiles: SharedFile[];
  addSharedFile: (file: Omit<SharedFile, 'id' | 'uploadedAt' | 'uploaderId' | 'uploaderName' | 'uploaderAvatar' | 'hash' | 'downloadCount'>) => Promise<void>;
  downloadFile: (fileId: string) => void;

  // Video/Audio Study Call
  activeCall: ActiveStudyCall | null;
  isCallModalOpen: boolean;
  setIsCallModalOpen: (open: boolean) => void;
  startCall: (title: string, type: 'video' | 'audio', isGroup: boolean, courseCode?: string, targetUserIds?: string[]) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  updateSharedCallNotes: (notes: string) => void;

  // Modals & Notifications
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  logout: () => void;
  resetPassword: (identifier: string, newPassword: string) => { success: boolean; message: string };
  updateUserCredentials: (updates: {
    username?: string;
    email?: string;
    newPassword?: string;
    currentPassword?: string;
    name?: string;
    department?: string;
    semester?: string;
    bio?: string;
    avatar?: string;
    phone?: string;
    currentStudyFocus?: string;
    interests?: string[];
  }) => { success: boolean; message: string };
  loginWithCredentials: (method: 'google' | 'phone' | 'username' | 'password', identifier: string, password?: string) => { success: boolean; message: string };
  createAccount: (payload: {
    name: string;
    method: 'google' | 'phone' | 'username';
    identifier: string;
    password?: string;
    email?: string;
    username?: string;
    phone?: string;
    department?: string;
    semester?: string;
    university?: string;
    avatar?: string;
    bio?: string;
    currentStudyFocus?: string;
    interests?: string[];
  }) => void;
  toastMessage: ToastInfo | null;
  showToast: (title: string, desc: string, type?: 'success' | 'info' | 'call') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('marketplace');
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('classmate_users');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockUsers; }
    }
    return mockUsers;
  });
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('classmate_current_user_id');
    return saved || 'usr_1';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('bn');
  const [campusPhoto, setCampusPhotoState] = useState<string>(defaultSchoolCampusImage);

  const t = translations[language];

  // Persist users and current user ID
  useEffect(() => {
    localStorage.setItem('classmate_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('classmate_current_user_id', currentUserId);
  }, [currentUserId]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const setCampusPhoto = (photoUrl: string) => {
    setCampusPhotoState(photoUrl);
    showToast(
      language === 'bn' ? 'স্কুলের ছবি আপডেট হয়েছে 📸' : 'Campus Photo Updated 📸',
      language === 'bn' ? 'আপনার আসল স্কুলের ছবি প্ল্যাটফর্মে সফলভাবে সেট করা হয়েছে।' : 'Real school picture has been set across the campus platform.',
      'success'
    );
  };

  const resetCampusPhoto = () => {
    setCampusPhotoState(defaultSchoolCampusImage);
    showToast(
      language === 'bn' ? 'ডিফল্ট ছবি সেট করা হয়েছে' : 'Default Photo Restored',
      language === 'bn' ? 'ক্যাম্পাসের আসল এরিয়াল ভিউ ফিরিয়ে আনা হয়েছে।' : 'Restored original school aerial campus photograph.',
      'info'
    );
  };

  // Sync dark class on body/html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Marketplace State
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(mockMarketplaceItems);

  // Chat State
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('classmate_direct_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockDirectMessages; }
    }
    return mockDirectMessages;
  });
  const [channels, setChannels] = useState<GroupChannel[]>(() => {
    const saved = localStorage.getItem('classmate_channels');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockChannels; }
    }
    return mockChannels;
  });
  const [channelMessages, setChannelMessages] = useState<{ [channelId: string]: ChannelMessage[] }>(() => {
    const saved = localStorage.getItem('classmate_channel_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockChannelMessages; }
    }
    return mockChannelMessages;
  });
  const [activeChatTarget, setActiveChatTarget] = useState<{ type: 'direct' | 'channel'; id: string }>({ type: 'channel', id: 'chan_all_students' });

  useEffect(() => {
    localStorage.setItem('classmate_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('classmate_channel_messages', JSON.stringify(channelMessages));
  }, [channelMessages]);

  useEffect(() => {
    localStorage.setItem('classmate_direct_messages', JSON.stringify(directMessages));
  }, [directMessages]);

  // Feed State
  const [posts, setPosts] = useState<DiscussionPost[]>(mockDiscussionPosts);

  // Vault State
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>(mockSharedFiles);

  // Call State
  const [activeCall, setActiveCall] = useState<ActiveStudyCall | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // Modal & Toast
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastInfo | null>(null);

  // System & Admin State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('classmate_system_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.schoolName === 'ClassMate University Campus Hub' || !parsed.schoolName) {
          parsed.schoolName = defaultSystemSettings.schoolName;
          parsed.announcement = defaultSystemSettings.announcement;
        }
        return parsed;
      } catch { return defaultSystemSettings; }
    }
    return defaultSystemSettings;
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('classmate_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockAuditLogs; }
    }
    return mockAuditLogs;
  });

  useEffect(() => {
    localStorage.setItem('classmate_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('classmate_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'call' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.title === title ? null : prev));
    }, 4000);
  };

  const addAuditLog = (action: string, targetName: string, type: AdminAuditLog['type'], details?: string) => {
    const newLog: AdminAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      action,
      targetName,
      performedBy: currentUser.name,
      timestamp: 'Just now',
      details,
      type
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    showToast(language === 'bn' ? 'অডিট লগ মুছে ফেলা হয়েছে' : 'Audit Logs Cleared', language === 'bn' ? 'সকল পূর্বের সিস্টেম অ্যাকশন লগ ক্লিয়ার করা হয়েছে।' : 'System activity history has been cleared.', 'info');
  };

  const updateSystemSettings = (partial: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...partial }));
    addAuditLog('System Settings Updated', 'System Config', 'system', `Updated settings: ${Object.keys(partial).join(', ')}`);
    showToast(
      language === 'bn' ? 'সিস্টেম সেটিংস আপডেট হয়েছে' : 'Settings Updated',
      language === 'bn' ? 'অ্যাপ্লিকেশনের কেন্দ্রীয় কনফিগারেশন সংরক্ষিত হয়েছে।' : 'Central campus configurations saved.',
      'success'
    );
  };

  const isSuperAdmin = currentUser.id === 'usr_1' || currentUser.role === 'super_admin' || Boolean(currentUser.isImmortalSuperAdmin);
  const isAdmin = isSuperAdmin || currentUser.role === 'admin';

  // Admin User Management with IMMUNITY PROTECTION for Rakibul Islam
  const promoteUser = (userId: string, newRole: UserRole) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    // IMMUNITY RULE: Super Admin Rakibul Islam CANNOT be demoted or removed by anyone!
    if (targetUser.id === 'usr_1' || targetUser.isImmortalSuperAdmin) {
      soundManager.playHangupSound();
      showToast(
        language === 'bn' ? 'অননুমোদিত: স্থায়ী সুপার অ্যাডমিন!' : 'Forbidden: Immortal Super Admin',
        language === 'bn' 
          ? '⚠️ সুপার অ্যাডমিন রকিবুল ইসলাম এই প্ল্যাটফর্মের চিরস্থায়ী প্রতিষ্ঠাতা ও সর্বেসর্বা। তাকে ডিমোট বা সরানো কঠোরভাবে অসম্ভব!' 
          : '⚠️ Founder & Super Admin Rakibul Islam cannot be removed or demoted. He holds permanent immortal root authority.',
        'info'
      );
      return;
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const roleTitle = newRole === 'admin' ? 'Admin (অ্যাডমিন)' : newRole === 'moderator' ? 'Moderator (মডারেটর)' : 'Student (শিক্ষার্থী)';
    addAuditLog('Role Changed', targetUser.name, 'role', `Changed role from ${targetUser.role || 'student'} to ${newRole}`);
    showToast(
      language === 'bn' ? 'ব্যবহারকারীর রোল পরিবর্তিত হয়েছে' : 'Role Updated',
      language === 'bn' ? `${targetUser.name}-কে ${roleTitle} হিসেবে নিযুক্ত করা হয়েছে।` : `${targetUser.name} is now designated as ${newRole.toUpperCase()}.`,
      'success'
    );
  };

  const deleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    // IMMUNITY RULE: Super Admin Rakibul Islam CANNOT be deleted!
    if (targetUser.id === 'usr_1' || targetUser.isImmortalSuperAdmin) {
      soundManager.playHangupSound();
      showToast(
        language === 'bn' ? 'অ্যাকশন বাতিল: সুপার অ্যাডমিন সুরক্ষা!' : 'Action Denied: Super Admin Immunity',
        language === 'bn' 
          ? '🚫 সুপার অ্যাডমিন রকিবুল ইসলামকে ডিলিট বা রিমুভ করা কঠোরভাবে নিষিদ্ধ ও অসম্ভব!' 
          : '🚫 Super Admin Rakibul Islam cannot be deleted. Permanent root immunity active.',
        'info'
      );
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    addAuditLog('User Account Deleted', targetUser.name, 'delete', `Deleted user ${targetUser.email}`);
    showToast(
      language === 'bn' ? 'ব্যবহারকারী মুছে ফেলা হয়েছে' : 'User Deleted',
      language === 'bn' ? `${targetUser.name}-এর অ্যাকাউন্ট সফলভাবে ডিলিট করা হয়েছে।` : `Account for ${targetUser.name} removed from campus network.`,
      'success'
    );
  };

  const banUser = (userId: string, isBanned: boolean) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    // IMMUNITY RULE: Super Admin cannot be banned!
    if (targetUser.id === 'usr_1' || targetUser.isImmortalSuperAdmin) {
      soundManager.playHangupSound();
      showToast(
        language === 'bn' ? 'অসম্ভব: সুপার অ্যাডমিন!' : 'Forbidden: Super Admin',
        language === 'bn' ? 'রকিবুল ইসলামকে ব্যান করা যাবে না।' : 'Super Admin Rakibul Islam cannot be banned.',
        'info'
      );
      return;
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned } : u));
    addAuditLog(isBanned ? 'User Banned' : 'User Unbanned', targetUser.name, 'ban', isBanned ? 'Restricted campus platform access' : 'Restored access');
    showToast(
      isBanned ? (language === 'bn' ? 'ব্যবহারকারী ব্যান করা হয়েছে' : 'User Banned') : (language === 'bn' ? 'ব্যান প্রত্যাহার করা হয়েছে' : 'User Unbanned'),
      `${targetUser.name} ${isBanned ? 'has been suspended' : 'access has been restored'}.`,
      'info'
    );
  };

  const toggleUserVerification = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
    const target = users.find(u => u.id === userId);
    if (target) {
      addAuditLog('Verification Toggled', target.name, 'role', `Verified status set to ${!target.verified}`);
    }
  };

  const deleteMarketplaceItem = (itemId: string) => {
    const item = marketplaceItems.find(i => i.id === itemId);
    setMarketplaceItems(prev => prev.filter(i => i.id !== itemId));
    if (item) {
      addAuditLog('Marketplace Item Removed', item.title, 'delete', `Removed listing by ${item.sellerName}`);
      showToast(language === 'bn' ? 'লিস্টিং মুছে ফেলা হয়েছে' : 'Listing Removed', `"${item.title}" removed by admin.`, 'info');
    }
  };

  const deleteDiscussionPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
    if (post) {
      addAuditLog('Post Deleted', post.title, 'delete', `Removed discussion by ${post.authorName}`);
      showToast(language === 'bn' ? 'পোস্ট মুছে ফেলা হয়েছে' : 'Post Deleted', `Post removed from campus feed.`, 'info');
    }
  };

  const deleteChannel = (channelId: string) => {
    const chan = channels.find(c => c.id === channelId);
    setChannels(prev => prev.filter(c => c.id !== channelId));
    if (chan) {
      addAuditLog('Channel Deleted', chan.name, 'delete', `Removed ${chan.courseCode} study channel`);
      showToast(language === 'bn' ? 'চ্যানেল মুছে ফেলা হয়েছে' : 'Channel Deleted', `Study channel #${chan.name} has been removed.`, 'info');
    }
  };

  const createGroupChannel = (payload: { name: string; courseCode: string; department: string; description?: string; avatar?: string; isPrivate?: boolean }) => {
    const newChanId = `chan_${Date.now()}`;
    const newChan: GroupChannel = {
      id: newChanId,
      name: payload.name,
      courseCode: payload.courseCode,
      department: payload.department,
      description: payload.description || (language === 'bn' ? 'স্টাডি গ্রুপ ও বিষয়ভিত্তিক আলোচনা' : 'Official campus discussion and study squad channel'),
      avatar: payload.avatar || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
      memberCount: 2,
      isPrivate: Boolean(payload.isPrivate),
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      lastMessage: language === 'bn' ? 'গ্রুপটি তৈরি করা হয়েছে। সবাই যোগ দিন!' : 'Group channel created. Welcome everyone!',
      lastTimestamp: 'Just now',
      members: [currentUser.id, 'usr_1', 'usr_2']
    };

    setChannels(prev => [newChan, ...prev]);

    // Initial welcome message in the new group
    setChannelMessages(prev => ({
      ...prev,
      [newChanId]: [
        {
          id: `cmsg_${Date.now()}`,
          channelId: newChanId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          content: language === 'bn'
            ? `স্বাগতম সবাইকে! "${payload.name}" (${payload.courseCode}) গ্রুপটি সফলভাবে তৈরি করা হয়েছে। এখানে সবাই নোটস শেয়ার, প্রশ্ন ও পড়ালেখার বিষয় আলোচনা করতে পারবেন। 🎉`
            : `Welcome everyone to "${payload.name}" (${payload.courseCode})! Let's collaborate on notes, problem sets, and exams. 🎉`,
          timestamp: 'Just now',
          encrypted: false,
          upvotes: 1
        }
      ]
    }));

    setActiveChatTarget({ type: 'channel', id: newChanId });
    addAuditLog('Group Channel Created', payload.name, 'system', `Created channel ${payload.courseCode}`);
    showToast(
      language === 'bn' ? 'নতুন গ্রুপ তৈরি হয়েছে 🎉' : 'Group Squad Created 🎉',
      `#${payload.name} (${payload.courseCode}) is now live.`,
      'success'
    );
  };

  const inviteToGroupChannel = (channelId: string, userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        const existingMembers = c.members || [];
        if (!existingMembers.includes(userId)) {
          return {
            ...c,
            memberCount: c.memberCount + 1,
            members: [...existingMembers, userId]
          };
        }
      }
      return c;
    }));

    showToast(
      language === 'bn' ? 'সহপাঠী যুক্ত হয়েছে' : 'Classmate Added',
      `${targetUser.name} ${language === 'bn' ? 'কে গ্রুপে যুক্ত করা হয়েছে।' : 'has been invited to the study group.'}`,
      'success'
    );
  };

  const deleteSharedFile = (fileId: string) => {
    const file = sharedFiles.find(f => f.id === fileId);
    setSharedFiles(prev => prev.filter(f => f.id !== fileId));
    if (file) {
      addAuditLog('Vault File Deleted', file.name, 'delete', `Deleted file in ${file.courseCode}`);
      showToast(language === 'bn' ? 'ফাইল মুছে ফেলা হয়েছে' : 'File Removed', `${file.name} deleted from vault.`, 'info');
    }
  };

  // User Actions & Password Recovery
  const logout = () => {
    setIsAuthModalOpen(true);
    showToast(
      language === 'bn' ? 'লগআউট সম্পন্ন 🔒' : 'Logged Out 🔒',
      language === 'bn' ? 'আপনি সফলভাবে অ্যাকাউন্ট থেকে লগআউট করেছেন।' : 'You have securely logged out from your account.',
      'info'
    );
  };

  const resetPassword = (identifier: string, newPassword: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().replace('@', '').toLowerCase();
    
    // Find matching user by email, username, phone, or name
    const userIndex = users.findIndex(u => 
      u.email.toLowerCase() === cleanId ||
      (u.username && u.username.toLowerCase() === cleanId) ||
      u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '') ||
      u.name.toLowerCase() === cleanId
    );

    if (userIndex === -1) {
      const errorMsg = language === 'bn' 
        ? 'এই ইমেইল, ইউজারনেম বা ফোন নম্বরের কোনো অ্যাকাউন্ট পাওয়া যায়নি!' 
        : 'No account found matching this email, username, or phone number!';
      showToast(language === 'bn' ? 'অ্যাকাউন্ট মেলেনি' : 'Account Not Found', errorMsg, 'info');
      return { success: false, message: errorMsg };
    }

    const targetUser = users[userIndex];
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...targetUser,
      password: newPassword.trim()
    };

    setUsers(updatedUsers);
    setCurrentUserId(targetUser.id);
    setIsAuthModalOpen(false);

    const successMsg = language === 'bn' 
      ? `পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! স্বাগতম ${targetUser.name}!` 
      : `Password reset successfully! Signed in as ${targetUser.name}!`;
    showToast(language === 'bn' ? 'পাসওয়ার্ড রিসেট সফল 🎉' : 'Password Reset Success 🎉', successMsg, 'success');
    return { success: true, message: successMsg };
  };

  const updateUserCredentials = (updates: {
    username?: string;
    email?: string;
    newPassword?: string;
    currentPassword?: string;
    name?: string;
    department?: string;
    semester?: string;
    bio?: string;
    avatar?: string;
    phone?: string;
    currentStudyFocus?: string;
    interests?: string[];
  }): { success: boolean; message: string } => {
    // 1. Validate Username uniqueness if changed
    if (updates.username) {
      const cleanUsername = updates.username.replace('@', '').trim().toLowerCase();
      const existingUser = users.find(u => u.id !== currentUser.id && u.username && u.username.toLowerCase() === cleanUsername);
      if (existingUser) {
        const errorMsg = language === 'bn' ? `ইউজারনেম @${cleanUsername} ইতিমধ্যে ব্যবহৃত হয়েছে!` : `Username @${cleanUsername} is already taken!`;
        showToast(language === 'bn' ? 'ইউজারনেম অনুপলব্ধ' : 'Username Taken', errorMsg, 'info');
        return { success: false, message: errorMsg };
      }
    }

    // 2. Validate Email uniqueness if changed
    if (updates.email) {
      const cleanEmail = updates.email.trim().toLowerCase();
      const existingEmail = users.find(u => u.id !== currentUser.id && u.email.toLowerCase() === cleanEmail);
      if (existingEmail) {
        const errorMsg = language === 'bn' ? `ইমেইল ${cleanEmail} ইতিমধ্যে নিবন্ধিত আছে!` : `Email ${cleanEmail} is already registered!`;
        showToast(language === 'bn' ? 'ইমেইল অনুপলব্ধ' : 'Email Taken', errorMsg, 'info');
        return { success: false, message: errorMsg };
      }
    }

    // 3. Validate Current Password if updating password
    if (updates.newPassword) {
      if (currentUser.password && updates.currentPassword && currentUser.password !== updates.currentPassword) {
        const errorMsg = language === 'bn' ? 'বর্তমান পাসওয়ার্ডটি সঠিক নয়!' : 'Current password does not match!';
        showToast(language === 'bn' ? 'ভুল পাসওয়ার্ড' : 'Incorrect Password', errorMsg, 'info');
        return { success: false, message: errorMsg };
      }
    }

    // Apply updates
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated: User = {
          ...u,
          name: updates.name !== undefined ? updates.name.trim() : u.name,
          username: updates.username !== undefined ? updates.username.replace('@', '').trim() : u.username,
          email: updates.email !== undefined ? updates.email.trim() : u.email,
          password: updates.newPassword !== undefined && updates.newPassword.trim() ? updates.newPassword.trim() : u.password,
          department: updates.department !== undefined ? updates.department.trim() : u.department,
          semester: updates.semester !== undefined ? updates.semester.trim() : u.semester,
          bio: updates.bio !== undefined ? updates.bio.trim() : u.bio,
          avatar: updates.avatar !== undefined ? updates.avatar : u.avatar,
          phone: updates.phone !== undefined ? updates.phone.trim() : u.phone,
          currentStudyFocus: updates.currentStudyFocus !== undefined ? updates.currentStudyFocus.trim() : u.currentStudyFocus,
          interests: updates.interests !== undefined ? updates.interests : u.interests
        };
        return updated;
      }
      return u;
    }));

    const successMsg = language === 'bn' ? 'অ্যাকাউন্টের তথ্য (ইউজারনেম/ইমেইল/পাসওয়ার্ড) সফলভাবে আপডেট হয়েছে! 🎉' : 'Account credentials (username, email, password) updated successfully! 🎉';
    showToast(language === 'bn' ? 'আপডেট সফল' : 'Security Updated', successMsg, 'success');
    return { success: true, message: successMsg };
  };

  const updateUserProfile = (profile: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...profile } : u));
    showToast('Profile Updated', 'Your academic profile and credentials have been updated.', 'success');
  };

  const updateUserStatus = (status: AcademicStatus, focus?: string) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { 
      ...u, 
      status, 
      currentStudyFocus: focus !== undefined ? focus : u.currentStudyFocus 
    } : u));
    showToast('Study Status Changed', `Your live status is now ${status.toUpperCase()}`, 'info');
  };

  const switchUserPersona = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      showToast('Switched Persona', `Active profile: ${target.name} (${target.department.split(' ')[0]})`, 'success');
    }
  };

  const loginWithCredentials = (method: 'google' | 'phone' | 'username' | 'password', identifier: string, password?: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().replace('@', '').toLowerCase();
    
    // Find matching user by email, username, phone or id
    const matched = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      (u.username && u.username.toLowerCase() === cleanId) || 
      u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '') ||
      u.name.toLowerCase() === cleanId
    );

    if (matched) {
      // Check password if provided and user has password set
      if (password && matched.password && matched.password !== password) {
        const errorMsg = language === 'bn' ? 'পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Incorrect password. Please verify and try again.';
        showToast(language === 'bn' ? 'লগইন ব্যর্থ' : 'Login Failed', errorMsg, 'info');
        return { success: false, message: errorMsg };
      }

      setCurrentUserId(matched.id);
      setIsAuthModalOpen(false);
      showToast(
        language === 'bn' ? 'স্বাগতম!' : 'Signed In Successfully', 
        `${language === 'bn' ? 'স্বাগতম' : 'Welcome back to ClassMate,'} ${matched.name}!`, 
        'success'
      );
      return { success: true, message: 'Signed in successfully' };
    }

    // If not found in signin mode, create instant student account
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: identifier.includes('@') ? identifier.split('@')[0].replace('.', ' ') : identifier,
      username: cleanId,
      password: password || 'password123',
      gender: 'male',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      email: identifier.includes('@') ? identifier : `${cleanId}@gmail.com`,
      phone: method === 'phone' ? identifier : '+880 1700 112233',
      department: 'Science (বিজ্ঞান বিভাগ)',
      semester: 'SSC 2027 Batch (Class 10)',
      university: 'Quantum Cosmo School, Lama, Bandarban',
      cgpa: 'GPA 5.00',
      bio: 'Enthusiastic Quantum Cosmo School SSC 2027 student eager to trade notes, form project teams, and learn.',
      status: 'online',
      currentStudyFocus: 'SSC 2027 Exam Prep & Study Squads',
      interests: ['Physics', 'Higher Math', 'SSC Prep', 'ICT'],
      verified: true,
      tradesCompleted: 0,
      rating: 5.0,
      joinedDate: 'Batch 2027'
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setIsAuthModalOpen(false);
    showToast(
      language === 'bn' ? 'নতুন আইডি তৈরি হয়েছে' : 'Signed In',
      `Welcome to ClassMate, ${newUser.name}!`,
      'success'
    );
    return { success: true, message: 'Account created and logged in' };
  };

  const createAccount = (payload: {
    name: string;
    method: 'google' | 'phone' | 'username';
    identifier: string;
    password?: string;
    email?: string;
    username?: string;
    phone?: string;
    department?: string;
    semester?: string;
    university?: string;
    avatar?: string;
    bio?: string;
    currentStudyFocus?: string;
    interests?: string[];
  }) => {
    const cleanUsername = payload.username 
      ? payload.username.replace('@', '').trim().toLowerCase() 
      : (payload.email ? payload.email.split('@')[0] : payload.name.toLowerCase().replace(/\s+/g, '_'));

    const cleanEmail = payload.email?.trim() || (payload.method === 'google' ? payload.identifier : `${cleanUsername}@gmail.com`);

    // Check if account with email/username already exists
    const matched = users.find(u => 
      (cleanEmail && u.email.toLowerCase() === cleanEmail.toLowerCase()) ||
      (cleanUsername && u.username && u.username.toLowerCase() === cleanUsername)
    );

    if (matched) {
      setCurrentUserId(matched.id);
      setIsAuthModalOpen(false);
      showToast(
        language === 'bn' ? 'আইডি পাওয়া গেছে' : 'Account Found', 
        `Logged in as existing student ${matched.name}.`, 
        'info'
      );
      return;
    }

    const defaultAvatar = payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: payload.name.trim() || 'New Student',
      username: cleanUsername,
      password: payload.password || 'password123',
      gender: 'male',
      avatar: defaultAvatar,
      email: cleanEmail,
      phone: payload.phone?.trim() || (payload.method === 'phone' ? payload.identifier : '+880 1700 998877'),
      department: payload.department?.trim() || 'Science (বিজ্ঞান বিভাগ)',
      semester: payload.semester?.trim() || 'SSC 2027 Batch (Class 10)',
      university: payload.university?.trim() || 'Quantum Cosmo School, Lama, Bandarban',
      cgpa: 'GPA 5.00',
      bio: payload.bio?.trim() || `Quantum Cosmo School SSC 2027 student member (${payload.department || 'Science'}). Ready to collaborate on exams, CQ/MCQ problem solving, and notes sharing.`,
      status: 'online',
      currentStudyFocus: payload.currentStudyFocus?.trim() || 'SSC 2027 Exam Prep & Study Squads',
      interests: payload.interests && payload.interests.length > 0 
        ? payload.interests 
        : ['SSC Prep', 'Physics', 'Higher Math', 'Notes Sharing'],
      verified: true,
      tradesCompleted: 0,
      rating: 5.0,
      joinedDate: 'Batch 2027'
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setIsAuthModalOpen(false);
    showToast(
      language === 'bn' ? 'স্টুডেন্ট অ্যাকাউন্ট তৈরি হয়েছে! 🎉' : 'Student Account Created! 🎉', 
      `Welcome to ClassMate, ${newUser.name}! Your campus profile is active.`, 
      'success'
    );
  };

  // Marketplace Actions
  const addMarketplaceItem = (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'likes' | 'views' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerDepartment' | 'sellerRating' | 'sellerVerified' | 'status'>) => {
    const newItem: MarketplaceItem = {
      ...item,
      id: `item_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerDepartment: currentUser.department,
      sellerRating: currentUser.rating,
      sellerVerified: currentUser.verified,
      status: 'available',
      createdAt: 'Just now',
      likes: 1,
      views: 1
    };
    setMarketplaceItems(prev => [newItem, ...prev]);
    showToast('Listing Published', `"${newItem.title}" is now live on the campus marketplace.`, 'success');
  };

  const toggleLikeItem = (id: string) => {
    setMarketplaceItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    }));
  };

  // Chat Actions
  const sendDirectMessage = async (receiverId: string, content: string, attachment?: DirectMessage['attachment']) => {
    const hash = await computeSha256Digest(content);
    const newMsg: DirectMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: 'Just now',
      encrypted: true,
      hash,
      attachment,
      read: true
    };
    setDirectMessages(prev => [...prev, newMsg]);

    // Simulated peer reply after 3s if chatting with a peer
    if (receiverId !== currentUser.id) {
      const peer = users.find(u => u.id === receiverId);
      setTimeout(() => {
        const replyMsg: DirectMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: receiverId,
          receiverId: currentUser.id,
          content: `Got your message regarding the academic notes! Let's collaborate. (Verified SHA-256)`,
          timestamp: 'Just now',
          encrypted: true,
          read: false
        };
        setDirectMessages(prev => [...prev, replyMsg]);
        showToast(`New message from ${peer?.name || 'Classmate'}`, 'Encrypted peer reply received', 'info');
      }, 3500);
    }
  };

  const sendChannelMessage = (channelId: string, content: string, attachment?: ChannelMessage['attachment']) => {
    const newMsg: ChannelMessage = {
      id: `cmsg_${Date.now()}`,
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: 'Just now',
      encrypted: false,
      attachment,
      upvotes: 0
    };

    setChannelMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg]
    }));

    setChannels(prev => prev.map(c => c.id === channelId ? {
      ...c,
      lastMessage: content,
      lastTimestamp: 'Just now'
    } : c));
  };

  // Feed Actions
  const addPost = (post: Omit<DiscussionPost, 'id' | 'createdAt' | 'upvotes' | 'commentsCount' | 'comments' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorDepartment' | 'authorSemester'>) => {
    const newPost: DiscussionPost = {
      ...post,
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorDepartment: currentUser.department,
      authorSemester: currentUser.semester,
      createdAt: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      commentsCount: 0,
      comments: []
    };
    setPosts(prev => [newPost, ...prev]);
    showToast('Post Published', 'Your question/project call has been shared with campus.', 'success');
  };

  const toggleUpvotePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isUpvoted = p.userUpvoted;
        return {
          ...p,
          upvotes: isUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          userUpvoted: !isUpvoted
        };
      }
      return p;
    }));
  };

  const addCommentToPost = (postId: string, commentText: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: `comm_${Date.now()}`,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          content: commentText,
          createdAt: 'Just now'
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
    showToast('Comment Added', 'Your reply has been posted.', 'success');
  };

  // Cloud Vault Actions
  const addSharedFile = async (file: Omit<SharedFile, 'id' | 'uploadedAt' | 'uploaderId' | 'uploaderName' | 'uploaderAvatar' | 'hash' | 'downloadCount'>) => {
    const hash = await computeSha256Digest(file.name + Date.now().toString());
    const newFile: SharedFile = {
      ...file,
      id: `file_${Date.now()}`,
      uploadedAt: 'Just now',
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      uploaderAvatar: currentUser.avatar,
      hash,
      downloadCount: 0
    };
    setSharedFiles(prev => [newFile, ...prev]);
    showToast('File Encrypted & Uploaded', `${file.name} saved to zero-knowledge vault.`, 'success');
  };

  const downloadFile = (fileId: string) => {
    setSharedFiles(prev => prev.map(f => f.id === fileId ? { ...f, downloadCount: f.downloadCount + 1 } : f));
    const target = sharedFiles.find(f => f.id === fileId);
    showToast('File Decrypted & Downloaded', `Integrity Verified: SHA-256 ${target?.hash.slice(0, 12)}...`, 'success');
  };

  // Call Actions
  const startCall = (title: string, type: 'video' | 'audio', isGroup: boolean, courseCode?: string, targetUserIds?: string[]) => {
    soundManager.playConnectChime();
    const participantIds = targetUserIds || ['usr_1', 'usr_2', 'usr_6'];
    const participantsList = users
      .filter(u => participantIds.includes(u.id) || u.id === currentUser.id)
      .map(u => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        isMuted: false,
        isVideoOn: type === 'video',
        isScreenSharing: false
      }));

    setActiveCall({
      id: `call_${Date.now()}`,
      title,
      type,
      isGroup,
      courseCode,
      participants: participantsList,
      startTime: new Date(),
      sharedNotes: `# Study Room Notes - ${title}\nCourse: ${courseCode || 'General'}\nDate: ${new Date().toLocaleDateString()}\n\n- Key Concepts covered:\n- Action items:`
    });
    setIsCallModalOpen(true);
    showToast(
      language === 'bn' ? (type === 'audio' ? 'অডিও স্টাডি কল চালু' : 'ভিডিও স্টাডি কল চালু') : 'Study Room Active', 
      `${title} (${type === 'audio' ? 'HD Voice' : 'Video'})`, 
      'call'
    );
  };

  const endCall = () => {
    soundManager.playHangupSound();
    setActiveCall(null);
    setIsCallModalOpen(false);
    showToast(language === 'bn' ? 'কল সমাপ্ত হয়েছে' : 'Call Ended', language === 'bn' ? 'স্টাডি সেশন সমাপ্ত করা হয়েছে।' : 'Study room session has concluded.', 'info');
  };

  const toggleMute = () => {
    if (!activeCall) return;
    const myParticipant = activeCall.participants.find(p => p.id === currentUser.id);
    const willBeMuted = !myParticipant?.isMuted;
    soundManager.playMuteClick(willBeMuted);
    setActiveCall(prev => {
      if (!prev) return null;
      return {
        ...prev,
        participants: prev.participants.map(p => p.id === currentUser.id ? { ...p, isMuted: !p.isMuted } : p)
      };
    });
  };

  const toggleVideo = () => {
    if (!activeCall) return;
    setActiveCall(prev => {
      if (!prev) return null;
      return {
        ...prev,
        participants: prev.participants.map(p => p.id === currentUser.id ? { ...p, isVideoOn: !p.isVideoOn } : p)
      };
    });
  };

  const toggleScreenShare = () => {
    if (!activeCall) return;
    setActiveCall(prev => {
      if (!prev) return null;
      return {
        ...prev,
        participants: prev.participants.map(p => p.id === currentUser.id ? { ...p, isScreenSharing: !p.isScreenSharing } : p)
      };
    });
    showToast('Screen Sharing', 'Broadcasting live display to study participants.', 'info');
  };

  const updateSharedCallNotes = (notes: string) => {
    if (!activeCall) return;
    setActiveCall(prev => prev ? { ...prev, sharedNotes: notes } : null);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        users,
        isAdmin,
        isSuperAdmin,
        promoteUser,
        deleteUser,
        banUser,
        toggleUserVerification,
        deleteMarketplaceItem,
        deleteDiscussionPost,
        deleteChannel,
        createGroupChannel,
        inviteToGroupChannel,
        deleteSharedFile,
        systemSettings,
        updateSystemSettings,
        auditLogs,
        clearAuditLogs,
        isDarkMode,
        toggleDarkMode,
        language,
        setLanguage,
        toggleLanguage,
        t,
        campusPhoto,
        setCampusPhoto,
        resetCampusPhoto,
        updateUserProfile,
        updateUserStatus,
        switchUserPersona,
        updateUserCredentials,
        logout,
        resetPassword,
        marketplaceItems,
        addMarketplaceItem,
        toggleLikeItem,
        directMessages,
        channels,
        channelMessages,
        activeChatTarget,
        setActiveChatTarget,
        sendDirectMessage,
        sendChannelMessage,
        posts,
        addPost,
        toggleUpvotePost,
        addCommentToPost,
        sharedFiles,
        addSharedFile,
        downloadFile,
        activeCall,
        isCallModalOpen,
        setIsCallModalOpen,
        startCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
        updateSharedCallNotes,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithCredentials,
        createAccount,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
