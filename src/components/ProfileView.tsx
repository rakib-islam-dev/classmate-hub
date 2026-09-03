import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AcademicStatus } from '../types';
import { 
  ShieldCheck, 
  Save, 
  UserCircle,
  Trees,
  Maximize2,
  Upload,
  Lock,
  KeyRound,
  Mail,
  LogOut,
  Eye,
  EyeOff,
  Camera,
  Check
} from 'lucide-react';
import { CampusPhotoModal } from './CampusPhotoModal';
import { rakibulAvatar } from '../data/mockData';
import { compressImage } from '../utils/imageCompressor';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    updateUserCredentials,
    logout,
    setIsAuthModalOpen, 
    campusPhoto, 
    t, 
    language, 
    showToast 
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [department, setDepartment] = useState(currentUser.department);
  const [semester, setSemester] = useState(currentUser.semester);
  const [currentStudyFocus, setCurrentStudyFocus] = useState(currentUser.currentStudyFocus);
  const [bio, setBio] = useState(currentUser.bio);
  const [status, setStatus] = useState<AcademicStatus>(currentUser.status);
  const [interestsText, setInterestsText] = useState(currentUser.interests.join(', '));
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const heroAvatarInputRef = useRef<HTMLInputElement>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Security Credentials state
  const [editUsername, setEditUsername] = useState(currentUser.username || 'student_user');
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
    setDepartment(currentUser.department);
    setSemester(currentUser.semester);
    setCurrentStudyFocus(currentUser.currentStudyFocus);
    setBio(currentUser.bio);
    setStatus(currentUser.status);
    setInterestsText(currentUser.interests.join(', '));
    setAvatar(currentUser.avatar);
    setEditUsername(currentUser.username || 'student_user');
    setEditEmail(currentUser.email || '');
  }, [currentUser]);

  const sampleAvatars = [
    { label: 'Rakibul Islam (Cadet Uniform)', url: rakibulAvatar },
    { label: 'Student 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' },
    { label: 'Student 2', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
    { label: 'Student 3', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80' },
    { label: 'Student 4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
    { label: 'Student 5', url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=400&auto=format&fit=crop&q=80' }
  ];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 320, 0.85);
        setAvatar(compressed);
        updateUserProfile({ avatar: compressed });
        showToast(
          language === 'bn' ? 'ছবি পরিবর্তিত হয়েছে ✅' : 'Profile Photo Updated ✅',
          language === 'bn' ? 'আপনার নতুন প্রোফাইল ছবি তাৎক্ষণিকভাবে আপডেট ও সংরক্ষিত হয়েছে।' : 'Your profile picture has been updated and saved.',
          'success'
        );
      } catch {
        showToast(
          language === 'bn' ? 'ছবি পড়তে সমস্যা হয়েছে' : 'Photo Load Error',
          language === 'bn' ? 'অনুগ্রহ করে ভিন্ন কোনো ছবি দিয়ে চেষ্টা করুন।' : 'Please try another image file.',
          'info'
        );
      } finally {
        e.target.value = '';
      }
    }
  };

  const handleSelectPresetAvatar = (url: string, label: string) => {
    setAvatar(url);
    updateUserProfile({ avatar: url });
    showToast(
      language === 'bn' ? 'অ্যাভাটার পরিবর্তিত হয়েছে ✅' : 'Avatar Changed ✅',
      `${language === 'bn' ? 'নির্বাচিত অ্যাভাটার' : 'Active avatar'}: ${label}`,
      'success'
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserProfile({
      name: name.trim(),
      department: department.trim(),
      semester: semester.trim(),
      currentStudyFocus: currentStudyFocus.trim(),
      bio: bio.trim(),
      status,
      avatar,
      interests: interestsText.split(',').map(i => i.trim()).filter(Boolean)
    });

    showToast(
      language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile Updated',
      language === 'bn' ? 'আপনার একাডেমি তথ্য ও স্ট্যাটাস সংরক্ষিত হয়েছে।' : 'Your campus academic status has been saved and broadcasted to your class.',
      'success'
    );
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editUsername.trim() || !editEmail.trim()) {
      showToast(
        language === 'bn' ? 'ইউজারনেম ও ইমেইল আবশ্যক' : 'Username & Email Required',
        language === 'bn' ? 'অনুগ্রহ করে সঠিক ইউজারনেম এবং ইমেইল প্রদান করুন।' : 'Please provide valid username and email.',
        'info'
      );
      return;
    }

    if (newPassword) {
      if (newPassword.length < 4) {
        showToast(
          language === 'bn' ? 'পাসওয়ার্ড খুব ছোট' : 'Password Too Short',
          language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' : 'Password must be at least 4 characters long.',
          'info'
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast(
          language === 'bn' ? 'পাসওয়ার্ড মেলেনি' : 'Passwords Mismatch',
          language === 'bn' ? 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড একই হতে হবে।' : 'New password and confirmation must match.',
          'info'
        );
        return;
      }
    }

    const res = updateUserCredentials({
      username: editUsername.trim().replace('@', ''),
      email: editEmail.trim(),
      newPassword: newPassword.trim() || undefined,
      currentPassword: currentPassword.trim() || undefined
    });

    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Banner with Campus Photo Cover */}
      <div className="relative rounded-3xl overflow-hidden text-white shadow-xl border border-slate-200 dark:border-slate-800">
        
        {/* Campus Cover Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={campusPhoto}
            alt="Campus Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90 backdrop-blur-xs" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <input
                ref={heroAvatarInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div 
                onClick={() => heroAvatarInputRef.current?.click()}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-white/30 shadow-xl cursor-pointer group-hover:ring-indigo-400 transition-all"
                title={language === 'bn' ? 'ছবি পরিবর্তন করতে ক্লিক করুন' : 'Click to change profile picture'}
              >
                <img
                  src={avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-bold">{language === 'bn' ? 'পরিবর্তন' : 'Change'}</span>
                </div>
              </div>

              {/* Quick Camera Trigger Button */}
              <button
                type="button"
                onClick={() => heroAvatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md border-2 border-slate-900 cursor-pointer transition-transform hover:scale-110"
                title={language === 'bn' ? 'নতুন ছবি আপলোড করুন' : 'Upload new photo'}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              <span className={`absolute top-0 left-0 w-4 h-4 rounded-full ring-2 ring-slate-900 ${
                status === 'online' ? 'bg-emerald-500' :
                status === 'studying' ? 'bg-amber-500' :
                status === 'in_call' ? 'bg-indigo-500' : 'bg-slate-400'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-sm">{currentUser.name}</h1>
                {currentUser.verified && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
              </div>
              <p className="text-xs sm:text-sm text-indigo-200">{currentUser.department} • {currentUser.semester}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-indigo-300 font-mono">@{currentUser.username || 'rakibul'}</span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-300 font-mono">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-[10px] font-bold text-white transition-all backdrop-blur-xs cursor-pointer"
                >
                  <Trees className="w-3 h-3 text-emerald-300" />
                  <span>{t.hilltopCampus}</span>
                  <Maximize2 className="w-2.5 h-2.5 ml-0.5 opacity-80" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <div className="text-center">
                <span className="block text-sm font-bold">{currentUser.tradesCompleted}</span>
                <span className="text-[10px] text-indigo-200">{language === 'bn' ? 'সফল বিনিময়' : 'Trades Done'}</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-center">
                <span className="block text-sm font-bold">{currentUser.rating.toFixed(1)}</span>
                <span className="text-[10px] text-indigo-200">{language === 'bn' ? 'রেটিং' : 'Rating'}</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-center">
                <span className="block text-sm font-bold">{currentUser.cgpa}</span>
                <span className="text-[10px] text-indigo-200">{language === 'bn' ? 'সিজিপিএ' : 'CGPA'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <UserCircle className="w-4 h-4" />
                <span>{language === 'bn' ? 'আইডি বদলান' : 'Switch Persona'}</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logout}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ACCOUNT SECURITY & CREDENTIALS CARD */}
      <form onSubmit={handleSaveCredentials} className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.securitySettings}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' 
                  ? 'আপনার ইউজারনেম, ইমেইল এবং পাসওয়ার্ড পরিবর্তন ও সুরক্ষিত করুন।' 
                  : 'Manage your campus handle, registered email, and login password.'}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {language === 'bn' ? 'এনক্রিপ্টেড ক্রেডেনশিয়ালস' : 'Encrypted Vault'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.username} *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">@</span>
              <input
                type="text"
                required
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="username"
                className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {language === 'bn' ? 'গ্রুপ ও চ্যাটে আপনাকে মেনশন করতে ব্যবহার হবে' : 'Used for @mentions and group messaging'}
            </p>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.email} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {language === 'bn' ? 'পাসওয়ার্ড রিকভারি ও নোটিফিকেশনের জন্য' : 'Used for password recovery and notifications'}
            </p>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t.changePassword}</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'bn' ? 'পাসওয়ার্ড না বদলালে ফাঁকা রাখুন' : 'Leave empty if keeping current password'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                {t.currentPassword}
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                {t.newPassword}
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                {t.confirmPassword}
              </label>
              <input
                type={showNewPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>{t.updateCredentials}</span>
          </button>
        </div>
      </form>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'একাডেমিক প্রোফাইল সেটিংস' : 'Academic Profile Settings'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'আপনার স্টাডি স্ট্যাটাস ও তথ্য আপডেট রাখুন যাতে সহপাঠীরা আপনাকে সহজে খুঁজে পায়' : 'Keep your study status updated so classmates can find and collaborate with you.'}
          </p>
        </div>

        {/* Live Academic Status Radio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {language === 'bn' ? 'বর্তমান ক্যাম্পাস স্ট্যাটাস' : 'Current Campus Status'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'online', label: language === 'bn' ? 'অনলাইন ও সক্রিয়' : 'Active & Available', color: 'bg-emerald-500' },
              { id: 'studying', label: language === 'bn' ? 'পড়ায় ব্যস্ত' : 'Studying / Focus', color: 'bg-amber-500' },
              { id: 'in_call', label: language === 'bn' ? 'গ্রুপ কলে যুক্ত' : 'In Study Call', color: 'bg-indigo-500' },
              { id: 'offline', label: language === 'bn' ? 'অফলাইন' : 'Offline', color: 'bg-slate-400' }
            ].map(st => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatus(st.id as AcademicStatus)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  status === st.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                <span className="truncate">{st.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Study Focus */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {language === 'bn' ? 'বর্তমানে কী পড়ছেন / স্টাডি ফোকাস *' : 'Current Study Focus / Problem Working On *'}
          </label>
          <input
            type="text"
            required
            value={currentStudyFocus}
            onChange={(e) => setCurrentStudyFocus(e.target.value)}
            placeholder="e.g. Preparing for CSE 311 Midterm (Dynamic Programming & Dijkstra)"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.fullName}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'বিভাগ / মেজর' : 'Department / Major'}
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'বর্তমান সেমিস্টার' : 'Current Academic Term'}
            </label>
            <input
              type="text"
              required
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g. 5th Semester (Fall 2026)"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'দক্ষতা ও আগ্রহসমূহ (কমা দিয়ে)' : 'Academic Interests / Skills (Comma Separated)'}
            </label>
            <input
              type="text"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              placeholder="Algorithms, Machine Learning, UI/UX"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {language === 'bn' ? 'নিজের সম্পর্কে সংক্ষিপ্ত পরিচিতি (Bio)' : 'About / Bio'}
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Avatar Preset Selector & Custom Upload */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {language === 'bn' ? 'প্রোফাইল ছবি (আমার ছবি / অ্যাভাটার)' : 'Student Profile Picture / Avatar'}
            </label>
            <label className="cursor-pointer text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              <span>{t.uploadMyPhoto}</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Active Selected Avatar Preview */}
            <div
              className="relative rounded-2xl overflow-hidden w-16 h-16 border-2 border-indigo-600 ring-4 ring-indigo-500/30 scale-105 shadow-md shrink-0"
              title={language === 'bn' ? 'বর্তমান নির্বাচিত ছবি' : 'Active Selected Photo'}
            >
              <img
                src={avatar}
                alt="Active Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-indigo-600/90 text-white text-[9px] font-bold py-0.5 text-center">
                {language === 'bn' ? 'সক্রিয়' : 'Active'}
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

            {/* Presets */}
            {sampleAvatars.map((item, i) => {
              const isSelected = avatar === item.url;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPresetAvatar(item.url, item.label)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer w-14 h-14 border-2 transition-all shrink-0 ${
                    isSelected 
                      ? 'border-indigo-600 ring-2 ring-indigo-500/50 scale-105 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  title={item.label}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রোফাইল সংরক্ষণ করুন' : 'Save Profile & Broadcast Status'}</span>
          </button>
        </div>

      </form>

      <CampusPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

    </div>
  );
};
