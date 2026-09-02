import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Plus, 
  X, 
  Music, 
  Send, 
  Trash2 
} from 'lucide-react';

export const ReelsView: React.FC = () => {
  const { 
    currentUser, 
    reels, 
    addReel, 
    toggleLikeReel, 
    addCommentToReel, 
    deleteReel, 
    language, 
    isAdmin,
    showToast
  } = useApp();

  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Upload Reel Form state
  const [newCaption, setNewCaption] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newMusicTitle, setNewMusicTitle] = useState('');
  const [newTags, setNewTags] = useState('QuantumCosmo, SSC2027');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeReel = reels[activeReelIndex] || reels[0];

  const handleNext = () => {
    if (activeReelIndex < reels.length - 1) {
      setActiveReelIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (activeReelIndex > 0) {
      setActiveReelIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) {
      showToast('Error', 'Please enter a caption for your reel.', 'info');
      return;
    }

    const sampleVideos = [
      'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4'
    ];

    const finalVideo = newVideoUrl.trim() || sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
    const parsedTags = newTags.split(',').map(t => t.trim().replace('#', '')).filter(Boolean);

    addReel({
      caption: newCaption.trim(),
      videoUrl: finalVideo,
      musicTitle: newMusicTitle.trim() || 'Quantum Cosmo School Assembly Anthem',
      songTitle: newMusicTitle.trim() || 'Quantum Cosmo School Assembly Anthem',
      tags: parsedTags.length > 0 ? parsedTags : ['SSC2027', 'QCS']
    });

    setNewCaption('');
    setNewVideoUrl('');
    setNewMusicTitle('');
    setIsCreateModalOpen(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeReel) return;
    addCommentToReel(activeReel.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] animate-in fade-in duration-300 pb-8">
      {/* Top Action Bar */}
      <div className="w-full max-w-sm flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{language === 'bn' ? 'ক্যাম্পাস রিলস' : 'Campus Reels'}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
              LIVE
            </span>
          </h2>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'রিল আপলোড' : 'Post Reel'}</span>
        </button>
      </div>

      {/* Reel Phone Container */}
      {activeReel ? (
        <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border-4 border-slate-800 flex items-center justify-center">
          {/* Main Video */}
          <video
            ref={videoRef}
            src={activeReel.videoUrl}
            loop
            autoPlay
            muted={isMuted}
            playsInline
            onClick={handleTogglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Play/Pause Overlay Indicator */}
          {!isPlaying && (
            <div 
              onClick={handleTogglePlay}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Top Audio / Mute Control */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-slate-900/80 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Right Floating Actions (Like, Comment, Share, Prev/Next) */}
          <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
            {/* Like */}
            <button
              onClick={() => toggleLikeReel(activeReel.id)}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                activeReel.isLiked ? 'bg-rose-600 text-white' : 'bg-slate-900/60 backdrop-blur-md text-white group-hover:scale-110'
              }`}>
                <Heart className={`w-5 h-5 ${activeReel.isLiked ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[11px] font-bold text-white drop-shadow-md">{activeReel.likes}</span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setIsCommentDrawerOpen(true)}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-all">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white drop-shadow-md">
                {activeReel.comments?.length || activeReel.commentsCount || 0}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={() => {
                showToast(language === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link Copied', 'Reel link copied to clipboard.', 'success');
              }}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-full bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-all">
                <Share2 className="w-5 h-5" />
              </div>
            </button>

            {/* Delete (if admin or author) */}
            {(isAdmin || activeReel.authorId === currentUser.id) && (
              <button
                onClick={() => {
                  deleteReel(activeReel.id);
                  if (activeReelIndex > 0) setActiveReelIndex(prev => prev - 1);
                }}
                className="w-9 h-9 rounded-full bg-rose-950/80 text-rose-400 flex items-center justify-center hover:bg-rose-900 cursor-pointer"
                title="Delete Reel"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bottom Gradient & Author Info */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10 text-white space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={activeReel.authorAvatar}
                alt={activeReel.authorName}
                className="w-9 h-9 rounded-full border-2 border-rose-500 object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black">{activeReel.authorName}</span>
                  {activeReel.authorBadge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-rose-600 text-white font-bold">
                      {activeReel.authorBadge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-300">{activeReel.createdAt}</span>
              </div>
            </div>

            <p className="text-xs text-slate-100 line-clamp-2 leading-relaxed">
              {activeReel.caption}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {activeReel.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-bold text-rose-300">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Sound info */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300 pt-1">
              <Music className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{activeReel.musicTitle || activeReel.songTitle || 'Quantum Cosmo School Original Audio'}</span>
            </div>
          </div>

          {/* Navigation Overlay Buttons (Left/Right swipe emulation) */}
          <div className="absolute top-1/2 inset-x-2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
            <button
              onClick={handlePrev}
              disabled={activeReelIndex === 0}
              className={`w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center pointer-events-auto transition-opacity ${
                activeReelIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-80 hover:opacity-100 cursor-pointer'
              }`}
            >
              ▲
            </button>
            <button
              onClick={handleNext}
              disabled={activeReelIndex === reels.length - 1}
              className={`w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center pointer-events-auto transition-opacity ${
                activeReelIndex === reels.length - 1 ? 'opacity-0 cursor-default' : 'opacity-80 hover:opacity-100 cursor-pointer'
              }`}
            >
              ▼
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-bold">No reels available.</p>
          <button onClick={() => setIsCreateModalOpen(true)} className="mt-3 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">
            Upload First Reel
          </button>
        </div>
      )}

      {/* Comment Drawer */}
      {isCommentDrawerOpen && activeReel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Comments ({activeReel.comments?.length || 0})
              </h3>
              <button onClick={() => setIsCommentDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {(activeReel.comments || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No comments yet. Be the first!</p>
              ) : (
                activeReel.comments.map(c => (
                  <div key={c.id} className="flex gap-2.5 items-start text-xs">
                    <img src={c.authorAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 mt-0.5">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={language === 'bn' ? 'কমেন্ট লিখুন...' : 'Add a comment...'}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Reel Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'নতুন ক্যাম্পাস রিল আপলোড' : 'Upload Campus Reel'}
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'ক্যাপশন *' : 'Caption *'}
                </label>
                <input
                  type="text"
                  required
                  value={newCaption}
                  onChange={e => setNewCaption(e.target.value)}
                  placeholder="e.g. Science Olympiad practice at Quantum Cosmo School..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'ভিডিও লিংক / URL (ঐচ্ছিক)' : 'Video URL (Optional)'}
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={e => setNewVideoUrl(e.target.value)}
                  placeholder="https://... or leave blank for sample MP4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'মিউজিক বা অডিও শিরোনাম' : 'Music / Song Title'}
                </label>
                <input
                  type="text"
                  value={newMusicTitle}
                  onChange={e => setNewMusicTitle(e.target.value)}
                  placeholder="Quantum Cosmo Assembly Anthem"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'ট্যাগস (কমা দিয়ে লিখুন)' : 'Tags'}
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="QuantumCosmo, SSC2027, ScienceLab"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  {language === 'bn' ? 'রিল পোস্ট করুন' : 'Publish Reel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
