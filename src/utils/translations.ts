export type Language = 'bn' | 'en';

export interface Translations {
  // Brand & Top bar
  appName: string;
  campusHub: string;
  ourSchoolPicture: string;
  instantStudyRoom: string;
  liveCallActive: string;
  toggleTheme: string;
  lightMode: string;
  darkMode: string;
  createAccount: string;
  signIn: string;
  quickSwitch: string;
  languageToggle: string;
  
  // Navigation Tabs
  marketplace: string;
  messages: string;
  feed: string;
  vault: string;
  classmates: string;
  profile: string;
  admin: string;
  adminPanel: string;
  superAdminTitle: string;
  
  // Marketplace
  marketplaceTitle: string;
  marketplaceSubtitle: string;
  marketplaceHeader: string;
  marketplaceSub: string;
  campusSpots: string;
  postItem: string;
  tradeSwap: string;
  freeGiveaway: string;
  borrowLend: string;
  postListing: string;
  searchMarketplace: string;
  allCategories: string;
  textbooks: string;
  notes: string;
  calculators: string;
  labEquipment: string;
  pastExams: string;
  tradeType: string;
  freeLend: string;
  forSale: string;
  exchangeFor: string;
  requestTrade: string;
  available: string;
  traded: string;
  
  // Chat & Messages
  channelsTitle: string;
  directMessagesTitle: string;
  typeMessage: string;
  sendPicture: string;
  sendVideo: string;
  recordVideo: string;
  attachFile: string;
  attachCode: string;
  voiceCall: string;
  videoCall: string;
  startAudioCall: string;
  startVideoCall: string;
  audioRoomTitle: string;
  hdVoiceConnected: string;
  noiseCancellation: string;
  speakerMode: string;
  micActive: string;
  micMuted: string;
  callDuration: string;
  imagePreview: string;
  removeImage: string;
  videoPreview: string;
  removeVideo: string;
  uploadingImage: string;
  uploadingVideo: string;
  onlineNow: string;
  studyingFocus: string;
  
  // Feed
  feedTitle: string;
  feedSubtitle: string;
  feedHeader: string;
  feedSub: string;
  newDiscussion: string;
  createPost: string;
  postPlaceholder: string;
  attachImageToPost: string;
  like: string;
  comment: string;
  bookmark: string;
  askClassmates: string;
  
  // Campus Photo & Banner
  hilltopCampus: string;
  exploreCampusPhoto: string;
  uploadRealSchoolPhoto: string;
  changeCampusPhoto: string;
  resetDefaultPhoto: string;
  landmarkTour: string;
  zoomIn: string;
  zoomOut: string;
  
  // Classmates Roster
  classmatesTitle: string;
  classmatesSubtitle: string;
  classmatesHeader: string;
  classmatesSub: string;
  registerClassmate: string;
  register: string;
  searchClassmates: string;
  callClassmate: string;
  chatClassmate: string;
  
  // Profile & Auth
  academicProfile: string;
  studentId: string;
  fullName: string;
  orChooseMethod: string;
  gmailGoogle: string;
  usernameId: string;
  mobilePhone: string;
  department: string;
  semester: string;
  cgpa: string;
  currentStudyGoal: string;
  editProfile: string;
  saveChanges: string;
  uploadMyPhoto: string;
  selectAvatar: string;
  
  // Security & Account
  securitySettings: string;
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  changeUsername: string;
  changeEmail: string;
  forgotPassword: string;
  resetPassword: string;
  passwordResetSuccess: string;
  logOut: string;
  logout?: string;
  logIn: string;
  username?: string;
  email?: string;
  updateCredentials?: string;
  createGroup: string;
  groupName: string;
  allStudentsHub: string;
  groupMembers: string;
  inviteToGroup: string;

  // Common
  cancel: string;
  confirm: string;
  verifiedStudent: string;
  close: string;
}

export const translations: Record<Language, Translations> = {
  bn: {
    // Brand & Top bar
    appName: 'ClassMate',
    campusHub: 'ক্যাম্পাস হাব',
    ourSchoolPicture: 'আমাদের স্কুলের ছবি',
    instantStudyRoom: 'স্টাডি রুম চালু করুন',
    liveCallActive: 'লাইভ স্টাডি কল চলছে',
    toggleTheme: 'থিম পরিবর্তন',
    lightMode: 'লাইট মোড',
    darkMode: 'ডার্ক মোড',
    createAccount: 'নতুন অ্যাকাউন্ট তৈরি',
    signIn: 'লগইন করুন',
    quickSwitch: 'সহপাঠী পরিবর্তন',
    languageToggle: 'English এ দেখুন',

    // Navigation Tabs
    marketplace: 'নোট ও বই লেনদেন',
    messages: 'মেসেজ ও চ্যাট',
    feed: 'ক্যাম্পাস ফিড',
    vault: 'ফাইল ভল্ট',
    classmates: 'সহপাঠী তালিকা',
    profile: 'আমার প্রোফাইল',
    admin: 'অ্যাডমিন প্যানেল',
    adminPanel: 'মাস্টার অ্যাডমিন কন্ট্রোল',
    superAdminTitle: 'সুপার অ্যাডমিন ও প্রতিষ্ঠাতা',

    // Marketplace
    marketplaceTitle: 'একাডেমিক নোট ও বুক এক্সচেঞ্জ',
    marketplaceSubtitle: 'ক্লাস নোট, রেফারেন্স বই ও প্রজেক্ট ম্যাটেরিয়াল সহপাঠীদের সাথে লেনদেন বা শেয়ার করুন',
    marketplaceHeader: 'সহপাঠী মার্কেটপ্লেস ও ট্রেড হাব',
    marketplaceSub: 'কোর্স টেক্সটবুক, ক্লাসের হাতের নোট, ক্যালকুলেটর ও ল্যাব সরঞ্জাম ভেরিফায়েড সহপাঠীদের সাথে লেনদেন করুন।',
    campusSpots: 'ক্যাম্পাস পিকআপ স্পট',
    postItem: 'নোট বা আইটেম পোস্ট করুন',
    tradeSwap: 'অদলবদল (Swap)',
    freeGiveaway: 'ফ্রি গিভঅ্যাওয়ে',
    borrowLend: 'ধার নেওয়া / দেওয়া',
    postListing: 'নোট বা বই পোস্ট করুন',
    searchMarketplace: 'কোর্স কোড, নোট, বই বা ইকুইপমেন্ট খুঁজুন...',
    allCategories: 'সকল ক্যাটাগরি',
    textbooks: 'পাঠ্যবই (Textbooks)',
    notes: 'হ্যান্ডরাইটিং নোটস',
    calculators: 'ক্যালকুলেটর ও টেক',
    labEquipment: 'ল্যাব সরঞ্জাম',
    pastExams: 'বিগত পরীক্ষার প্রশ্ন ও সমাধান',
    tradeType: 'বিনিময় (Trade)',
    freeLend: 'ফ্রি / ধার দেওয়া',
    forSale: 'বিক্রি',
    exchangeFor: 'বিনিময়ে চাই',
    requestTrade: 'লেনদেনের অনুরোধ পাঠান',
    available: 'পাওয়া যাচ্ছে',
    traded: 'লেনদেন সম্পন্ন',

    // Chat & Messages
    channelsTitle: 'কোর্স ও ডিপার্টমেন্ট চ্যানেল',
    directMessagesTitle: 'ব্যক্তিগত সহপাঠী চ্যাট',
    typeMessage: 'সহপাঠীকে মেসেজ লিখুন...',
    sendPicture: 'ছবি পাঠান',
    sendVideo: 'ভিডিও পাঠান',
    recordVideo: 'ভিডিও বার্তা রেকর্ড',
    attachFile: 'ফাইল যুক্ত করুন',
    attachCode: 'কোড বা সলিউশন যুক্ত করুন',
    voiceCall: 'অডিও কল',
    videoCall: 'ভিডিও স্টাডি কল',
    startAudioCall: 'সহপাঠীর সাথে অডিও কল শুরু করুন',
    startVideoCall: 'ভিডিও স্টাডি কল শুরু করুন',
    audioRoomTitle: 'লাইভ ভয়েস স্টাডি রুম',
    hdVoiceConnected: 'এইচডি ক্রিস্টাল ক্লিয়ার ভয়েস সংযুক্ত',
    noiseCancellation: 'নয়েজ ক্যান্সেলেশন সক্রিয়',
    speakerMode: 'স্পিকার / হেডফোন মোড',
    micActive: 'মাইক্রোফোন চালু',
    micMuted: 'মাইক্রোফোন মিউট',
    callDuration: 'কল সময়',
    imagePreview: 'ছবির প্রিভিউ',
    removeImage: 'ছবি মুছুন',
    videoPreview: 'ভিডিও প্রিভিউ',
    removeVideo: 'ভিডিও মুছুন',
    uploadingImage: 'ছবি লোড হচ্ছে...',
    uploadingVideo: 'ভিডিও লোড হচ্ছে...',
    onlineNow: 'অনলাইনে আছেন',
    studyingFocus: 'পড়াশোনার বিষয়',

    // Feed
    feedTitle: 'ক্যাম্পাস স্টুডেন্ট ফিড',
    feedSubtitle: 'প্রশ্ন করুন, ক্লাস নোট শেয়ার করুন এবং পরীক্ষার প্রস্তুতি আলোচনা করুন',
    feedHeader: 'সহপাঠী ফিড ও টিম মেম্বার খোঁজার বোর্ড',
    feedSub: 'প্রজেক্ট পার্টনার খুঁজুন, ক্লাসের জটিল পড়া নিয়ে আলোচনা করুন এবং নোটস শেয়ার করুন।',
    newDiscussion: 'নতুন আলোচনা বা প্রজেক্ট কল',
    createPost: 'নতুন পোস্ট বা প্রশ্ন লিখুন',
    postPlaceholder: 'ক্লাস বা পড়াশোনা নিয়ে কিছু বলুন অথবা ছবি ও নোট শেয়ার করুন...',
    attachImageToPost: 'পোস্টে ছবি যুক্ত করুন',
    like: 'পছন্দ',
    comment: 'মন্তব্য',
    bookmark: 'সেভ করুন',
    askClassmates: 'সহপাঠীদের জিজ্ঞাসা করুন',

    // Campus Photo & Banner
    hilltopCampus: 'আমাদের সবুজ পাহাড়ি ক্যাম্পাস',
    exploreCampusPhoto: 'স্কুলের ছবি ও ল্যান্ডমার্ক দেখুন',
    uploadRealSchoolPhoto: 'আসল স্কুলের ছবি আপলোড করুন',
    changeCampusPhoto: 'ক্যাম্পাসের ছবি পরিবর্তন করুন',
    resetDefaultPhoto: 'ডিফল্ট ছবিতে ফিরুন',
    landmarkTour: 'ক্যাম্পাসের বিভিন্ন ভবন ও স্থান',
    zoomIn: 'বড় করুন',
    zoomOut: 'ছোট করুন',

    // Classmates Roster
    classmatesTitle: 'সহপাঠী একাডেমিক ডিরেক্টরি',
    classmatesSubtitle: 'কে কি পড়াশোনা করছেন দেখুন এবং একসাথে পড়ার জন্য আমন্ত্রণ জানান',
    classmatesHeader: 'সহপাঠীদের একাডেমিক তালিকা',
    classmatesSub: 'কে কোন কোর্সে পড়াশোনা করছেন দেখুন এবং ইনস্ট্যান্ট স্টাডি কলে আমন্ত্রণ জানান।',
    registerClassmate: 'অ্যাকাউন্ট খুলুন / যোগ দিন',
    register: 'রেজিস্টার / নতুন আইডি',
    searchClassmates: 'নাম, ডিপার্টমেন্ট বা কোর্স দিয়ে খুঁজুন...',
    callClassmate: 'স্টাডি কল',
    chatClassmate: 'মেসেজ পাঠান',

    // Profile & Auth
    academicProfile: 'শিক্ষার্থী প্রোফাইল',
    studentId: 'রোল / আইডি',
    fullName: 'শিক্ষার্থীর পূর্ণ নাম',
    orChooseMethod: 'অথবা নিচের অপশন দিয়ে খুলুন',
    gmailGoogle: 'জিমেইল (Gmail / Google)',
    usernameId: 'ইউজারনেম / আইডি',
    mobilePhone: 'মোবাইল নম্বর',
    department: 'বিভাগ / ডিপার্টমেন্ট',
    semester: 'সেমিস্টার / টার্ম',
    cgpa: 'সিজিপিএ (CGPA)',
    currentStudyGoal: 'বর্তমান পড়ার লক্ষ্য',
    editProfile: 'প্রোফাইল সম্পাদনা',
    saveChanges: 'সংরক্ষণ করুন',
    uploadMyPhoto: 'নিজের ছবি আপলোড',
    selectAvatar: 'অবতার নির্বাচন করুন',

    // Security & Account
    securitySettings: 'অ্যাকাউন্ট সিকিউরিটি ও পাসওয়ার্ড সেটিংস',
    changePassword: 'পাসওয়ার্ড পরিবর্তন করুন',
    currentPassword: 'বর্তমান পাসওয়ার্ড',
    newPassword: 'নতুন পাসওয়ার্ড',
    confirmPassword: 'নতুন পাসওয়ার্ড নিশ্চিত করুন',
    changeUsername: 'ইউজারনেম পরিবর্তন',
    changeEmail: 'ইমেইল পরিবর্তন',
    forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    resetPassword: 'পাসওয়ার্ড রিসেট ও পুনরুদ্ধার',
    passwordResetSuccess: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে!',
    logOut: 'লগআউট করুন',
    logout: 'লগআউট করুন',
    logIn: 'লগইন করুন',
    username: 'ইউজারনেম',
    email: 'ইমেইল অ্যাড্রেস',
    updateCredentials: 'তথ্য ও পাসওয়ার্ড আপডেট করুন',
    createGroup: 'নতুন স্টাডি গ্রুপ তৈরি করুন',
    groupName: 'গ্রুপের নাম',
    allStudentsHub: '🌐 সবার উন্মুক্ত গ্রুপ (সবার সাথে চ্যাট)',
    groupMembers: 'গ্রুপ সদস্যবৃন্দ',
    inviteToGroup: 'সহপাঠীকে গ্রুপে ইনভাইট করুন',

    // Common
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত করুন',
    verifiedStudent: 'ভেরিফায়েড শিক্ষার্থী',
    close: 'বন্ধ করুন'
  },
  en: {
    // Brand & Top bar
    appName: 'ClassMate',
    campusHub: 'Campus Hub',
    ourSchoolPicture: 'Our School Picture',
    instantStudyRoom: 'Instant Study Room',
    liveCallActive: 'Live Study Call Active',
    toggleTheme: 'Toggle Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    createAccount: 'Create Student Account',
    signIn: 'Sign In',
    quickSwitch: 'Switch Classmate',
    languageToggle: 'বাংলায় দেখুন',

    // Navigation Tabs
    marketplace: 'Notes & Marketplace',
    messages: 'Messages & Chat',
    feed: 'Campus Feed',
    vault: 'Cloud Vault',
    classmates: 'Classmates Roster',
    profile: 'My Profile',
    admin: 'Admin Panel',
    adminPanel: 'Master Admin Control',
    superAdminTitle: 'Super Admin & Founder',

    // Marketplace
    marketplaceTitle: 'Academic Marketplace & Exchange',
    marketplaceSubtitle: 'Trade handwritten notes, textbook copies, past exams, and equipment with verified classmates',
    marketplaceHeader: 'Classmate Marketplace & Trade Hub',
    marketplaceSub: 'Swap course textbooks, handwritten exam cheatsheets, calculators, and lab gear with verified students.',
    campusSpots: 'Campus Pickup Spots',
    postItem: 'Post Note or Item',
    tradeSwap: 'Swap / Trade',
    freeGiveaway: 'Free Giveaway',
    borrowLend: 'Borrow / Lend',
    postListing: 'Post Note or Item',
    searchMarketplace: 'Search course code, notes, books, lab kits...',
    allCategories: 'All Categories',
    textbooks: 'Textbooks',
    notes: 'Handwritten Notes',
    calculators: 'Calculators & Tech',
    labEquipment: 'Lab Equipment',
    pastExams: 'Past Exams & Solutions',
    tradeType: 'Trade / Exchange',
    freeLend: 'Free / Lend',
    forSale: 'For Sale',
    exchangeFor: 'Exchange For',
    requestTrade: 'Request Trade',
    available: 'Available',
    traded: 'Traded',

    // Chat & Messages
    channelsTitle: 'Course & Dept Channels',
    directMessagesTitle: 'Direct Classmate Chats',
    typeMessage: 'Message classmate...',
    sendPicture: 'Send Picture',
    sendVideo: 'Send Video',
    recordVideo: 'Record Video Clip',
    attachFile: 'Attach File',
    attachCode: 'Attach Code / Solution',
    voiceCall: 'Voice / Audio Call',
    videoCall: 'Video Study Call',
    startAudioCall: 'Start Audio Call with Classmate',
    startVideoCall: 'Start Video Study Call',
    audioRoomTitle: 'Live Voice Study Room',
    hdVoiceConnected: 'HD Crystal Clear Audio Connected',
    noiseCancellation: 'Active AI Noise Suppression',
    speakerMode: 'Speaker / Headset Mode',
    micActive: 'Microphone Active',
    micMuted: 'Microphone Muted',
    callDuration: 'Call Duration',
    imagePreview: 'Image Preview',
    removeImage: 'Remove Image',
    videoPreview: 'Video Preview',
    removeVideo: 'Remove Video',
    uploadingImage: 'Loading Image...',
    uploadingVideo: 'Loading Video...',
    onlineNow: 'Online Now',
    studyingFocus: 'Current Study Focus',

    // Feed
    feedTitle: 'Campus Discussion & Questions',
    feedSubtitle: 'Ask assignment doubts, share course notes, and collaborate on exams',
    feedHeader: 'Classmate Feed & Teammate Finder',
    feedSub: 'Post project recruitment calls, share technical doubts, or start study debates.',
    newDiscussion: 'New Discussion / Project Call',
    createPost: 'Create Discussion Post',
    postPlaceholder: 'Share insights, ask academic doubts, or attach study materials...',
    attachImageToPost: 'Attach Image / Diagram',
    like: 'Like',
    comment: 'Comment',
    bookmark: 'Bookmark',
    askClassmates: 'Ask Classmates',

    // Campus Photo & Banner
    hilltopCampus: 'Our Hilltop Campus',
    exploreCampusPhoto: 'Explore School Photo & Landmarks',
    uploadRealSchoolPhoto: 'Upload Real School Photo',
    changeCampusPhoto: 'Change Campus Photo',
    resetDefaultPhoto: 'Reset Default Photo',
    landmarkTour: 'Campus Buildings & Facilities',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',

    // Classmates Roster
    classmatesTitle: 'Classmate Academic Roster',
    classmatesSubtitle: 'Discover who is studying, check course focus, and invite peers to study sessions',
    classmatesHeader: 'Classmate Academic Roster',
    classmatesSub: 'Discover who is currently studying, check course focus, and invite classmates to study sessions.',
    registerClassmate: 'Register / Create Account',
    register: 'Register / New Account',
    searchClassmates: 'Search by name, department, or course...',
    callClassmate: 'Study Call',
    chatClassmate: 'Send Message',

    // Profile & Auth
    academicProfile: 'Academic Profile',
    studentId: 'Roll / ID Handle',
    fullName: 'Student Full Name',
    orChooseMethod: 'Or choose your sign up method',
    gmailGoogle: 'Gmail / Google Account',
    usernameId: 'Username / Student ID',
    mobilePhone: 'Mobile Phone Number',
    department: 'Department',
    semester: 'Academic Semester',
    cgpa: 'Current CGPA',
    currentStudyGoal: 'Current Study Focus',
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    uploadMyPhoto: 'Upload My Photo',
    selectAvatar: 'Select Avatar',

    // Security & Account
    securitySettings: 'Account Security & Credentials',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    changeUsername: 'Change Username',
    changeEmail: 'Change Email Address',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Password Reset & Recovery',
    passwordResetSuccess: 'Password reset successfully!',
    logOut: 'Log Out',
    logout: 'Log Out',
    logIn: 'Log In',
    username: 'Username',
    email: 'Email Address',
    updateCredentials: 'Save Security & Credentials',
    createGroup: 'Create New Study Group',
    groupName: 'Group Name',
    allStudentsHub: '🌐 Universal Common Group (Everyone Chat with Everyone)',
    groupMembers: 'Group Members',
    inviteToGroup: 'Invite Classmates to Group',

    // Common
    cancel: 'Cancel',
    confirm: 'Confirm',
    verifiedStudent: 'Verified Student',
    close: 'Close'
  }
};
