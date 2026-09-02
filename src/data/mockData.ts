import { User, MarketplaceItem, DirectMessage, GroupChannel, ChannelMessage, DiscussionPost, SharedFile, AdminAuditLog, SystemSettings } from '../types';
import rakibulAvatar from '../assets/images/rakibul_islam_avatar_1788088663745.jpg';

export { rakibulAvatar };

export const defaultSystemSettings: SystemSettings = {
  schoolName: 'Quantum Cosmo School (SSC 2027 Batch)',
  announcement: '📢 স্বাগতম Quantum Cosmo School SSC 2027 ব্যাচ! পদার্থবিজ্ঞান, রসায়ন, উচ্চতর গণিত ও বায়োলজি টেস্ট পেপার সলিউশন এবং নোটস ভল্টে যুক্ত হয়েছে। সহপাঠীদের সাথে স্টাডি রুমে জয়েন করুন।',
  allowStudentRegistrations: true,
  maintenanceMode: false,
  requireListingApproval: false
};

export const mockAuditLogs: AdminAuditLog[] = [
  {
    id: 'log_1',
    action: 'Platform Initialization',
    targetName: 'Quantum Cosmo School SSC 2027 Hub',
    performedBy: 'Rakibul Islam (Founder & Super Admin)',
    timestamp: '2 hours ago',
    details: 'Quantum Cosmo School SSC 2027 Batch Master Super Admin initialized.',
    type: 'system'
  },
  {
    id: 'log_2',
    action: 'Role Verified',
    targetName: 'Tahsin Ahmed',
    performedBy: 'Rakibul Islam',
    timestamp: '1 hour ago',
    details: 'Verified SSC 2027 Science Group badge approved.',
    type: 'role'
  }
];

export const mockUsers: User[] = [
  {
    id: 'usr_1',
    name: 'Rakibul Islam',
    username: 'rakibul_qcs27',
    password: 'password123',
    gender: 'male',
    avatar: rakibulAvatar,
    email: 'rakibulislamq1673@gmail.com',
    phone: '+880 1711 223344',
    department: 'Science (বিজ্ঞান বিভাগ)',
    semester: 'SSC 2027 Batch (Class 10)',
    university: 'Quantum Cosmo School, Lama, Bandarban',
    cgpa: 'GPA 5.00',
    bio: 'Quantum Cosmo School SSC 2027 Batch (Science Group). Founder & Super Admin. Focusing on SSC Physics, Higher Math, ICT and Olympiads.',
    status: 'studying',
    currentStudyFocus: 'SSC 2027: Physics Ch-4 (কাজ, ক্ষমতা ও শক্তি) & Higher Math Calculus/Trigonometry',
    interests: ['Physics CQ & MCQ', 'Higher Math', 'ICT & Programming', 'Science Olympiad', 'Astronomy'],
    verified: true,
    tradesCompleted: 18,
    rating: 5.0,
    joinedDate: 'Batch 2027',
    role: 'super_admin',
    isImmortalSuperAdmin: true
  },
  {
    id: 'usr_2',
    name: 'Sumaiya Akter',
    username: 'sumaiya_science',
    password: 'password123',
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    email: 'sumaiya.qcs27@gmail.com',
    phone: '+880 1812 334455',
    department: 'Science (বিজ্ঞান বিভাগ)',
    semester: 'SSC 2027 Batch (Class 10)',
    university: 'Quantum Cosmo School, Lama, Bandarban',
    cgpa: 'GPA 5.00',
    bio: 'SSC 2027 Candidate at Quantum Cosmo School. Passionate about Biology mindmaps, Chemistry reactions, and Botany diagrams.',
    status: 'online',
    currentStudyFocus: 'SSC Biology Ch-8 (রেচন প্রক্রিয়া) & Chemistry Periodic Table',
    interests: ['Biology Mindmaps', 'Chemistry Reactions', 'English 2nd Paper', 'Math Tricks'],
    verified: true,
    tradesCompleted: 14,
    rating: 4.9,
    joinedDate: 'Batch 2027',
    role: 'moderator'
  },
  {
    id: 'usr_3',
    name: 'Tanvir Hossain',
    username: 'tanvir_qcs',
    password: 'password123',
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    email: 'tanvir.qcs27@gmail.com',
    phone: '+880 1913 445566',
    department: 'Science (বিজ্ঞান বিভাগ)',
    semester: 'SSC 2027 Batch (Class 10)',
    university: 'Quantum Cosmo School, Lama, Bandarban',
    cgpa: 'GPA 4.95',
    bio: 'Quantum Cosmo School Science Club lead. Love solving complex Physics numerical problems, circuits, and General Math geometry.',
    status: 'in_call',
    currentStudyFocus: 'Physics Ch-11 (চল তড়িৎ - Current Electricity) Circuit Analysis',
    interests: ['Physics Circuits', 'General Math Geometry', 'Robotics & Hardware', 'Cosmo Sports'],
    verified: true,
    tradesCompleted: 22,
    rating: 5.0,
    joinedDate: 'Batch 2027'
  },
  {
    id: 'usr_4',
    name: 'Nusrat Jahan',
    username: 'nusrat_commerce',
    password: 'password123',
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    email: 'nusrat.qcs27@gmail.com',
    phone: '+880 1614 556677',
    department: 'Business Studies (ব্যবসায় শিক্ষা)',
    semester: 'SSC 2027 Batch (Class 10)',
    university: 'Quantum Cosmo School, Lama, Bandarban',
    cgpa: 'GPA 5.00',
    bio: 'Quantum Cosmo School SSC 2027 Business Studies topper. Sharing neatly organized Accounting ledger sheets and Finance formulas.',
    status: 'studying',
    currentStudyFocus: 'Accounting Ch-6 (জাবেদা ও খতিয়ান) & Finance TVM (Time Value of Money)',
    interests: ['Accounting Ledger', 'Finance & Banking', 'Business Entrepreneurship', 'English Essay'],
    verified: true,
    tradesCompleted: 11,
    rating: 4.9,
    joinedDate: 'Batch 2027'
  },
  {
    id: 'usr_5',
    name: 'Arefin Shuvo',
    username: 'arefin_arts',
    password: 'password123',
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    email: 'arefin.qcs27@gmail.com',
    phone: '+880 1515 667788',
    department: 'Humanities (মানবিক বিভাগ)',
    semester: 'SSC 2027 Batch (Class 10)',
    university: 'Quantum Cosmo School, Lama, Bandarban',
    cgpa: 'GPA 4.88',
    bio: 'SSC 2027 Humanities Group at Quantum Cosmo School. History timeline charts, Civics notes, and Bangladesh Studies guides available.',
    status: 'online',
    currentStudyFocus: 'Bangladesh & Global Studies (BGS) Ch-1 (পূর্ব বাংলার আন্দোলন ও জাতীয়তাবাদ)',
    interests: ['History & Civics', 'Geography Maps', 'Bangla Literature', 'Debate & Public Speaking'],
    verified: true,
    tradesCompleted: 15,
    rating: 4.8,
    joinedDate: 'Batch 2027'
  },
  {
    id: 'usr_6',
    name: 'Tahsin Ahmed',
    username: 'tahsin_highermath',
    password: 'password123',
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    email: 'tahsin.qcs27@gmail.com',
    phone: '+880 1718 889900',
    department: 'Science (বিজ্ঞান বিভাগ)',
    semester: 'SSC 2027 Batch (Class 10)',
    university: 'Quantum Cosmo School, Lama, Bandarban',
    cgpa: 'GPA 5.00',
    bio: 'Quantum Cosmo School SSC 2027 Science Squad. Higher Math Vector, Trigonometry, and ICT C Programming problem solver.',
    status: 'online',
    currentStudyFocus: 'SSC Higher Math: Coordinate Geometry (স্থানাঙ্ক জ্যামিতি) & Vector',
    interests: ['Higher Math', 'ICT Programming', 'Physics CQ Solutions', 'Chess'],
    verified: true,
    tradesCompleted: 26,
    rating: 5.0,
    joinedDate: 'Batch 2027'
  }
];

export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: 'item_1',
    title: 'SSC 2027 Higher Math Complete Formula & CQ Made Easy',
    description: 'Quantum Cosmo School SSC 2027 Batch exclusive handwritten notebook covering Trigonometry, Vector, Coordinate Geometry, and Probability with 5-year board questions solved.',
    category: 'Handwritten Notes',
    condition: 'Like New',
    priceType: 'trade',
    tradeFor: 'SSC Physics Chapter 4-11 Top School Test Paper Solutions',
    courseCode: 'SSC Higher Math',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr_6',
    sellerName: 'Tahsin Ahmed',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    sellerDepartment: 'Science (বিজ্ঞান বিভাগ)',
    sellerRating: 5.0,
    sellerVerified: true,
    status: 'available',
    createdAt: '2 hours ago',
    likes: 24,
    views: 118
  },
  {
    id: 'item_2',
    title: 'SSC 2027 Physics & Chemistry Complete Reaction & Formula Deck',
    description: 'Crisp laminated formula sheet with color-coded diagrams for Light Reflection/Refraction, Electricity formulas, and Organic Chemistry reactions for SSC 2027 batch.',
    category: 'Handwritten Notes',
    condition: 'Like New',
    priceType: 'free',
    courseCode: 'SSC Science',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr_1',
    sellerName: 'Rakibul Islam',
    sellerAvatar: rakibulAvatar,
    sellerDepartment: 'Science (বিজ্ঞান বিভাগ)',
    sellerRating: 5.0,
    sellerVerified: true,
    status: 'available',
    createdAt: '5 hours ago',
    likes: 42,
    views: 195
  },
  {
    id: 'item_3',
    title: 'Casio fx-991EX ClassWiz Scientific Calculator (SSC Board Approved)',
    description: 'Original high-precision scientific calculator with solar panel and matrix/equation solver. Approved for all SSC 2027 Board exams.',
    category: 'Calculators & Tech',
    condition: 'Like New',
    priceType: 'sale',
    price: 15,
    courseCode: 'Math / Physics / Chem',
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr_3',
    sellerName: 'Tanvir Hossain',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    sellerDepartment: 'Science (বিজ্ঞান বিভাগ)',
    sellerRating: 5.0,
    sellerVerified: true,
    status: 'available',
    createdAt: '1 day ago',
    likes: 31,
    views: 142
  },
  {
    id: 'item_4',
    title: 'Quantum Cosmo School Science Practical Lab & Geometry Box Set',
    description: 'Full scientific geometry box with divider, compass, set squares, and dissection box instruments for Class 9-10 Biology practicals.',
    category: 'Lab Equipment',
    condition: 'Good',
    priceType: 'lend',
    tradeFor: 'Lend for 2 weeks in exchange for SSC Biology Diagram Master Guide',
    courseCode: 'SSC Practical',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr_3',
    sellerName: 'Tanvir Hossain',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    sellerDepartment: 'Science (বিজ্ঞান বিভাগ)',
    sellerRating: 5.0,
    sellerVerified: true,
    status: 'available',
    createdAt: '2 days ago',
    likes: 19,
    views: 89
  },
  {
    id: 'item_5',
    title: 'SSC 2027 Accounting & Finance Past 5 Years Top School Test Papers',
    description: 'Comprehensive solved question bank for SSC 2027 Business Studies with step-by-step balance sheets, cash flows, and trial balances.',
    category: 'Past Exams & Solutions',
    condition: 'Digital PDF / Code',
    priceType: 'free',
    courseCode: 'SSC Accounting',
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
    ],
    sellerId: 'usr_4',
    sellerName: 'Nusrat Jahan',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    sellerDepartment: 'Business Studies (ব্যবসায় শিক্ষা)',
    sellerRating: 4.9,
    sellerVerified: true,
    status: 'available',
    createdAt: '3 days ago',
    likes: 38,
    views: 180
  }
];

export const mockDirectMessages: DirectMessage[] = [
  {
    id: 'msg_1',
    senderId: 'usr_6',
    receiverId: 'usr_1',
    content: 'Hey Rakibul! I saw your SSC 2027 Physics formula sheet in the vault. Are you available for a quick study session on Chapter 4 (কাজ, ক্ষমতা ও শক্তি) CQ solutions tonight?',
    timestamp: '10:14 AM',
    encrypted: true,
    hash: '8f7a932b10cd99ef1a',
    read: true
  },
  {
    id: 'msg_2',
    senderId: 'usr_1',
    receiverId: 'usr_6',
    content: 'Hey Tahsin! Absolutely. I am also preparing for the upcoming model test. Let us start a live video study call in the Science Squad room around 8 PM.',
    timestamp: '10:18 AM',
    encrypted: true,
    hash: '5d2e741c88ba03ac49',
    read: true
  },
  {
    id: 'msg_3',
    senderId: 'usr_6',
    receiverId: 'usr_1',
    content: 'Awesome! I attached the SSC 2027 Higher Math coordinate geometry shortcut trick sheet.',
    timestamp: '10:20 AM',
    encrypted: true,
    attachment: {
      name: 'SSC_2027_HigherMath_CoordinateGeometry_Shortcuts.pdf',
      url: '#',
      type: 'pdf',
      size: '1.8 MB',
      encryptedKeySnippet: 'sec_key_qcs27_math'
    },
    read: true
  },
  {
    id: 'msg_4',
    senderId: 'usr_2',
    receiverId: 'usr_1',
    content: 'Hi Rakibul, is the Chemistry periodic table and valency chart swap still open?',
    timestamp: 'Yesterday',
    encrypted: true,
    read: true
  }
];

export const mockChannels: GroupChannel[] = [
  {
    id: 'chan_all_students',
    name: '🌐 All Students & Teachers Global Hub (সবার উন্মুক্ত গ্রুপ)',
    description: 'Quantum Cosmo School SSC 2027 Universal Group: Science, Business Studies & Humanities candidates, teachers and study leaders. Everyone can chat with everyone freely!',
    courseCode: 'ALL-BATCH-2027',
    department: 'Universal (সকল শিক্ষার্থী ও শিক্ষক)',
    avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
    memberCount: 156,
    unreadCount: 4,
    isPrivate: false,
    isGlobal: true,
    lastMessage: 'স্বাগতম সবাইকে! এই গ্রুপে ২০২৭ ব্যাচের সকল শিক্ষার্থী ও শিক্ষক উন্মুক্তভাবে পড়াশোনা ও আলোচনা করতে পারবেন।',
    lastTimestamp: '11:45 AM'
  },
  {
    id: 'chan_ssc2027_science',
    name: '🔬 SSC 2027 Science Squad (বিজ্ঞান বিভাগ)',
    description: 'Quantum Cosmo School SSC 2027 Science Group: Physics, Chemistry, Higher Math & Biology CQ/MCQ prep.',
    courseCode: 'SSC-SCIENCE',
    department: 'Science (বিজ্ঞান বিভাগ)',
    avatar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80',
    memberCount: 52,
    unreadCount: 3,
    isPrivate: false,
    lastMessage: 'Anyone ready to solve the Physics Chapter 11 circuit math in live call?',
    lastTimestamp: '11:30 AM'
  },
  {
    id: 'chan_ssc2027_math_ict',
    name: '📐 Higher Math & ICT Olympiad Squad',
    description: 'Higher Math problem solving, Trigonometry, Vectors, and ICT C Programming & HTML.',
    courseCode: 'HMATH-ICT',
    department: 'Science & Tech',
    avatar: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80',
    memberCount: 46,
    unreadCount: 0,
    isPrivate: false,
    lastMessage: 'Uploaded coordinate geometry formulas to the vault!',
    lastTimestamp: '9:45 AM'
  },
  {
    id: 'chan_ssc2027_commerce',
    name: '📊 SSC 2027 Commerce & Arts Hub',
    description: 'Accounting, Finance & Banking, Business Org, History & BGS discussion group.',
    courseCode: 'COMM-ARTS',
    department: 'Commerce & Humanities',
    avatar: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80',
    memberCount: 38,
    unreadCount: 1,
    isPrivate: false,
    lastMessage: 'Accounting trial balance sheet notes are available now.',
    lastTimestamp: 'Yesterday'
  },
  {
    id: 'chan_qcs_campus',
    name: '🏔️ Quantum Cosmo School Campus & Activity',
    description: 'Lama Bandarban campus ground, morning meditation, gymnastics, sports & cultural events.',
    courseCode: 'QCS-CAMPUS',
    department: 'Quantum Cosmo School',
    avatar: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&auto=format&fit=crop&q=80',
    memberCount: 88,
    unreadCount: 0,
    isPrivate: false,
    lastMessage: 'Ground practice and meditation schedule for this weekend.',
    lastTimestamp: '2 days ago'
  }
];

export const mockChannelMessages: { [channelId: string]: ChannelMessage[] } = {
  chan_all_students: [
    {
      id: 'cmsg_all_1',
      channelId: 'chan_all_students',
      senderId: 'usr_1',
      senderName: 'Rakibul Islam',
      senderAvatar: rakibulAvatar,
      content: 'স্বাগতম Quantum Cosmo School SSC 2027 ব্যাচের সকল শিক্ষার্থী ও শিক্ষকদের! এই উন্মুক্ত গ্রুপে বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগের সবাই একসাথে যুক্ত হয়ে নোটস শেয়ার, প্রশ্ন সমাধান ও আলোচনা করতে পারবেন।',
      timestamp: '8:30 AM',
      encrypted: false,
      upvotes: 28
    },
    {
      id: 'cmsg_all_2',
      channelId: 'chan_all_students',
      senderId: 'usr_2',
      senderName: 'Sumaiya Akter',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      content: 'শুভ সকাল সবাইকে! বাংলা ১ম পত্র ও ইংরেজি ২য় পত্রের ব্যাকরণ ও প্যারাগ্রাফ সাজেশন ভল্টে যুক্ত হয়েছে। সবাই চেক করতে পারেন।',
      timestamp: '9:15 AM',
      encrypted: false,
      upvotes: 19
    },
    {
      id: 'cmsg_all_3',
      channelId: 'chan_all_students',
      senderId: 'usr_4',
      senderName: 'Nusrat Jahan',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      content: 'সাধারণ গণিত (General Math) অধ্যায় ২ (সেট ও ফাংশন) এবং অধ্যায় ৩ (বীজগাণিতিক রাশি) নিয়ে কার কার সমস্যা আছে? আজ বিকেলে একটা কম্বাইন্ড স্টাডি কল করা যাক।',
      timestamp: '10:00 AM',
      encrypted: false,
      upvotes: 15
    },
    {
      id: 'cmsg_all_4',
      channelId: 'chan_all_students',
      senderId: 'usr_5',
      senderName: 'Arefin Shuvo',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      content: 'বাংলাদেশ ও বিশ্বপরিচয় (BGS) মডেল টেস্ট প্রশ্নপত্র আপলোড করেছি। সবাই প্র্যাকটিস করে মার্কস শেয়ার করতে পারেন!',
      timestamp: '10:45 AM',
      encrypted: false,
      upvotes: 11
    },
    {
      id: 'cmsg_all_5',
      channelId: 'chan_all_students',
      senderId: 'usr_3',
      senderName: 'Tanvir Hossain',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      content: 'সবাই নিজেদের প্রোফাইলে গিয়ে ইউজারনেম, ইমেইল ও পাসওয়ার্ড সেট করে নিন যাতে সহজে লগইন/লগআউট করা যায়। 🚀',
      timestamp: '11:45 AM',
      encrypted: false,
      upvotes: 24
    }
  ],
  chan_ssc2027_science: [
    {
      id: 'cmsg_1',
      channelId: 'chan_ssc2027_science',
      senderId: 'usr_6',
      senderName: 'Tahsin Ahmed',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      content: 'Reminder to all SSC 2027 Science classmates: Physics Chapter 4 (কাজ, ক্ষমতা ও শক্তি) model test CQ revision starts at 8 PM!',
      timestamp: '9:00 AM',
      encrypted: false,
      upvotes: 12
    },
    {
      id: 'cmsg_2',
      channelId: 'chan_ssc2027_science',
      senderId: 'usr_1',
      senderName: 'Rakibul Islam',
      senderAvatar: rakibulAvatar,
      content: 'I uploaded the SSC 2027 Physics complete chapter-wise formula sheet to the Cloud Vault for everyone.',
      timestamp: '10:15 AM',
      encrypted: false,
      attachment: {
        name: 'SSC_2027_Physics_ChapterWise_Formula_Sheet.pdf',
        url: '#',
        type: 'pdf',
        size: '3.4 MB'
      },
      upvotes: 21
    },
    {
      id: 'cmsg_3',
      channelId: 'chan_ssc2027_science',
      senderId: 'usr_2',
      senderName: 'Sumaiya Akter',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      content: 'Anyone ready to solve the Chemistry periodic table exceptions and valency trends in a live audio study room?',
      timestamp: '11:30 AM',
      encrypted: false,
      upvotes: 9
    }
  ]
};

export const mockDiscussionPosts: DiscussionPost[] = [
  {
    id: 'post_1',
    title: 'SSC 2027: Physics Ch-4 (Energy & Power) Critical CQ Discussion & Study Squad',
    content: 'Hello Quantum Cosmo School SSC 2027 classmates! Let us review the conservation of mechanical energy at different heights (E = Ep + Ek) for freely falling objects. We have organized a study squad for tonight with:\n\n1. CQ Problem 1: Freely falling body vs inclined plane friction\n2. CQ Problem 2: Hydroelectric pump efficiency (η) calculation\n\nComment below or join our live video study call tonight at 8 PM!',
    category: 'Academic Question',
    tags: ['SSC2027', 'Physics', 'QuantumCosmoSchool', 'ScienceSquad'],
    authorId: 'usr_1',
    authorName: 'Rakibul Islam',
    authorAvatar: rakibulAvatar,
    authorDepartment: 'Science (বিজ্ঞান বিভাগ)',
    authorSemester: 'SSC 2027 Batch (Class 10)',
    createdAt: '3 hours ago',
    upvotes: 28,
    userUpvoted: true,
    commentsCount: 3,
    mediaType: 'none',
    isPinned: true,
    projectNeeds: {
      roles: ['Physics CQ Solver Lead', 'Math Formula Reviewer'],
      teamSize: 5,
      currentMembers: 3,
      courseCode: 'SSC Physics'
    },
    comments: [
      {
        id: 'comm_1',
        authorName: 'Tahsin Ahmed',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        content: 'I have prepared 3 top board exam creative questions on pump efficiency. Will share screen during the study call!',
        createdAt: '2 hours ago'
      },
      {
        id: 'comm_2',
        authorName: 'Sumaiya Akter',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        content: 'Count me in! Also let us review the unit conversions (HP to Watt and Joules to kWh).',
        createdAt: '1 hour ago'
      }
    ]
  },
  {
    id: 'post_2',
    title: 'How to easily memorize SSC Chemistry Organic Chapter (হাইড্রোকার্বন) reactions?',
    content: 'Hey classmates, does anyone have a concise flow chart for Alkane, Alkene, Alkyne preparation and their tests (Bromine water and Baeyer test)? Looking for a quick visual summary note.',
    category: 'Academic Question',
    tags: ['Chemistry', 'SSC2027', 'OrganicChemistry', 'QCS'],
    authorId: 'usr_2',
    authorName: 'Sumaiya Akter',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    authorDepartment: 'Science (বিজ্ঞান বিভাগ)',
    authorSemester: 'SSC 2027 Batch (Class 10)',
    createdAt: '6 hours ago',
    upvotes: 16,
    userUpvoted: false,
    commentsCount: 1,
    mediaType: 'none',
    comments: [
      {
        id: 'comm_3',
        authorName: 'Rakibul Islam',
        authorAvatar: rakibulAvatar,
        content: 'I uploaded the complete Hydrocarbon flow diagram to the Cloud Vault under SSC_2027_Chemistry_Hydrocarbon_Reactions.pdf! Check it out.',
        createdAt: '4 hours ago'
      }
    ]
  }
];

export const mockSharedFiles: SharedFile[] = [
  {
    id: 'file_1',
    name: 'Quantum_Cosmo_School_SSC2027_Physics_Formula_Master.pdf',
    description: 'Complete 24-page encrypted formula and CQ guide covering Chapter 1 to 14: Motion, Force, Energy, Waves, Light, Electricity & Modern Physics.',
    size: '3.4 MB',
    fileType: 'pdf',
    courseCode: 'SSC-PHY-27',
    department: 'Science (বিজ্ঞান বিভাগ)',
    uploadedAt: 'Today at 08:30 AM',
    uploaderId: 'usr_1',
    uploaderName: 'Rakibul Islam',
    uploaderAvatar: rakibulAvatar,
    encrypted: true,
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    downloadCount: 56,
    contentPreview: '=== QUANTUM COSMO SCHOOL: SSC 2027 PHYSICS FORMULA SHEET ===\n• চ্যাপ্টার ১: ভৌত রাশি ও পরিমাপ (স্লাইড ক্যালিপার্স ও স্ক্রু গজ)\n• চ্যাপ্টার ২: গতি (v = u + at, s = ut + 0.5at², v² = u² + 2as)\n• চ্যাপ্টার ৩: বল (F = ma, ভরবেগের সংরক্ষণ সূত্র: m1u1 + m2u2 = m1v1 + m2v2)\n• চ্যাপ্টার ৪: কাজ, ক্ষমতা ও শক্তি (W = Fs cosθ, Ep = mgh, Ek = 0.5mv², η = (P_out / P_in) * 100%)'
  },
  {
    id: 'file_2',
    name: 'SSC_2027_HigherMath_Coordinate_Geometry_and_Trig.pdf',
    description: 'Handwritten proofs, formulas, and 50 solved MCQ shortcuts for Chapter 11 (স্থানাঙ্ক জ্যামিতি) & Chapter 8 (ত্রিকোণমিতি).',
    size: '2.1 MB',
    fileType: 'pdf',
    courseCode: 'SSC-HMATH-27',
    department: 'Science (বিজ্ঞান বিভাগ)',
    uploadedAt: 'Yesterday',
    uploaderId: 'usr_6',
    uploaderName: 'Tahsin Ahmed',
    uploaderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    encrypted: true,
    hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    downloadCount: 74,
    contentPreview: '=== SSC 2027 HIGHER MATH: COORDINATE GEOMETRY ===\n• Distance formula: d = √[(x2 - x1)² + (y2 - y1)²]\n• Slope (ঢাল): m = (y2 - y1) / (x2 - x1) = tan θ\n• Triangle Area using vertices matrix method (shoelace formula)'
  },
  {
    id: 'file_3',
    name: 'SSC_2027_Accounting_Ledger_and_TrialBalance_Notes.pdf',
    description: 'Complete handwritten accounting ledger formats, transaction rules (Debit/Credit), and final accounts practice for SSC 2027.',
    size: '1.5 MB',
    fileType: 'pdf',
    courseCode: 'SSC-ACC-27',
    department: 'Business Studies (ব্যবসায় শিক্ষা)',
    uploadedAt: '3 days ago',
    uploaderId: 'usr_4',
    uploaderName: 'Nusrat Jahan',
    uploaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    encrypted: true,
    hash: 'c2543fff136d88f6cb3f9cfb429d8926bcff741b0258169996bdfdf82d561d00',
    downloadCount: 38,
    contentPreview: '=== QUANTUM COSMO SCHOOL: SSC ACCOUNTING ===\n• হিসাবের শ্রেণিবিভাগ: সম্পদ, দায়, মালিকানা স্বত্ব, আয়, ব্যয়\n• দুতরফা দাখিলা পদ্ধতি (Double Entry System)\n• রেওয়ামিল (Trial Balance) প্রস্তুত প্রণালী ও অশুদ্ধি সংশোধন'
  }
];

