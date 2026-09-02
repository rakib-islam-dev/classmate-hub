export type AcademicStatus = 'online' | 'studying' | 'in_call' | 'busy' | 'offline';
export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'student';

export type TabType = 'marketplace' | 'messages' | 'feed' | 'files' | 'classmates' | 'profile' | 'admin';
export type ActiveTab = TabType;

export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string;
  avatar: string;
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
}

export interface AdminAuditLog {
  id: string;
  action: string;
  targetName: string;
  performedBy: string;
  timestamp: string;
  details?: string;
  type: 'role' | 'delete' | 'ban' | 'system' | 'broadcast';
}

export interface SystemSettings {
  schoolName: string;
  announcement: string | null;
  allowStudentRegistrations: boolean;
  maintenanceMode: boolean;
  requireListingApproval: boolean;
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
  attachment?: {
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'video' | 'code' | 'zip';
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
  attachment?: {
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'video' | 'code' | 'zip';
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
  fileType: 'pdf' | 'doc' | 'code' | 'slide' | 'zip';
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
