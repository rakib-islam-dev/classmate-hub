import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PersonalDriveItem } from '../types';
import { 
  FolderLock, 
  Upload, 
  Image as ImageIcon, 
  Film, 
  FileText, 
  Download, 
  Trash2, 
  Heart, 
  MessageSquare, 
  Search, 
  Plus, 
  HardDrive, 
  Lock, 
  ExternalLink,
  X
} from 'lucide-react';

export const PersonalDriveView: React.FC = () => {
  const { 
    personalDriveItems, 
    addPersonalDriveItem, 
    deletePersonalDriveItem, 
    toggleLikeDriveItem, 
    addCommentToDriveItem, 
    language,
    showToast
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<PersonalDriveItem | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});

  // New File Upload Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Personal' | 'Class Notes' | 'Memories' | 'Assignments' | 'Exam Prep'>('Personal');
  const [newType, setNewType] = useState<'image' | 'video' | 'file' | 'audio'>('image');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileType, setNewFileType] = useState('JPG');
  const [newFileSize, setNewFileSize] = useState('2.4 MB');
  const [newDescription, setNewDescription] = useState('');

  // Sample preset media for quick student upload
  const sampleMediaPresets = [
    { title: 'SSC Physics Formula Cheat Sheet', type: 'file' as const, cat: 'Class Notes' as const, fileType: 'PDF', size: '1.8 MB', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80' },
    { title: 'School Campus Ground Memorial Pic', type: 'image' as const, cat: 'Memories' as const, fileType: 'JPG', size: '3.5 MB', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80' },
    { title: 'Higher Math Vector Geometry Video Lecture', type: 'video' as const, cat: 'Exam Prep' as const, fileType: 'MP4', size: '24.2 MB', url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4' },
    { title: 'Chemistry Periodic Table HD Note', type: 'image' as const, cat: 'Class Notes' as const, fileType: 'PNG', size: '4.1 MB', url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop&q=80' },
    { title: 'English 1st Paper Essay Notes', type: 'file' as const, cat: 'Assignments' as const, fileType: 'DOCX', size: '920 KB', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80' }
  ];

  const filteredItems = personalDriveItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Error', 'Please enter a name for your file.', 'info');
      return;
    }

    const finalUrl = newFileUrl.trim() || (newType === 'image' 
      ? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80'
      : newType === 'video'
      ? 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4'
      : 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80');

    addPersonalDriveItem({
      name: newTitle.trim(),
      type: newType,
      category: newCategory,
      url: finalUrl,
      fileUrl: finalUrl,
      fileType: newFileType,
      size: newFileSize,
      fileSize: newFileSize,
      description: newDescription.trim() || undefined,
      isPrivate: true
    });

    setNewTitle('');
    setNewFileUrl('');
    setNewDescription('');
    setIsUploadModalOpen(false);
  };

  const handleCommentSubmit = (itemId: string) => {
    const text = commentInputs[itemId]?.trim();
    if (!text) return;
    addCommentToDriveItem(itemId, text);
    setCommentInputs(prev => ({ ...prev, [itemId]: '' }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto pb-12">
      {/* Header & Storage Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{language === 'bn' ? 'আমার পার্সোনাল ড্রাইভ' : 'My Personal Cloud Drive'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  {language === 'bn' ? 'ব্যক্তিগত ক্লাউড' : 'Private Storage'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn'
                  ? 'আপনার ছবি, ভিডিও, ক্লাস নোটস এবং ফাইল এখানে আজীবন সুরক্ষিত থাকবে।'
                  : 'Store, organize and view your personal photos, videos, notes and files.'}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Button & Storage Meter */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {language === 'bn' ? 'ব্যবহৃত স্টোরেজ:' : 'Used Space:'} <span className="text-emerald-600 dark:text-emerald-400">2.4 GB / 15 GB</span>
            </p>
            <div className="w-36 h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[16%]" />
            </div>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন ফাইল আপলোড' : 'Upload File'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল ফাইল' : 'All Files', icon: HardDrive },
            { id: 'Personal', label: language === 'bn' ? 'ব্যক্তিগত (Personal)' : 'Personal', icon: FolderLock },
            { id: 'Class Notes', label: language === 'bn' ? 'নোটস (Notes)' : 'Class Notes', icon: FileText },
            { id: 'Memories', label: language === 'bn' ? 'ক্যাম্পাস স্মৃতি' : 'Memories', icon: ImageIcon },
            { id: 'Exam Prep', label: language === 'bn' ? 'পরীক্ষা প্রস্তুতি' : 'Exam Prep', icon: Film }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'ড্রাইভে খুঁজুন...' : 'Search drive...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Files Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FolderLock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {language === 'bn' ? 'কোনো ফাইল পাওয়া যায়নি' : 'No drive files found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'bn' 
              ? 'আপনার পার্সোনাল ড্রাইভে প্রথম ছবি, ভিডিও বা নোটস ফাইলটি আপলোড করুন।' 
              : 'Upload your first file to get started with your personal cloud drive.'}
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
          >
            {language === 'bn' ? 'ফাইল যোগ করুন' : 'Add File'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const itemUrl = item.fileUrl || item.url;
            const format = item.fileType || (item.type === 'image' ? 'IMG' : item.type === 'video' ? 'MP4' : 'DOC');
            const itemSize = item.fileSize || item.size || '2.0 MB';

            return (
              <div
                key={item.id}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Media Preview or Icon Header */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setPreviewItem(item)}>
                  {item.type === 'image' && (
                    <img 
                      src={itemUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {item.type === 'video' && (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                      <img 
                        src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80'} 
                        alt="" 
                        className="w-full h-full object-cover opacity-60"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg">
                        <Film className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                  {item.type === 'file' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-300 p-4 space-y-2">
                      <FileText className="w-10 h-10 text-emerald-400" />
                      <span className="text-[11px] font-bold text-slate-300">{format} Document</span>
                    </div>
                  )}
                  {item.type === 'audio' && (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-300">
                      <FolderLock className="w-10 h-10 text-indigo-400" />
                    </div>
                  )}

                  {/* Badge Overlay */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs uppercase tracking-wider">
                      {format} • {itemSize}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Private
                    </span>
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors" title={item.name}>
                      {item.name}
                    </h4>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400">
                      Uploaded: {item.uploadedAt} • {item.category}
                    </p>
                  </div>

                  {/* Actions: Download, Like, Delete */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLikeDriveItem(item.id)}
                        className={`flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${
                          item.likedByUser ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${item.likedByUser ? 'fill-rose-500' : ''}`} />
                        <span>{item.likes}</span>
                      </button>

                      <button
                        onClick={() => setPreviewItem(item)}
                        className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-indigo-400 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{item.comments.length}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
                        title="View Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          showToast(language === 'bn' ? 'ডাউনলোড শুরু হয়েছে' : 'Downloading', `${item.name} downloaded.`, 'success');
                        }}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePersonalDriveItem(item.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'পার্সোনাল ড্রাইভে ফাইল আপলোড' : 'Upload to Personal Cloud Drive'}
                </h3>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Preset Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">
                {language === 'bn' ? 'দ্রুত স্টাডি প্রিসেট সিলেক্ট করুন:' : 'Quick Study Presets:'}
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {sampleMediaPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewTitle(preset.title);
                      setNewType(preset.type);
                      setNewCategory(preset.cat);
                      setNewFileType(preset.fileType);
                      setNewFileSize(preset.size);
                      setNewFileUrl(preset.url);
                    }}
                    className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 transition-colors"
                  >
                    + {preset.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'ফাইলের নাম *' : 'File Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Physics Chapter 3 Motion Formula Sheet"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Personal">Personal (ব্যক্তিগত)</option>
                    <option value="Class Notes">Class Notes (ক্লাস নোটস)</option>
                    <option value="Memories">Memories (ক্যাম্পাস স্মৃতি)</option>
                    <option value="Assignments">Assignments (অ্যাসাইনমেন্ট)</option>
                    <option value="Exam Prep">Exam Prep (পরীক্ষা প্রস্তুতি)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'bn' ? 'ফাইল টাইপ' : 'Type'}
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="image">ছবি (Image)</option>
                    <option value="video">ভিডিও (Video)</option>
                    <option value="file">ডকুমেন্ট / ফাইল (File)</option>
                    <option value="audio">অডিও (Audio)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'ফাইল লিংক / ইমেজ URL (ঐচ্ছিক)' : 'Direct Link / Image URL (Optional)'}
                </label>
                <input
                  type="text"
                  value={newFileUrl}
                  onChange={e => setNewFileUrl(e.target.value)}
                  placeholder="https://... or leave blank for sample"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'ছোট বর্ণনা / নোট (ঐচ্ছিক)' : 'Description (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Add notes about this file..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ড্রাইভে সেভ করুন' : 'Save to Drive'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Detail / Comment / Fullscreen Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{previewItem.name}</h3>
                <span className="text-[11px] text-slate-400">{previewItem.type.toUpperCase()} • {previewItem.size || previewItem.fileSize} • {previewItem.uploadedAt}</span>
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Rendering */}
            <div className="rounded-2xl overflow-hidden bg-slate-950 max-h-80 flex items-center justify-center">
              {previewItem.type === 'image' && (
                <img src={previewItem.fileUrl || previewItem.url} alt="" className="max-h-80 w-auto object-contain" referrerPolicy="no-referrer" />
              )}
              {previewItem.type === 'video' && (
                <video src={previewItem.fileUrl || previewItem.url} controls className="max-h-80 w-full" />
              )}
              {previewItem.type === 'file' && (
                <div className="p-8 text-center space-y-2 text-slate-300">
                  <FileText className="w-16 h-16 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold">Secure Document Preview</p>
                  <p className="text-xs text-slate-400">{previewItem.description || 'Study notes & document file'}</p>
                </div>
              )}
              {previewItem.type === 'audio' && (
                <div className="p-8 text-center space-y-2 text-slate-300">
                  <FolderLock className="w-16 h-16 text-indigo-400 mx-auto" />
                  <p className="text-sm font-bold">Audio File</p>
                </div>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'ব্যক্তিগত নোটস ও কমেন্টস:' : 'Personal Notes & Comments:'}
              </h4>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {previewItem.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                ) : (
                  previewItem.comments.map(comm => (
                    <div key={comm.id} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{comm.authorName}</span>
                        <span className="text-[10px] text-slate-400">{comm.createdAt}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{comm.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentInputs[previewItem.id] || ''}
                  onChange={e => setCommentInputs(prev => ({ ...prev, [previewItem.id]: e.target.value }))}
                  placeholder={language === 'bn' ? 'নোট বা কমেন্ট লিখুন...' : 'Write note...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleCommentSubmit(previewItem.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
