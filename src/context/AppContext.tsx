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
  UserRole,
  ThemeMode,
  PersonalDriveItem,
  ReelItem,
  EducationalNewsItem,
  HelpTicket,
  UserWarning,
  GameTruthOrDare
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
  defaultSystemSettings,
  mockReels,
  mockPersonalDrive,
  mockEducationalNews,
  mockHelpTickets,
  mockTruthOrDareGames,
  defaultSchoolLogo
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
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  
  // Campus Branding & Photo & Logo
  campusPhoto: string;
  setCampusPhoto: (photoUrl: string) => void;
  resetCampusPhoto: () => void;
  appLogo: string;
  updateAppLogo: (logoUrl: string) => void;
  updateSchoolCover: (coverUrl: string) => void;

  // User Profile & Roles
  currentUser: User;
  users: User[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  updateUserProfile: (profile: Partial<User>) => void;
  updateUserStatus: (status: AcademicStatus, focus?: string) => void;
  switchUserPersona: (userId: string) => void;
  blockUser: (targetUserId: string) => void;
  unblockUser: (targetUserId: string) => void;

  // Master Admin Controls & Password Recovery
  promoteUser: (userId: string, newRole: UserRole) => void;
  deleteUser: (userId: string) => void;
  banUser: (userId: string, isBanned: boolean) => void;
  toggleUserVerification: (userId: string) => void;
  adminResetUserPassword: (userId: string, newPass: string) => { success: boolean; message: string };
  adminLoginAsUser: (userId: string) => void;
  issueUserWarning: (userId: string, reason: string) => void;
  dismissUserWarning: (warningId: string) => void;
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  auditLogs: AdminAuditLog[];
  clearAuditLogs: () => void;

  // Personal Cloud Drive (Personal storage for pictures, videos, files)
  personalDriveItems: PersonalDriveItem[];
  addPersonalDriveItem: (item: Omit<PersonalDriveItem, 'id' | 'userId' | 'uploadedAt' | 'likes' | 'comments'>) => void;
  deletePersonalDriveItem: (id: string) => void;
  toggleLikeDriveItem: (id: string) => void;
  addCommentToDriveItem: (id: string, text: string) => void;

  // Reels
  reels: ReelItem[];
  addReel: (reel: Omit<ReelItem, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorBadge' | 'createdAt' | 'likes' | 'commentsCount' | 'comments'>) => void;
  toggleLikeReel: (reelId: string) => void;
  addCommentToReel: (reelId: string, text: string) => void;
  deleteReel: (reelId: string) => void;

  // Educational News & Automated Updates
  educationalNews: EducationalNewsItem[];
  addEducationalNews: (news: Omit<EducationalNewsItem, 'id' | 'publishedAt' | 'likes' | 'comments'>) => void;
  toggleLikeEduNews: (id: string) => void;
  addCommentToEduNews: (id: string, text: string) => void;
  deleteEduNews: (id: string) => void;

  // Help Desk / Support Tickets
  helpTickets: HelpTicket[];
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  submitHelpTicket: (subject: string, message: string, category: HelpTicket['category'], voiceAudioUrl?: string) => void;
  resolveHelpTicket: (ticketId: string, reply?: string) => void;
  deleteHelpTicket: (ticketId: string) => void;

  // Study Games & Truth or Dare
  gamesList: GameTruthOrDare[];
  addGameTruthOrDare: (item: Omit<GameTruthOrDare, 'id'>) => void;
  deleteGameTruthOrDare: (id: string) => void;

  // In-App Google & Campus Search
  isGoogleSearchOpen: boolean;
  setIsGoogleSearchOpen: (open: boolean) => void;

  // Marketplace
  marketplaceItems: MarketplaceItem[];
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'likes' | 'views' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerDepartment' | 'sellerRating' | 'sellerVerified' | 'status'>) => void;
  toggleLikeItem: (id: string) => void;
  addCommentToItem: (itemId: string, text: string) => void;
  deleteMarketplaceItem: (itemId: string) => void;

  // Chat & Channels
  directMessages: DirectMessage[];
  channels: GroupChannel[];
  channelMessages: { [channelId: string]: ChannelMessage[] };
  activeChatTarget: { type: 'direct' | 'channel'; id: string };
  setActiveChatTarget: (target: { type: 'direct' | 'channel'; id: string }) => void;
  sendDirectMessage: (receiverId: string, content: string, attachment?: DirectMessage['attachment'], voiceAudioUrl?: string, voiceDurationSec?: number) => Promise<void>;
  sendChannelMessage: (channelId: string, content: string, attachment?: ChannelMessage['attachment'], voiceAudioUrl?: string, voiceDurationSec?: number) => void;
  deleteChannel: (channelId: string) => void;
  createGroupChannel: (channel: { name: string; courseCode: string; department: string; description?: string; avatar?: string; isPrivate?: boolean }) => void;
  inviteToGroupChannel: (channelId: string, userId: string) => void;
  removeMemberFromGroup: (channelId: string, userId: string) => void;

  // Feed & Discussions
  posts: DiscussionPost[];
  addPost: (post: Omit<DiscussionPost, 'id' | 'createdAt' | 'upvotes' | 'commentsCount' | 'comments' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorDepartment' | 'authorSemester'>) => void;
  toggleUpvotePost: (postId: string) => void;
  addCommentToPost: (postId: string, commentText: string) => void;
  deleteDiscussionPost: (postId: string) => void;

  // Cloud Vault (Public Shared Notes)
  sharedFiles: SharedFile[];
  addSharedFile: (file: Omit<SharedFile, 'id' | 'uploadedAt' | 'uploaderId' | 'uploaderName' | 'uploaderAvatar' | 'hash' | 'downloadCount'>) => Promise<void>;
  downloadFile: (fileId: string) => void;
  toggleLikeSharedFile: (fileId: string) => void;
  addCommentToSharedFile: (fileId: string, text: string) => void;
  deleteSharedFile: (fileId: string) => void;

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

  // Authentication & Guest State
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  requireAuth: (actionDescription?: string, targetTab?: ActiveTab) => boolean;

  // Modals & Notifications & Credentials
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
    schoolCover?: string;
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
    schoolCover?: string;
    bio?: string;
    currentStudyFocus?: string;
    interests?: string[];
  }) => void;
  toastMessage: ToastInfo | null;
  showToast: (title: string, desc: string, type?: 'success' | 'info' | 'call') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('classmate_is_logged_in');
    return saved === 'true';
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>('welcome');
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
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('classmate_theme_mode');
    return (saved as ThemeMode) || 'dark';
  });
  const [language, setLanguage] = useState<Language>('bn');
  const [campusPhoto, setCampusPhotoState] = useState<string>(defaultSchoolCampusImage);
  const [appLogo, setAppLogoState] = useState<string>(() => {
    const saved = localStorage.getItem('classmate_app_logo');
    return saved || defaultSchoolLogo;
  });

  const t = translations[language];

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isGoogleSearchOpen, setIsGoogleSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastInfo | null>(null);

  const requireAuth = (actionDescription?: string, targetTab?: ActiveTab): boolean => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn' ? 'লগইন প্রয়োজন 🔒' : 'Login Required 🔒',
        actionDescription || (language === 'bn' ? 'এই সুবিধাটি ব্যবহার করতে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন।' : 'Please sign in or register to use this feature.'),
        'info'
      );
      return false;
    }
    if (targetTab) {
      setActiveTabState(targetTab);
    }
    return true;
  };

  const setActiveTab = (tab: ActiveTab) => {
    if (tab !== 'welcome' && !isLoggedIn) {
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn' ? 'লগইন প্রয়োজন 🔒' : 'Login Required 🔒',
        language === 'bn' ? 'ক্যাম্পাসের অভ্যন্তরীণ মডিউলে প্রবেশ করতে অনুগ্রহ করে লগইন অথবা রেজিস্ট্রেশন করুন।' : 'Please login or register to access inside campus facilities.',
        'info'
      );
      return;
    }
    setActiveTabState(tab);
  };

  // System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('classmate_system_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.appLogo) parsed.appLogo = defaultSchoolLogo;
        if (!parsed.defaultCampusPhoto) parsed.defaultCampusPhoto = defaultSchoolCampusImage;
        return parsed;
      } catch { return defaultSystemSettings; }
    }
    return defaultSystemSettings;
  });

  // Persist basic states
  useEffect(() => {
    localStorage.setItem('classmate_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('classmate_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('classmate_theme_mode', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
    if (themeMode === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    showToast(
      language === 'bn' ? `থিম পরিবর্তন হয়েছে (${mode.toUpperCase()})` : `Theme Mode: ${mode.toUpperCase()}`,
      language === 'bn' ? 'অ্যাপ্লিকেশনের ভিজ্যুয়াল স্টাইল আপডেট করা হয়েছে।' : 'Visual color mood updated.',
      'info'
    );
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const toggleDarkMode = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  const updateAppLogo = (logoUrl: string) => {
    setAppLogoState(logoUrl);
    localStorage.setItem('classmate_app_logo', logoUrl);
    setSystemSettings(prev => ({ ...prev, appLogo: logoUrl }));
    addAuditLog('School Logo Updated', 'Branding', 'system', 'Admin updated official campus emblem logo.');
    showToast(
      language === 'bn' ? 'স্কুল লোগো আপডেট হয়েছে 🏫' : 'Campus Logo Updated 🏫',
      language === 'bn' ? 'নতুন লোগো পুরো প্ল্যাটফর্মে যুক্ত হয়েছে।' : 'Official school logo updated across platform.',
      'success'
    );
  };

  const updateSchoolCover = (coverUrl: string) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, schoolCover: coverUrl } : u));
    showToast(
      language === 'bn' ? 'স্কুল কভার ফটো আপডেট হয়েছে 📸' : 'Campus Cover Updated 📸',
      language === 'bn' ? 'আপনার ব্যক্তিগত প্রোফাইলে স্কুলের কভার সেট করা হয়েছে।' : 'Personal school cover photo updated.',
      'success'
    );
  };

  const setCampusPhoto = (photoUrl: string) => {
    setCampusPhotoState(photoUrl);
    showToast(
      language === 'bn' ? 'স্কুলের ফটো আপডেট হয়েছে 📸' : 'Campus Photo Updated 📸',
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

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Personal Drive State
  const [personalDriveItems, setPersonalDriveItems] = useState<PersonalDriveItem[]>(() => {
    const saved = localStorage.getItem('classmate_personal_drive');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockPersonalDrive; }
    }
    return mockPersonalDrive;
  });

  useEffect(() => {
    localStorage.setItem('classmate_personal_drive', JSON.stringify(personalDriveItems));
  }, [personalDriveItems]);

  const addPersonalDriveItem = (item: Omit<PersonalDriveItem, 'id' | 'userId' | 'uploadedAt' | 'likes' | 'comments'>) => {
    const newItem: PersonalDriveItem = {
      ...item,
      id: `drive_${Date.now()}`,
      userId: currentUser.id,
      uploadedAt: 'Just now',
      likes: 0,
      likedByUser: false,
      comments: []
    };
    setPersonalDriveItems(prev => [newItem, ...prev]);
    showToast(
      language === 'bn' ? 'ড্রাইভে ফাইল সেভ হয়েছে 📁' : 'Saved to Personal Drive 📁',
      `"${newItem.name}" is securely stored in your personal cloud.`,
      'success'
    );
  };

  const deletePersonalDriveItem = (id: string) => {
    setPersonalDriveItems(prev => prev.filter(item => item.id !== id));
    showToast(
      language === 'bn' ? 'ড্রাইভ থেকে ডিলিট হয়েছে' : 'Item Deleted',
      language === 'bn' ? 'ফাইলটি আপনার ড্রাইভ থেকে মুছে ফেলা হয়েছে।' : 'Item removed from your personal drive.',
      'info'
    );
  };

  const toggleLikeDriveItem = (id: string) => {
    setPersonalDriveItems(prev => prev.map(item => {
      if (item.id === id) {
        const isLiked = item.likedByUser;
        return {
          ...item,
          likes: isLiked ? item.likes - 1 : item.likes + 1,
          likedByUser: !isLiked
        };
      }
      return item;
    }));
  };

  const addCommentToDriveItem = (id: string, text: string) => {
    setPersonalDriveItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          comments: [
            ...item.comments,
            {
              id: `dc_${Date.now()}`,
              authorName: currentUser.name,
              authorAvatar: currentUser.avatar,
              content: text,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return item;
    }));
    showToast(language === 'bn' ? 'মন্তব্য যোগ হয়েছে' : 'Comment Added', 'Your comment has been posted.', 'success');
  };

  // Reels State
  const [reels, setReels] = useState<ReelItem[]>(() => {
    const saved = localStorage.getItem('classmate_reels');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockReels; }
    }
    return mockReels;
  });

  useEffect(() => {
    localStorage.setItem('classmate_reels', JSON.stringify(reels));
  }, [reels]);

  const addReel = (reel: Omit<ReelItem, 'id' | 'authorId' | 'authorName' | 'authorAvatar' | 'authorBadge' | 'createdAt' | 'likes' | 'commentsCount' | 'comments'>) => {
    const newReel: ReelItem = {
      ...reel,
      id: `reel_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorBadge: `${currentUser.department.split(' ')[0]} • SSC 2027`,
      createdAt: 'Just now',
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      comments: []
    };
    setReels(prev => [newReel, ...prev]);
    showToast(
      language === 'bn' ? 'রিল আপলোড সফল 🎬' : 'Reel Published 🎬',
      language === 'bn' ? 'আপনার ক্যাম্পাস রিল প্রকাশ করা হয়েছে।' : 'Your reel is now live on campus feed.',
      'success'
    );
  };

  const toggleLikeReel = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const isLiked = r.isLiked;
        return {
          ...r,
          likes: isLiked ? r.likes - 1 : r.likes + 1,
          isLiked: !isLiked
        };
      }
      return r;
    }));
  };

  const addCommentToReel = (reelId: string, text: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const newComm = {
          id: `rc_${Date.now()}`,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          content: text,
          createdAt: 'Just now'
        };
        return {
          ...r,
          commentsCount: r.commentsCount + 1,
          comments: [...r.comments, newComm]
        };
      }
      return r;
    }));
  };

  const deleteReel = (reelId: string) => {
    setReels(prev => prev.filter(r => r.id !== reelId));
    showToast(language === 'bn' ? 'রিল মুছে ফেলা হয়েছে' : 'Reel Deleted', 'Reel removed from campus reels.', 'info');
  };

  // Educational News State
  const [educationalNews, setEducationalNews] = useState<EducationalNewsItem[]>(() => {
    const saved = localStorage.getItem('classmate_edu_news');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockEducationalNews; }
    }
    return mockEducationalNews;
  });

  useEffect(() => {
    localStorage.setItem('classmate_edu_news', JSON.stringify(educationalNews));
  }, [educationalNews]);

  const addEducationalNews = (news: Omit<EducationalNewsItem, 'id' | 'publishedAt' | 'likes' | 'comments'>) => {
    const newNews: EducationalNewsItem = {
      ...news,
      id: `edu_${Date.now()}`,
      publishedAt: 'Just now',
      likes: 1,
      isLiked: true,
      comments: []
    };
    setEducationalNews(prev => [newNews, ...prev]);
    showToast(language === 'bn' ? 'শিক্ষামূলক আপডেট প্রকাশিত' : 'Educational News Published', newNews.title, 'success');
  };

  const toggleLikeEduNews = (id: string) => {
    setEducationalNews(prev => prev.map(n => {
      if (n.id === id) {
        const isLiked = n.isLiked;
        return { ...n, likes: isLiked ? n.likes - 1 : n.likes + 1, isLiked: !isLiked };
      }
      return n;
    }));
  };

  const addCommentToEduNews = (id: string, text: string) => {
    setEducationalNews(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          comments: [
            ...n.comments,
            {
              id: `ec_${Date.now()}`,
              authorName: currentUser.name,
              authorAvatar: currentUser.avatar,
              content: text,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return n;
    }));
  };

  const deleteEduNews = (id: string) => {
    setEducationalNews(prev => prev.filter(n => n.id !== id));
    showToast(language === 'bn' ? 'নিউজ মুছে ফেলা হয়েছে' : 'News Deleted', 'Educational item removed.', 'info');
  };

  // Help Desk & Tickets
  const [helpTickets, setHelpTickets] = useState<HelpTicket[]>(() => {
    const saved = localStorage.getItem('classmate_help_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockHelpTickets; }
    }
    return mockHelpTickets;
  });

  useEffect(() => {
    localStorage.setItem('classmate_help_tickets', JSON.stringify(helpTickets));
  }, [helpTickets]);

  const submitHelpTicket = (subject: string, message: string, category: HelpTicket['category'], voiceAudioUrl?: string) => {
    const newTicket: HelpTicket = {
      id: `ticket_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userEmail: currentUser.email,
      subject,
      message,
      voiceAudioUrl,
      category,
      status: 'open',
      createdAt: 'Just now'
    };
    setHelpTickets(prev => [newTicket, ...prev]);
    setIsHelpModalOpen(false);
    showToast(
      language === 'bn' ? 'হেল্প টিকিট জমা হয়েছে 📩' : 'Help Ticket Sent 📩',
      language === 'bn' ? 'অ্যাডমিন খুব দ্রুত আপনার সমস্যার সমাধান করে জানাবেন।' : 'Admin has received your ticket and will assist you.',
      'success'
    );
  };

  const resolveHelpTicket = (ticketId: string, reply?: string) => {
    setHelpTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      status: 'resolved',
      adminReply: reply || (language === 'bn' ? 'অ্যাডমিন কর্তৃক সমস্যা সমাধান করা হয়েছে।' : 'Resolved by Admin.')
    } : t));
    showToast(language === 'bn' ? 'টিকিট সমাধান সম্পন্ন' : 'Ticket Resolved', 'Marked as resolved.', 'success');
  };

  const deleteHelpTicket = (ticketId: string) => {
    setHelpTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  // Study Games & Truth or Dare State
  const [gamesList, setGamesList] = useState<GameTruthOrDare[]>(() => {
    const saved = localStorage.getItem('classmate_games_list');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockTruthOrDareGames; }
    }
    return mockTruthOrDareGames;
  });

  useEffect(() => {
    localStorage.setItem('classmate_games_list', JSON.stringify(gamesList));
  }, [gamesList]);

  const addGameTruthOrDare = (item: Omit<GameTruthOrDare, 'id'>) => {
    const newItem: GameTruthOrDare = {
      ...item,
      id: `td_${Date.now()}`
    };
    setGamesList(prev => [newItem, ...prev]);
    showToast(
      language === 'bn' ? 'নতুন প্রশ্ন/ডেয়ার যুক্ত হয়েছে 🎯' : 'New Challenge Added 🎯',
      newItem.question,
      'success'
    );
  };

  const deleteGameTruthOrDare = (id: string) => {
    setGamesList(prev => prev.filter(g => g.id !== id));
    showToast(language === 'bn' ? 'মুছে ফেলা হয়েছে' : 'Removed', 'Challenge removed.', 'info');
  };

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

  // Audit Logs
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

    if (targetUser.id === 'usr_1' || targetUser.isImmortalSuperAdmin) {
      soundManager.playHangupSound();
      showToast(
        language === 'bn' ? 'অননুমোদিত: স্থায়ী সুপার অ্যাডমিন!' : 'Forbidden: Immortal Super Admin',
        language === 'bn' 
          ? '⚠️ সুপার অ্যাডমিন রকিবুল ইসলাম এই প্ল্যাটফর্মের চিরস্থায়ী প্রতিষ্ঠাতা ও সর্বেসর্বা।' 
          : '⚠️ Founder & Super Admin Rakibul Islam holds permanent immortal root authority.',
        'info'
      );
      return;
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const roleTitle = newRole === 'admin' ? 'Admin (অ্যাডমিন)' : newRole === 'moderator' ? 'Moderator (মডারেটর)' : 'Student (শিক্ষার্থী)';
    addAuditLog('Role Changed', targetUser.name, 'role', `Changed role to ${newRole}`);
    showToast(
      language === 'bn' ? 'ব্যবহারকারীর রোল পরিবর্তিত হয়েছে' : 'Role Updated',
      language === 'bn' ? `${targetUser.name}-কে ${roleTitle} হিসেবে নিযুক্ত করা হয়েছে।` : `${targetUser.name} is now designated as ${newRole.toUpperCase()}.`,
      'success'
    );
  };

  const deleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    if (targetUser.id === 'usr_1' || targetUser.isImmortalSuperAdmin) {
      soundManager.playHangupSound();
      showToast(
        language === 'bn' ? 'অ্যাকশন বাতিল: সুপার অ্যাডমিন সুরক্ষা!' : 'Action Denied: Super Admin Immunity',
        language === 'bn' 
          ? '🚫 সুপার অ্যাডমিন রকিবুল ইসলামকে ডিলিট করা অসম্ভব!' 
          : '🚫 Super Admin Rakibul Islam cannot be deleted.',
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

  // Peer to peer blocking
  const blockUser = (targetUserId: string) => {
    const target = users.find(u => u.id === targetUserId);
    if (!target) return;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const blocked = u.blockedUserIds || [];
        if (!blocked.includes(targetUserId)) {
          return { ...u, blockedUserIds: [...blocked, targetUserId] };
        }
      }
      return u;
    }));
    showToast(
      language === 'bn' ? 'ব্যবহারকারী ব্লক করা হয়েছে' : 'User Blocked',
      `${target.name} ${language === 'bn' ? 'কে আপনি ব্লক করেছেন।' : 'has been blocked from interacting with you.'}`,
      'info'
    );
  };

  const unblockUser = (targetUserId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, blockedUserIds: (u.blockedUserIds || []).filter(id => id !== targetUserId) };
      }
      return u;
    }));
    showToast(
      language === 'bn' ? 'আনব্লক সম্পন্ন' : 'User Unblocked',
      language === 'bn' ? 'ব্লক প্রত্যাহার করা হয়েছে।' : 'User unblocked successfully.',
      'success'
    );
  };

  // Admin Warning System
  const issueUserWarning = (userId: string, reason: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const newWarning: UserWarning = {
      id: `warn_${Date.now()}`,
      userId,
      issuedBy: currentUser.name,
      reason,
      timestamp: 'Just now',
      read: false
    };

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, warnings: [...(u.warnings || []), newWarning] };
      }
      return u;
    }));

    addAuditLog('Warning Issued', target.name, 'warning', `Issued warning: "${reason}"`);
    showToast(
      language === 'bn' ? 'সতর্কবার্তা পাঠানো হয়েছে ⚠️' : 'Warning Sent ⚠️',
      `${target.name} ${language === 'bn' ? 'কে অফিসিয়াল সতর্কতা পাঠানো হয়েছে।' : 'has received official warning notice.'}`,
      'info'
    );
  };

  const dismissUserWarning = (warningId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, warnings: (u.warnings || []).filter(w => w.id !== warningId) };
      }
      return u;
    }));
  };

  // Admin Direct Password Management & 1-Click Login
  const adminResetUserPassword = (userId: string, newPass: string): { success: boolean; message: string } => {
    const target = users.find(u => u.id === userId);
    if (!target) return { success: false, message: 'User not found' };

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass.trim() } : u));
    addAuditLog('Admin Password Reset', target.name, 'password_reset', `Admin reset password for ${target.email}`);
    
    const msg = language === 'bn' 
      ? `${target.name}-এর নতুন পাসওয়ার্ড সেট করা হয়েছে: "${newPass.trim()}"`
      : `Password for ${target.name} reset to: "${newPass.trim()}"`;
    showToast(language === 'bn' ? 'পাসওয়ার্ড সেট সফল 🔑' : 'Password Reset 🔑', msg, 'success');
    return { success: true, message: msg };
  };

  const adminLoginAsUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    setCurrentUserId(userId);
    setActiveTab('profile');
    showToast(
      language === 'bn' ? 'সরাসরি লগইন সম্পন্ন 🚀' : 'Instant Login Active 🚀',
      `Logged in as ${target.name} (${target.department.split(' ')[0]})`,
      'success'
    );
  };

  const deleteMarketplaceItem = (itemId: string) => {
    const item = marketplaceItems.find(i => i.id === itemId);
    setMarketplaceItems(prev => prev.filter(i => i.id !== itemId));
    if (item) {
      addAuditLog('Marketplace Item Removed', item.title, 'delete', `Removed listing by ${item.sellerName}`);
      showToast(language === 'bn' ? 'লিস্টিং মুছে ফেলা হয়েছে' : 'Listing Removed', `"${item.title}" removed.`, 'info');
    }
  };

  const addCommentToItem = (itemId: string, text: string) => {
    setMarketplaceItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          comments: [
            ...(item.comments || []),
            {
              id: `ic_${Date.now()}`,
              authorName: currentUser.name,
              authorAvatar: currentUser.avatar,
              content: text,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return item;
    }));
    showToast(language === 'bn' ? 'কমেন্ট করা হয়েছে' : 'Comment Added', 'Your comment is published.', 'success');
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
            ? `স্বাগতম সবাইকে! "${payload.name}" (${payload.courseCode}) গ্রুপটি সফলভাবে তৈরি করা হয়েছে। 🎉`
            : `Welcome everyone to "${payload.name}" (${payload.courseCode})! 🎉`,
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

  const removeMemberFromGroup = (channelId: string, userId: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === channelId) {
        return {
          ...c,
          memberCount: Math.max(1, c.memberCount - 1),
          members: (c.members || []).filter(m => m !== userId)
        };
      }
      return c;
    }));
    showToast(language === 'bn' ? 'সদস্য সরানো হয়েছে' : 'Member Removed', 'Member removed from group.', 'info');
  };

  const deleteSharedFile = (fileId: string) => {
    const file = sharedFiles.find(f => f.id === fileId);
    setSharedFiles(prev => prev.filter(f => f.id !== fileId));
    if (file) {
      addAuditLog('Vault File Deleted', file.name, 'delete', `Deleted file in ${file.courseCode}`);
      showToast(language === 'bn' ? 'ফাইল মুছে ফেলা হয়েছে' : 'File Removed', `${file.name} deleted.`, 'info');
    }
  };

  const toggleLikeSharedFile = (fileId: string) => {
    setSharedFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        const isLiked = f.likedByUser;
        return {
          ...f,
          likes: isLiked ? (f.likes || 1) - 1 : (f.likes || 0) + 1,
          likedByUser: !isLiked
        };
      }
      return f;
    }));
  };

  const addCommentToSharedFile = (fileId: string, text: string) => {
    setSharedFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          comments: [
            ...(f.comments || []),
            {
              id: `fc_${Date.now()}`,
              authorName: currentUser.name,
              authorAvatar: currentUser.avatar,
              content: text,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return f;
    }));
    showToast(language === 'bn' ? 'মন্তব্য যুক্ত হয়েছে' : 'Comment Added', 'Comment posted on file.', 'success');
  };

  // User Actions & Password Recovery
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('classmate_is_logged_in', 'false');
    setActiveTabState('welcome');
    setIsAuthModalOpen(false);
    showToast(
      language === 'bn' ? 'লগআউট সম্পন্ন 🔒' : 'Logged Out 🔒',
      language === 'bn' ? 'আপনি সফলভাবে অ্যাকাউন্ট থেকে লগআউট করেছেন।' : 'You have securely logged out.',
      'info'
    );
  };

  const resetPassword = (identifier: string, newPassword: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().replace('@', '').toLowerCase();
    
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
    setIsLoggedIn(true);
    localStorage.setItem('classmate_is_logged_in', 'true');
    localStorage.setItem('classmate_current_user_id', targetUser.id);
    setIsAuthModalOpen(false);
    setActiveTabState('feed');

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
    schoolCover?: string;
    currentStudyFocus?: string;
    interests?: string[];
  }): { success: boolean; message: string } => {
    if (updates.username) {
      const cleanUsername = updates.username.replace('@', '').trim().toLowerCase();
      const existingUser = users.find(u => u.id !== currentUser.id && u.username && u.username.toLowerCase() === cleanUsername);
      if (existingUser) {
        const errorMsg = language === 'bn' ? `ইউজারনেম @${cleanUsername} ইতিমধ্যে ব্যবহৃত হয়েছে!` : `Username @${cleanUsername} is already taken!`;
        showToast(language === 'bn' ? 'ইউজারনেম অনুপলব্ধ' : 'Username Taken', errorMsg, 'info');
        return { success: false, message: errorMsg };
      }
    }

    if (updates.email) {
      const cleanEmail = updates.email.trim().toLowerCase();
      const existingEmail = users.find(u => u.id !== currentUser.id && u.email.toLowerCase() === cleanEmail);
      if (existingEmail) {
        const errorMsg = language === 'bn' ? `ইমেইল ${cleanEmail} ইতিমধ্যে নিবন্ধিত আছে!` : `Email ${cleanEmail} is already registered!`;
        showToast(language === 'bn' ? 'ইমেইল অনুপলব্ধ' : 'Email Taken', errorMsg, 'info');
        return { success: false, message: errorMsg };
      }
    }

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
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
          schoolCover: updates.schoolCover !== undefined ? updates.schoolCover : u.schoolCover,
          currentStudyFocus: updates.currentStudyFocus !== undefined ? updates.currentStudyFocus.trim() : u.currentStudyFocus,
          interests: updates.interests !== undefined ? updates.interests : u.interests
        };
      }
      return u;
    }));

    const successMsg = language === 'bn' ? 'অ্যাকাউন্টের তথ্য সফলভাবে আপডেট হয়েছে! 🎉' : 'Account credentials updated successfully! 🎉';
    showToast(language === 'bn' ? 'আপডেট সফল' : 'Security Updated', successMsg, 'success');
    return { success: true, message: successMsg };
  };

  const updateUserProfile = (profile: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...profile } : u));
    showToast('Profile Updated', 'Your profile and credentials have been updated.', 'success');
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
      setIsLoggedIn(true);
      localStorage.setItem('classmate_is_logged_in', 'true');
      localStorage.setItem('classmate_current_user_id', userId);
      showToast('Switched Persona', `Active profile: ${target.name} (${target.department.split(' ')[0]})`, 'success');
    }
  };

  const loginWithCredentials = (method: 'google' | 'phone' | 'username' | 'password', identifier: string, password?: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().replace('@', '').toLowerCase();
    
    const matched = users.find(u => 
      u.email.toLowerCase() === cleanId || 
      (u.username && u.username.toLowerCase() === cleanId) || 
      u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '') ||
      u.name.toLowerCase() === cleanId
    );

    if (matched) {
      if (password && matched.password && matched.password !== password) {
        const errorMsg = language === 'bn' ? 'পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Incorrect password. Please verify and try again.';
        showToast(language === 'bn' ? 'লগইন ব্যর্থ' : 'Login Failed', errorMsg, 'info');
        return { success: false, message: errorMsg };
      }

      setCurrentUserId(matched.id);
      setIsLoggedIn(true);
      localStorage.setItem('classmate_is_logged_in', 'true');
      localStorage.setItem('classmate_current_user_id', matched.id);
      setIsAuthModalOpen(false);
      setActiveTabState('feed');
      showToast(
        language === 'bn' ? 'স্বাগতম!' : 'Signed In Successfully', 
        `${language === 'bn' ? 'স্বাগতম' : 'Welcome back to ClassMate,'} ${matched.name}!`, 
        'success'
      );
      return { success: true, message: 'Signed in successfully' };
    }

    // Auto-create student
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
      bio: 'Enthusiastic Quantum Cosmo School SSC 2027 student eager to learn and share notes.',
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
    setIsLoggedIn(true);
    localStorage.setItem('classmate_is_logged_in', 'true');
    localStorage.setItem('classmate_current_user_id', newUser.id);
    setIsAuthModalOpen(false);
    setActiveTabState('feed');
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
    schoolCover?: string;
    bio?: string;
    currentStudyFocus?: string;
    interests?: string[];
  }) => {
    const cleanUsername = payload.username 
      ? payload.username.replace('@', '').trim().toLowerCase() 
      : (payload.email ? payload.email.split('@')[0] : payload.name.toLowerCase().replace(/\s+/g, '_'));

    const cleanEmail = payload.email?.trim() || (payload.method === 'google' ? payload.identifier : `${cleanUsername}@gmail.com`);

    const matched = users.find(u => 
      (cleanEmail && u.email.toLowerCase() === cleanEmail.toLowerCase()) ||
      (cleanUsername && u.username && u.username.toLowerCase() === cleanUsername)
    );

    if (matched) {
      setCurrentUserId(matched.id);
      setIsLoggedIn(true);
      localStorage.setItem('classmate_is_logged_in', 'true');
      localStorage.setItem('classmate_current_user_id', matched.id);
      setIsAuthModalOpen(false);
      setActiveTabState('feed');
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
      schoolCover: payload.schoolCover,
      email: cleanEmail,
      phone: payload.phone?.trim() || (payload.method === 'phone' ? payload.identifier : '+880 1700 998877'),
      department: payload.department?.trim() || 'Science (বিজ্ঞান বিভাগ)',
      semester: payload.semester?.trim() || 'SSC 2027 Batch (Class 10)',
      university: payload.university?.trim() || 'Quantum Cosmo School, Lama, Bandarban',
      cgpa: 'GPA 5.00',
      bio: payload.bio?.trim() || `Quantum Cosmo School SSC 2027 candidate (${payload.department || 'Science'}). Ready to collaborate on exams and notes sharing.`,
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
    setIsLoggedIn(true);
    localStorage.setItem('classmate_is_logged_in', 'true');
    localStorage.setItem('classmate_current_user_id', newUser.id);
    setIsAuthModalOpen(false);
    setActiveTabState('feed');
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
      views: 1,
      comments: []
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
  const sendDirectMessage = async (
    receiverId: string, 
    content: string, 
    attachment?: DirectMessage['attachment'],
    voiceAudioUrl?: string,
    voiceDurationSec?: number
  ) => {
    const hash = await computeSha256Digest(content || 'voice_message');
    const newMsg: DirectMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: 'Just now',
      encrypted: true,
      hash,
      attachment,
      voiceAudioUrl,
      voiceDurationSec,
      read: true
    };
    setDirectMessages(prev => [...prev, newMsg]);

    if (receiverId !== currentUser.id) {
      const peer = users.find(u => u.id === receiverId);
      setTimeout(() => {
        const replyMsg: DirectMessage = {
          id: `msg_reply_${Date.now()}`,
          senderId: receiverId,
          receiverId: currentUser.id,
          content: voiceAudioUrl ? `ভয়েস মেসেজ পেয়েছি! খুব সুন্দর শোনাচ্ছে।` : `Got your message! Let's collaborate.`,
          timestamp: 'Just now',
          encrypted: true,
          read: false
        };
        setDirectMessages(prev => [...prev, replyMsg]);
        showToast(`New message from ${peer?.name || 'Classmate'}`, 'Encrypted peer reply received', 'info');
      }, 3000);
    }
  };

  const sendChannelMessage = (
    channelId: string, 
    content: string, 
    attachment?: ChannelMessage['attachment'],
    voiceAudioUrl?: string,
    voiceDurationSec?: number
  ) => {
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
      voiceAudioUrl,
      voiceDurationSec,
      upvotes: 0
    };

    setChannelMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg]
    }));

    setChannels(prev => prev.map(c => c.id === channelId ? {
      ...c,
      lastMessage: voiceAudioUrl ? '🎤 Voice Message' : content,
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
          authorId: currentUser.id,
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
      downloadCount: 0,
      likes: 0,
      likedByUser: false,
      comments: []
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
        blockUser,
        unblockUser,
        issueUserWarning,
        dismissUserWarning,
        adminResetUserPassword,
        adminLoginAsUser,
        deleteMarketplaceItem,
        addCommentToItem,
        deleteDiscussionPost,
        deleteChannel,
        createGroupChannel,
        inviteToGroupChannel,
        removeMemberFromGroup,
        deleteSharedFile,
        toggleLikeSharedFile,
        addCommentToSharedFile,
        systemSettings,
        updateSystemSettings,
        auditLogs,
        clearAuditLogs,
        isDarkMode,
        toggleDarkMode,
        themeMode,
        setThemeMode,
        language,
        setLanguage,
        toggleLanguage,
        t,
        campusPhoto,
        setCampusPhoto,
        resetCampusPhoto,
        appLogo,
        updateAppLogo,
        updateSchoolCover,
        personalDriveItems,
        addPersonalDriveItem,
        deletePersonalDriveItem,
        toggleLikeDriveItem,
        addCommentToDriveItem,
        reels,
        addReel,
        toggleLikeReel,
        addCommentToReel,
        deleteReel,
        educationalNews,
        addEducationalNews,
        toggleLikeEduNews,
        addCommentToEduNews,
        deleteEduNews,
        helpTickets,
        isHelpModalOpen,
        setIsHelpModalOpen,
        submitHelpTicket,
        resolveHelpTicket,
        deleteHelpTicket,
        gamesList,
        addGameTruthOrDare,
        deleteGameTruthOrDare,
        isGoogleSearchOpen,
        setIsGoogleSearchOpen,
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
        isLoggedIn,
        setIsLoggedIn,
        requireAuth,
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
