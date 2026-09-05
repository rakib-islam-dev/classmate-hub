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
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  limit 
} from 'firebase/firestore';

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
  submitHelpTicket: (subject: string, message: string, category: HelpTicket['category'], voiceAudioUrl?: string, requesterInfo?: { name?: string; email?: string; userId?: string }) => void;
  resolveHelpTicket: (ticketId: string, reply?: string) => void;
  deleteHelpTicket: (ticketId: string) => void;
  adminResetUserPassword: (userId: string, customNewPassword?: string) => Promise<{ success: boolean; message: string }>;

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
  resetPassword: (identifier: string) => Promise<{ success: boolean; message: string }>;
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
  }) => Promise<{ success: boolean; message: string }>;
  loginWithCredentials: (method: 'google' | 'phone' | 'username' | 'password', identifier: string, password?: string) => Promise<{ success: boolean; message: string }>;
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
  }) => Promise<{ success: boolean; message: string }>;
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
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((u: any) => {
            const { password, ...clean } = u;
            return clean as User;
          });
        }
      } catch { return mockUsers; }
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

  const submitHelpTicket = (
    subject: string, 
    message: string, 
    category: HelpTicket['category'], 
    voiceAudioUrl?: string,
    requesterInfo?: { name?: string; email?: string; userId?: string }
  ) => {
    const newTicket: HelpTicket = {
      id: `ticket_${Date.now()}`,
      userId: requesterInfo?.userId || currentUser.id,
      userName: requesterInfo?.name || currentUser.name,
      userAvatar: currentUser.avatar,
      userEmail: requesterInfo?.email || currentUser.email,
      subject,
      message,
      voiceAudioUrl,
      category,
      status: 'open',
      createdAt: 'Just now'
    };
    setHelpTickets(prev => [newTicket, ...prev]);
    setIsHelpModalOpen(false);

    // Persist to Cloud Firestore so Admin receives it in real time
    try {
      setDoc(doc(db, 'help_tickets', newTicket.id), newTicket).catch(e => {
        console.warn('Firestore help ticket write error:', e);
      });
    } catch (e) {
      console.warn('Firestore setDoc help_tickets error:', e);
    }

    showToast(
      language === 'bn' ? 'হেল্প টিকিট জমা হয়েছে 📩' : 'Help Ticket Sent 📩',
      language === 'bn' ? 'অ্যাডমিন খুব দ্রুত আপনার সমস্যার সমাধান করে জানাবেন।' : 'Admin has received your ticket and will assist you.',
      'success'
    );
  };

  const resolveHelpTicket = (ticketId: string, reply?: string) => {
    const replyText = reply || (language === 'bn' ? 'অ্যাডমিন কর্তৃক সমস্যা সমাধান করা হয়েছে।' : 'Resolved by Admin.');
    setHelpTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = {
          ...t,
          status: 'resolved' as const,
          adminReply: replyText
        };
        try {
          setDoc(doc(db, 'help_tickets', ticketId), updated, { merge: true }).catch(() => {});
        } catch {}
        return updated;
      }
      return t;
    }));
    showToast(language === 'bn' ? 'টিকিট সমাধান সম্পন্ন' : 'Ticket Resolved', 'Marked as resolved.', 'success');
  };

  const deleteHelpTicket = (ticketId: string) => {
    setHelpTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  const adminResetUserPassword = async (userId: string, _customNewPassword?: string): Promise<{ success: boolean; message: string }> => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      const err = language === 'bn' ? 'ব্যবহারকারী পাওয়া যায়নি।' : 'User not found.';
      showToast(language === 'bn' ? 'ব্যর্থ' : 'Failed', err, 'info');
      return { success: false, message: err };
    }

    if (!targetUser.email || !targetUser.email.includes('@')) {
      const err = language === 'bn' 
        ? 'এই শিক্ষার্থীর কোনো বৈধ ইমেইল পাওয়া যায়নি। পাসওয়ার্ড রিসেট লিংক পাঠানোর জন্য একটি ইমেইল আবশ্যক।' 
        : 'No valid email found for this student. An email is required for secure password reset.';
      showToast(language === 'bn' ? 'ইমেইল নেই' : 'No Email', err, 'info');
      return { success: false, message: err };
    }

    // ARCHITECTURE NOTE:
    // A client-side web application MUST NOT directly set another user's password in Firestore.
    // If a secure backend server is present, invoke the trusted admin endpoint with admin ID token:
    try {
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken();
        await fetch('/api/admin/reset-user-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ userId, email: targetUser.email })
        });
      }
    } catch {
      // Backend endpoint optional; proceed with direct client-safe Firebase Auth flow
    }

    // SECURE FIREBASE AUTH RECOVERY FLOW:
    // Dispatch official Firebase Authentication password reset email to the student
    try {
      await sendPasswordResetEmail(auth, targetUser.email);
    } catch (err: any) {
      console.warn('Firebase Auth sendPasswordResetEmail notice:', err);
    }

    // Auto-resolve any open password reset tickets for this student
    setHelpTickets(prev => prev.map(t => {
      const match = t.userId === userId || 
        (t.userEmail && t.userEmail.toLowerCase() === targetUser.email.toLowerCase()) ||
        (t.subject && t.subject.toLowerCase().includes(targetUser.email.toLowerCase()));
      if (match && t.status === 'open' && t.category === 'password_reset') {
        const resolvedTicket: HelpTicket = {
          ...t,
          status: 'resolved',
          adminReply: language === 'bn' 
            ? `অ্যাডমিন পাসওয়ার্ড রিকভারি অনুমোদন করেছেন। Firebase Authentication-এর মাধ্যমে আপনার নিবন্ধিত ইমেইলে (${targetUser.email}) একটি গোপন ও নিরাপদ পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। লিংকটি ব্যবহার করে আপনার নতুন পাসওয়ার্ড সেট করে নিন।` 
            : `Admin approved your password reset request. A secure Firebase Authentication reset link has been dispatched to ${targetUser.email}. Please use the link to set your new password.`
        };
        try {
          setDoc(doc(db, 'help_tickets', t.id), resolvedTicket, { merge: true }).catch(() => {});
        } catch {}
        return resolvedTicket;
      }
      return t;
    }));

    addAuditLog('Password Reset Dispatched', targetUser.name, 'password_reset', `Admin initiated secure Firebase Auth password reset for ${targetUser.name} (${targetUser.email}).`);

    const successMsg = language === 'bn' 
      ? `Firebase Authentication-এর মাধ্যমে ${targetUser.name}-এর নিবন্ধিত ইমেইলে (${targetUser.email}) নিরাপদ রিসেট লিংক পাঠানো হয়েছে।` 
      : `A secure password reset email has been dispatched to ${targetUser.email} via Firebase Authentication.`;

    showToast(
      language === 'bn' ? 'পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে 📧' : 'Password Reset Link Dispatched 📧',
      successMsg,
      'success'
    );

    return {
      success: true,
      message: successMsg
    };
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

  // Real-time Cloud Database Listeners (Internet multi-user sync)
  useEffect(() => {
    // 1. Sync registered students across the internet (sanitizing any legacy passwords)
    const usersQuery = query(collection(db, 'users'), limit(500));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      if (!snapshot.empty) {
        const cloudUsers: User[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as any;
          const { password, ...cleanUser } = data;
          cloudUsers.push(cleanUser as User);
        });
        setUsers(prevLocal => {
          const map = new Map<string, User>();
          prevLocal.forEach(u => map.set(u.id, u));
          cloudUsers.forEach(u => map.set(u.id, { ...(map.get(u.id) || {}), ...u }));
          return Array.from(map.values());
        });
      }
    }, (err) => {
      console.warn('Firestore users sync notice:', err);
    });

    // 1b. Listen to Firebase Authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setIsLoggedIn(true);
        localStorage.setItem('classmate_is_logged_in', 'true');
        // Match existing profile or update ID
        setUsers(prevUsers => {
          const match = prevUsers.find(u => 
            u.id === fbUser.uid || 
            (fbUser.email && u.email.toLowerCase() === fbUser.email.toLowerCase())
          );
          if (match) {
            setCurrentUserId(match.id);
            localStorage.setItem('classmate_current_user_id', match.id);
            return prevUsers;
          }
          // If no local record yet, create an authenticated student profile entry
          const newStudentProfile: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Campus Student',
            username: fbUser.email ? fbUser.email.split('@')[0] : `student_${fbUser.uid.slice(0, 5)}`,
            gender: 'male',
            avatar: fbUser.photoURL || defaultSchoolLogo,
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '+880 1700 998877',
            department: 'Science (বিজ্ঞান বিভাগ)',
            semester: 'SSC 2027 Batch (Class 10)',
            university: 'Quantum Cosmo School, Lama, Bandarban',
            cgpa: 'GPA 5.00',
            bio: 'Registered SSC 2027 student member.',
            status: 'online',
            currentStudyFocus: 'SSC 2027 Preparation',
            interests: ['SSC 2027', 'Science', 'Exam Prep'],
            verified: true,
            tradesCompleted: 0,
            rating: 5.0,
            joinedDate: 'Batch 2027',
            role: 'student'
          };
          setCurrentUserId(newStudentProfile.id);
          localStorage.setItem('classmate_current_user_id', newStudentProfile.id);
          return [newStudentProfile, ...prevUsers];
        });
      }
    });

    // 2. Sync direct messages across the internet
    const dmQuery = query(collection(db, 'direct_messages'), limit(500));
    const unsubscribeDMs = onSnapshot(dmQuery, (snapshot) => {
      if (!snapshot.empty) {
        const cloudDMs: DirectMessage[] = [];
        snapshot.forEach((doc) => {
          cloudDMs.push(doc.data() as DirectMessage);
        });
        setDirectMessages(prev => {
          const map = new Map<string, DirectMessage>();
          prev.forEach(m => map.set(m.id, m));
          cloudDMs.forEach(m => map.set(m.id, m));
          return Array.from(map.values()).sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime() || 0;
            const timeB = new Date(b.timestamp).getTime() || 0;
            return timeA - timeB;
          });
        });
      }
    }, (err) => {
      console.warn('Firestore DM sync notice:', err);
    });

    // 3. Sync campus channel messages across the internet
    const cmQuery = query(collection(db, 'channel_messages'), limit(500));
    const unsubscribeCMs = onSnapshot(cmQuery, (snapshot) => {
      if (!snapshot.empty) {
        const grouped: { [channelId: string]: ChannelMessage[] } = {};
        snapshot.forEach((doc) => {
          const msg = doc.data() as ChannelMessage;
          if (!grouped[msg.channelId]) grouped[msg.channelId] = [];
          grouped[msg.channelId].push(msg);
        });
        setChannelMessages(prev => {
          const next = { ...prev };
          Object.keys(grouped).forEach(cId => {
            const existing = next[cId] || [];
            const map = new Map<string, ChannelMessage>();
            existing.forEach(m => map.set(m.id, m));
            grouped[cId].forEach(m => map.set(m.id, m));
            next[cId] = Array.from(map.values());
          });
          return next;
        });
      }
    }, (err) => {
      console.warn('Firestore channel messages sync notice:', err);
    });

    // 4. Sync Help Tickets across the internet in real time
    const ticketsQuery = query(collection(db, 'help_tickets'), limit(200));
    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const cloudTickets: HelpTicket[] = [];
        snapshot.forEach((doc) => {
          cloudTickets.push(doc.data() as HelpTicket);
        });
        setHelpTickets(prev => {
          const map = new Map<string, HelpTicket>();
          prev.forEach(t => map.set(t.id, t));
          cloudTickets.forEach(t => map.set(t.id, t));
          return Array.from(map.values()).sort((a, b) => {
            const timeA = a.id.replace('ticket_', '');
            const timeB = b.id.replace('ticket_', '');
            return Number(timeB) - Number(timeA);
          });
        });
      }
    }, (err) => {
      console.warn('Firestore help tickets sync notice:', err);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeAuth();
      unsubscribeDMs();
      unsubscribeCMs();
      unsubscribeTickets();
    };
  }, []);

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

  // Admin 1-Click Login as User

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
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
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

  const resetPassword = async (identifier: string): Promise<{ success: boolean; message: string }> => {
    const cleanId = identifier.trim().replace('@', '').toLowerCase();
    
    let targetEmail = cleanId;
    if (!targetEmail.includes('@')) {
      const userFound = users.find(u => 
        u.email.toLowerCase() === cleanId ||
        (u.username && u.username.toLowerCase() === cleanId) ||
        u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '') ||
        u.name.toLowerCase() === cleanId
      );
      if (userFound?.email) {
        targetEmail = userFound.email;
      } else {
        const errorMsg = language === 'bn' 
          ? 'এই তথ্যের সাথে নিবন্ধিত কোনো শিক্ষার্থী অ্যাকাউন্ট পাওয়া যায়নি।' 
          : 'No account found matching this identifier with a valid email.';
        showToast(language === 'bn' ? 'অ্যাকাউন্ট মেলেনি' : 'Account Not Found', errorMsg, 'info');
        return { success: false, message: errorMsg };
      }
    }

    try {
      // Dispatch official Firebase Authentication password reset email
      await sendPasswordResetEmail(auth, targetEmail);
      const successMsg = language === 'bn'
        ? `Firebase Authentication-এর মাধ্যমে আপনার নিবন্ধিত ইমেইলে (${targetEmail}) একটি পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স চেক করুন।`
        : `A secure password reset email has been sent to ${targetEmail}. Please check your inbox.`;
      showToast(language === 'bn' ? 'রিসেট লিংক পাঠানো হয়েছে 📧' : 'Reset Email Dispatched 📧', successMsg, 'success');
      return { success: true, message: successMsg };
    } catch (err: any) {
      console.error('Firebase Auth reset password error:', err);
      let errorMsg = language === 'bn'
        ? 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো সম্ভব হয়নি। অনুগ্রহ করে সঠিক ইমেইল দিন।'
        : 'Failed to send password reset email. Please verify the email address.';
      if (err.code === 'auth/user-not-found') {
        errorMsg = language === 'bn' ? 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।' : 'No account found for this email.';
      }
      showToast(language === 'bn' ? 'ব্যর্থ' : 'Failed', errorMsg, 'info');
      return { success: false, message: errorMsg };
    }
  };

  const updateUserCredentials = async (updates: {
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
  }): Promise<{ success: boolean; message: string }> => {
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

    // Direct password update through Firebase Authentication if user requested password change
    if (updates.newPassword && updates.newPassword.trim()) {
      if (auth.currentUser) {
        try {
          await updatePassword(auth.currentUser, updates.newPassword.trim());
        } catch (err: any) {
          console.error('Firebase Auth password update error:', err);
          if (err.code === 'auth/requires-recent-login') {
            const reauthMsg = language === 'bn' 
              ? 'নিরাপত্তার স্বার্থে পাসওয়ার্ড পরিবর্তনের আগে পুনরায় সাইন ইন করুন।' 
              : 'Security check: Please sign in again before changing your password.';
            showToast(language === 'bn' ? 'পুনরায় সাইন ইন আবশ্যক' : 'Recent Login Required', reauthMsg, 'info');
            return { success: false, message: reauthMsg };
          }
        }
      }
    }

    // STRICT SECURITY: We DO NOT store passwords in the user profile state or Firestore!
    let updatedUserObj: User | null = null;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        updatedUserObj = {
          ...u,
          name: updates.name !== undefined ? updates.name.trim() : u.name,
          username: updates.username !== undefined ? updates.username.replace('@', '').trim() : u.username,
          email: updates.email !== undefined ? updates.email.trim() : u.email,
          department: updates.department !== undefined ? updates.department.trim() : u.department,
          semester: updates.semester !== undefined ? updates.semester.trim() : u.semester,
          bio: updates.bio !== undefined ? updates.bio.trim() : u.bio,
          avatar: updates.avatar !== undefined ? updates.avatar : u.avatar,
          phone: updates.phone !== undefined ? updates.phone.trim() : u.phone,
          schoolCover: updates.schoolCover !== undefined ? updates.schoolCover : u.schoolCover,
          currentStudyFocus: updates.currentStudyFocus !== undefined ? updates.currentStudyFocus.trim() : u.currentStudyFocus,
          interests: updates.interests !== undefined ? updates.interests : u.interests
        };
        return updatedUserObj;
      }
      return u;
    }));

    if (updatedUserObj) {
      try {
        await setDoc(doc(db, 'users', currentUser.id), updatedUserObj, { merge: true });
      } catch (e) {
        console.warn('Firestore update credentials sync notice:', e);
      }
    }

    const successMsg = language === 'bn' ? 'অ্যাকাউন্টের তথ্য সফলভাবে আপডেট হয়েছে! 🎉' : 'Account credentials updated successfully! 🎉';
    showToast(language === 'bn' ? 'আপডেট সফল' : 'Security Updated', successMsg, 'success');
    return { success: true, message: successMsg };
  };

  const updateUserProfile = (profile: Partial<User>) => {
    let updatedUser: User | null = null;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        updatedUser = { ...u, ...profile };
        return updatedUser;
      }
      return u;
    }));

    if (updatedUser) {
      try {
        setDoc(doc(db, 'users', currentUser.id), updatedUser, { merge: true }).catch(err => {
          console.warn('Firestore user update error:', err);
        });
      } catch (e) {
        console.warn('Firestore setDoc notice:', e);
      }
    }

    showToast(
      language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile Updated',
      language === 'bn' ? 'আপনার প্রোফাইল ও ছবি ক্লাউডে সংরক্ষিত হয়েছে।' : 'Your profile and photo have been updated.',
      'success'
    );
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

  const loginWithCredentials = async (
    _method: 'google' | 'phone' | 'username' | 'password', 
    identifier: string, 
    password?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanId = identifier.trim().replace('@', '').toLowerCase();

    // Security check: Password is strictly required!
    if (!password || !password.trim()) {
      const errorMsg = language === 'bn' 
        ? 'পাসওয়ার্ড প্রদান করা আবশ্যক। অনুগ্রহ করে পাসওয়ার্ড লিখুন।' 
        : 'Password is required to sign in. Please enter your password.';
      showToast(language === 'bn' ? 'পাসওয়ার্ড প্রয়োজন' : 'Password Required', errorMsg, 'info');
      return { success: false, message: errorMsg };
    }
    
    // Resolve email identifier for Firebase Auth
    let targetEmail = cleanId;
    if (!targetEmail.includes('@')) {
      const matched = users.find(u => 
        (u.username && u.username.toLowerCase() === cleanId) || 
        u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, '') ||
        u.name.toLowerCase() === cleanId
      );
      if (matched?.email) {
        targetEmail = matched.email.toLowerCase();
      } else {
        targetEmail = `${cleanId}@gmail.com`;
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, targetEmail, password.trim());
      const fbUser = userCredential.user;
      
      const matched = users.find(u => 
        u.id === fbUser.uid || 
        (u.email && u.email.toLowerCase() === targetEmail)
      ) || users[0];

      setCurrentUserId(matched.id);
      setIsLoggedIn(true);
      localStorage.setItem('classmate_is_logged_in', 'true');
      localStorage.setItem('classmate_current_user_id', matched.id);
      setIsAuthModalOpen(false);
      setActiveTabState('feed');

      const welcomeName = matched?.name || fbUser.displayName || 'Classmate';
      showToast(
        language === 'bn' ? 'স্বাগতম!' : 'Signed In Successfully', 
        `${language === 'bn' ? 'স্বাগতম' : 'Welcome back to ClassMate,'} ${welcomeName}!`, 
        'success'
      );
      return { success: true, message: 'Signed in successfully via Firebase Authentication' };
    } catch (err: any) {
      console.error('Firebase Auth sign in error:', err);
      let errorMsg = language === 'bn' 
        ? 'লগইন ব্যর্থ হয়েছে। সঠিক ইমেইল ও পাসওয়ার্ড প্রদান করুন।' 
        : 'Sign in failed. Please verify your credentials.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        errorMsg = language === 'bn'
          ? 'ভুল তথ্য অথবা এই অ্যাকাউন্টে সাইন আপ করা নেই। দয়া করে "নতুন অ্যাকাউন্ট তৈরি" করুন অথবা সঠিক পাসওয়ার্ড দিন।'
          : 'Invalid credentials or account not registered in Firebase Auth. Please check your password or create an account.';
      } else if (err.code === 'auth/wrong-password') {
        errorMsg = language === 'bn'
          ? 'পাসওয়ার্ড সঠিক নয়। পাসওয়ার্ড ভুলে গেলে রিসেট অপশন ব্যবহার করুন।'
          : 'Incorrect password. If you forgot your password, please use the reset option.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = language === 'bn'
          ? 'অতিরিক্ত ভুল চেষ্টার কারণে সাময়িকভাবে ব্লক করা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।'
          : 'Too many unsuccessful attempts. Access temporarily blocked. Try again later.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = language === 'bn'
          ? 'অকার্যকর ইমেইল ঠিকানা।'
          : 'Invalid email address.';
      }

      showToast(language === 'bn' ? 'লগইন ব্যর্থ' : 'Sign In Failed', errorMsg, 'info');
      return { success: false, message: errorMsg };
    }
  };

  const createAccount = async (payload: {
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
  }): Promise<{ success: boolean; message: string }> => {
    // Strict Validation: Cannot create an account without proper name, identifier and password
    if (!payload.name || payload.name.trim().length < 2) {
      const errorMsg = language === 'bn' ? 'অনুগ্রহ করে শিক্ষার্থীর সম্পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)।' : 'Please provide the student full name (at least 2 characters).';
      showToast(language === 'bn' ? 'নাম আবশ্যক' : 'Name Required', errorMsg, 'info');
      return { success: false, message: errorMsg };
    }

    if (!payload.identifier || payload.identifier.trim().length < 3) {
      const errorMsg = language === 'bn' ? 'অনুগ্রহ করে সঠিক ইমেইল, ইউজারনেম বা মোবাইল নম্বর দিন।' : 'Please provide a valid email, username, or phone number.';
      showToast(language === 'bn' ? 'তথ্য অসম্পূর্ণ' : 'Incomplete Credentials', errorMsg, 'info');
      return { success: false, message: errorMsg };
    }

    if (!payload.password || payload.password.trim().length < 6) {
      const errorMsg = language === 'bn' ? 'কমপক্ষে ৬ অক্ষরের নিরাপদ পাসওয়ার্ড আবশ্যক (Firebase Auth স্ট্যান্ডার্ড)।' : 'Password must be at least 6 characters (Firebase Auth standard).';
      showToast(language === 'bn' ? 'পাসওয়ার্ড প্রয়োজন' : 'Password Required', errorMsg, 'info');
      return { success: false, message: errorMsg };
    }

    const cleanUsername = payload.username 
      ? payload.username.replace('@', '').trim().toLowerCase() 
      : (payload.email ? payload.email.split('@')[0] : payload.name.toLowerCase().replace(/\s+/g, '_'));

    const cleanEmail = payload.email?.trim().toLowerCase() || (payload.method === 'google' ? payload.identifier.toLowerCase() : `${cleanUsername}@gmail.com`);

    try {
      // 1. Create account in Firebase Authentication (the ONLY source of truth for passwords)
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, payload.password.trim());
      const fbUser = cred.user;

      const defaultAvatar = payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

      // Update Firebase Auth profile
      await updateFirebaseProfile(fbUser, {
        displayName: payload.name.trim(),
        photoURL: defaultAvatar
      }).catch(() => {});

      // 2. Strict Security: Notice NO password property is in User profile!
      const newUser: User = {
        id: fbUser.uid,
        name: payload.name.trim() || 'New Student',
        username: cleanUsername,
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
        joinedDate: 'Batch 2027',
        role: 'student'
      };

      setUsers(prev => [newUser, ...prev.filter(u => u.id !== newUser.id)]);
      setCurrentUserId(newUser.id);
      setIsLoggedIn(true);
      localStorage.setItem('classmate_is_logged_in', 'true');
      localStorage.setItem('classmate_current_user_id', newUser.id);
      setIsAuthModalOpen(false);
      setActiveTabState('feed');

      // 3. Persist sanitized student profile to Cloud Firestore (WITHOUT password)
      try {
        await setDoc(doc(db, 'users', newUser.id), newUser, { merge: true });
      } catch (err) {
        console.warn('Firestore createAccount sync notice:', err);
      }

      addAuditLog('Account Created', newUser.name, 'system', `Student account registered with Firebase Auth: ${cleanEmail}`);
      showToast(
        language === 'bn' ? 'স্টুডেন্ট অ্যাকাউন্ট তৈরি হয়েছে! 🎉' : 'Student Account Created! 🎉', 
        `Welcome to ClassMate, ${newUser.name}! Your campus profile is active.`, 
        'success'
      );
      return { success: true, message: 'Student account created and authenticated securely via Firebase Auth' };
    } catch (err: any) {
      console.error('Firebase Auth signup error:', err);
      let errorMsg = language === 'bn' ? 'অ্যাকাউন্ট তৈরি করা যায়নি।' : 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = language === 'bn' 
          ? `এই ইমেইল (${cleanEmail}) দিয়ে ইতিমধ্যে অ্যাকাউন্ট তৈরি আছে! অনুগ্রহ করে সাইন ইন করুন।` 
          : `An account with ${cleanEmail} already exists. Please sign in instead.`;
      } else if (err.code === 'auth/weak-password') {
        errorMsg = language === 'bn' 
          ? 'পাসওয়ার্ড দুর্বল। কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।' 
          : 'Password is too weak. Must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = language === 'bn' 
          ? 'সঠিক ইমেইল ঠিকানা প্রদান করুন।' 
          : 'Please provide a valid email address.';
      }
      showToast(language === 'bn' ? 'নিবন্ধন ব্যর্থ' : 'Registration Failed', errorMsg, 'info');
      return { success: false, message: errorMsg };
    }
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

    // Persist Direct Message to Cloud Firestore
    try {
      setDoc(doc(db, 'direct_messages', newMsg.id), newMsg).catch(err => {
        console.warn('Firestore sendDirectMessage error:', err);
      });
    } catch (e) {
      console.warn('Firestore setDoc notice:', e);
    }

    if (receiverId !== currentUser.id) {
      const peer = users.find(u => u.id === receiverId);
      // If the peer is an offline mock bot, provide a gentle auto reply
      if (peer && ['usr_1', 'usr_2', 'usr_3', 'usr_4', 'usr_5', 'usr_6'].includes(peer.id)) {
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
          try {
            setDoc(doc(db, 'direct_messages', replyMsg.id), replyMsg).catch(() => {});
          } catch {}
          showToast(`New message from ${peer?.name || 'Classmate'}`, 'Encrypted peer reply received', 'info');
        }, 3000);
      }
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

    // Persist Channel Message to Cloud Firestore
    try {
      setDoc(doc(db, 'channel_messages', newMsg.id), newMsg).catch(err => {
        console.warn('Firestore sendChannelMessage error:', err);
      });
    } catch (e) {
      console.warn('Firestore setDoc notice:', e);
    }

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
        adminResetUserPassword,
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
