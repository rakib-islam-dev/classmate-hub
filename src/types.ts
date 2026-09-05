export type AcademicStatus = 'online' | 'studying' | 'in_call' | 'busy' | 'offline';
export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'student';
export type ThemeMode = 'dark' | 'light' | 'green' | 'blue' | 'purple' | 'amber';

export type TabType = 
  | 'welcome' 
  | 'marketplace' 
  | 'messages' 
  | 'feed' 
  | 'reels' 
  | 'drive' 
  | 'files' 
  | 'classmates' 
  | 'games' 
  | 'edunews' 
  | 'edu_news'
  | 'profile' 
  | 'admin';

export type ActiveTab = TabType;

export interface UserWarning {
  id: string;
  userId: string;
  issuedBy: string;
  reason: string;
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  avatar: string;
  schoolCover?: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  university: string;
  department: string;
  semester: string;
  cgpa: string;
  status: AcademicStatus;
  currentStudyFocus: string;
  interests: string[];
  bio: string;
  verified: boolean;
  tradesCompleted: number;
  rating: number;
  joinedDate?: string;
  role?: UserRole;
  isImmortalSuperAdmin?: boolean;
  isBanned?: boolean;
  blockedUserIds?: string[];
  warnings?: UserWarning[];
}

export interface HelpTicket {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  subject: string;
  message: string;
  voiceAudioUrl?: string;
  category: 'password_reset' | 'bug' | 'harassment' | 'academic' | 'other' | 'account_access' | 'drive_issue' | 'general_help';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  adminReply?: string;
}

export interface PersonalDriveItem {
  id: string;
  userId: string;
  name: string;
  type: 'image' | 'video' | 'file' | 'audio';
  category: 'Personal' | 'Class Notes' | 'Memories' | 'Assignments' | 'Exam Prep' | 'photo' | 'video' | 'document' | 'other';
  url: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  fileType?: string;
  fileSize?: string;
  size: string;
  uploadedAt: string;
  description?: string;
  isPrivate?: boolean;
  likes: number;
  likedByUser?: boolean;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
}

export interface ReelComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface ReelItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  musicTitle?: string;
  songTitle?: string;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: ReelComment[];
  createdAt: string;
}

export interface EducationalNewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  author?: string;
  source: string;
  category: 'SSC 2027' | 'Science & Tech' | 'Math & Olympiad' | 'General Knowledge' | 'English & ICT' | 'ssc_prep' | 'science' | 'higher_math' | 'ict' | 'general';
  imageUrl?: string;
  coverImage?: string;
  videoUrl?: string;
  readTime?: string;
  publishedAt: string;
  tags?: string[];
  likes: number;
  isLiked?: boolean;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
  externalLink?: string;
}

export interface GameTruthOrDare {
  id: string;
  type: 'truth' | 'dare';
  question: string;
  prompt?: string;
  category: 'School Life' | 'Fun & Friendship' | 'SSC Studies' | 'Crazy Dares' | 'school_life' | 'fun' | 'ssc_study' | 'dares' | string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  targetName: string;
  performedBy: string;
  timestamp: string;
  details?: string;
  type: 'role' | 'delete' | 'ban' | 'system' | 'broadcast' | 'warning' | 'password_reset';
}

export interface SystemSettings {
  schoolName: string;
  appLogo: string;
  defaultCampusPhoto: string;
  announcement: string | null;
  allowStudentRegistrations: boolean;
  maintenanceMode: boolean;
  requireListingApproval: boolean;
  themeMode?: ThemeMode;
}

export type ListingCategory = 
  | 'Textbooks' 
  | 'Handwritten Notes' 
  | 'Calculators & Tech' 
  | 'Lab Equipment' 
  | 'Past Exams & Solutions' 
  | 'Coursework Projects';

export type ListingCondition = 'Like New' | 'Good' | 'Fair' | 'Digital PDF / Code';
export type PriceType = 'trade' | 'sale' | 'free' | 'lend';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  condition: ListingCondition;
  priceType: PriceType;
  price?: number;
  tradeFor?: string;
  courseCode: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerDepartment: string;
  sellerRating: number;
  sellerVerified: boolean;
  createdAt: string;
  isAvailable?: boolean;
  status?: 'available' | 'traded' | 'reserved';
  views?: number;
  likes: number;
  isLikedByUser?: boolean;
  comments?: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  encrypted: boolean;
  read?: boolean;
  hash?: string;
  iv?: string;
  voiceAudioUrl?: string;
  voiceDurationSec?: number;
  attachment?: {
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'video' | 'code' | 'zip' | 'audio';
    size: string;
    encryptedKeySnippet?: string;
  };
}

export interface ChannelMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  encrypted: boolean;
  upvotes?: number;
  voiceAudioUrl?: string;
  voiceDurationSec?: number;
  attachment?: {
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'video' | 'code' | 'zip' | 'audio';
    size: string;
    encryptedKeySnippet?: string;
  };
}

export interface GroupChannel {
  id: string;
  name: string;
  courseCode: string;
  department: string;
  description?: string;
  avatar?: string;
  memberCount: number;
  unreadCount?: number;
  isPrivate: boolean;
  isGlobal?: boolean;
  creatorId?: string;
  creatorName?: string;
  lastMessage?: string;
  lastTimestamp?: string;
  members?: string[];
}

export interface DiscussionPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorDepartment: string;
  authorSemester: string;
  title: string;
  content: string;
  category: 'Project Collaboration' | 'Academic Question' | 'Exam Prep' | 'Campus News' | 'General';
  tags: string[];
  mediaType: 'image' | 'video' | 'none';
  mediaUrl?: string;
  mediaTitle?: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  commentsCount: number;
  comments: {
    id: string;
    authorId?: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
  isPinned?: boolean;
  projectNeeds?: {
    roles: string[];
    teamSize: number;
    currentMembers: number;
    courseCode: string;
  };
}

export interface SharedFile {
  id: string;
  name: string;
  description: string;
  size: string;
  fileType: 'pdf' | 'doc' | 'code' | 'slide' | 'zip' | 'video' | 'image';
  courseCode: string;
  department: string;
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar: string;
  uploadedAt: string;
  downloadCount: number;
  encrypted: boolean;
  hash: string;
  contentPreview?: string;
  likes?: number;
  likedByUser?: boolean;
  comments?: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
}

export interface StudyCallParticipant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
}

export interface ActiveStudyCall {
  id: string;
  title: string;
  courseCode?: string;
  isGroup: boolean;
  type: 'video' | 'audio';
  startedAt?: string;
  startTime?: string | Date;
  participants: StudyCallParticipant[];
  sharedNotes?: string;
}

