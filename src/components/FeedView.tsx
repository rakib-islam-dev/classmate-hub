import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DiscussionPost } from '../types';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Plus, 
  Pin, 
  Send, 
  X, 
  Video,
  Film,
  Image as ImageIcon
} from 'lucide-react';
import { CampusBanner } from './CampusBanner';

export const FeedView: React.FC = () => {
  const { posts, addPost, toggleUpvotePost, addCommentToPost, t, language, showToast } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // New Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<DiscussionPost['category']>('Project Collaboration');
  const [postTags, setPostTags] = useState('CSE311, TeamFinder, FinalProject');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none');
  const [mediaName, setMediaName] = useState('');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const filterCategories = [
    'All',
    'Project Collaboration',
    'Academic Question',
    'Exam Prep',
    'Campus News'
  ];

  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'All') return true;
    return post.category === selectedFilter;
  });

  const handlePostMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setMediaUrl(reader.result);
          setMediaType(type);
          setMediaName(file.name);
          showToast(
            type === 'video' 
              ? (language === 'bn' ? 'ভিডিও যুক্ত হয়েছে 🎬' : 'Video Attached 🎬')
              : (language === 'bn' ? 'ছবি যুক্ত হয়েছে 🖼️' : 'Image Attached 🖼️'),
            type === 'video'
              ? (language === 'bn' ? 'পোস্টে ভিডিও ক্লিপ সফলভাবে যুক্ত হয়েছে।' : 'Video attached to your campus post.')
              : (language === 'bn' ? 'পোস্টে ছবি যুক্ত করা হয়েছে।' : 'Photo attached to your campus post.'),
            'success'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSampleVideo = () => {
    setMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setMediaType('video');
    setMediaName('Project_Walkthrough_Demo.mp4');
    showToast(
      language === 'bn' ? 'ডেমো ভিডিও যুক্ত হয়েছে 🎬' : 'Demo Video Attached 🎬',
      language === 'bn' ? 'প্রজেক্ট ডেমো ভিডিও পোস্টে যুক্ত হয়েছে।' : 'Sample walkthrough clip added to post.',
      'info'
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    addPost({
      title: postTitle.trim(),
      content: postContent.trim(),
      category: postCategory,
      tags: postTags.split(',').map(t => t.trim()).filter(Boolean),
      mediaType: mediaType,
      mediaUrl: mediaUrl.trim() || undefined,
      mediaTitle: mediaName || undefined,
      isPinned: false
    });

    setPostTitle('');
    setPostContent('');
    setMediaUrl('');
    setMediaType('none');
    setMediaName('');
    setIsNewPostModalOpen(false);
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    addCommentToPost(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* School Aerial Campus Showcase Banner */}
      <CampusBanner variant="compact" />

      {/* Feed Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
            {language === 'bn' ? 'ক্যাম্পাস কোলাবোরেশন বোর্ড' : 'Campus Collaboration Board'}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1.5">
            {t.feedHeader}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {t.feedSub}
          </p>
        </div>

        <button
          onClick={() => setIsNewPostModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-2xl text-xs sm:text-sm text-white shadow-md transition-all self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newDiscussion}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {filterCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat === 'All' ? (language === 'bn' ? 'সকল পোস্ট' : 'All Posts') :
             cat === 'Project Collaboration' ? (language === 'bn' ? 'টিম ও প্রজেক্ট' : 'Project Collaboration') :
             cat === 'Academic Question' ? (language === 'bn' ? 'একাডেমিক প্রশ্ন' : 'Academic Question') :
             cat === 'Exam Prep' ? (language === 'bn' ? 'পরীক্ষার প্রস্তুতি' : 'Exam Prep') :
             cat === 'Campus News' ? (language === 'bn' ? 'ক্যাম্পাস নোটিশ' : 'Campus News') : cat}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map(post => {
          return (
            <article
              key={post.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs p-5 sm:p-6 space-y-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{post.authorName}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">{post.authorDepartment.split(' ')[0]}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{post.authorSemester} • {post.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.isPinned && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      <Pin className="w-3 h-3" />
                      <span>{language === 'bn' ? 'পিন করা' : 'Pinned'}</span>
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Optional Media (Image or Video) attachment */}
                {post.mediaUrl && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                    {post.mediaType === 'video' || post.mediaUrl.includes('.mp4') || post.mediaUrl.includes('.webm') || post.mediaUrl.startsWith('data:video') ? (
                      <div className="relative group">
                        <video 
                          src={post.mediaUrl} 
                          controls 
                          playsInline
                          preload="metadata"
                          className="w-full max-h-96 object-contain rounded-2xl bg-black"
                        />
                        {post.mediaTitle && (
                          <div className="p-2 bg-slate-900/90 text-white text-[11px] flex items-center justify-between">
                            <span className="truncate max-w-sm flex items-center gap-1.5">
                              <Film className="w-3.5 h-3.5 text-indigo-400" />
                              {post.mediaTitle}
                            </span>
                            <span className="text-[10px] text-slate-400">Campus Video</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <img 
                        src={post.mediaUrl} 
                        alt="Post Attachment" 
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-cover max-h-80"
                      />
                    )}
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleUpvotePost(post.id)}
                    className="flex items-center gap-1.5 hover:text-indigo-600 font-bold transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.upvotes} {language === 'bn' ? 'ভোট' : 'Upvotes'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} {language === 'bn' ? 'মন্তব্য' : 'Comments'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => showToast(
                    language === 'bn' ? 'লিঙ্ক কপি হয়েছে' : 'Link Copied',
                    language === 'bn' ? 'পোস্টের লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে।' : 'Post share link copied.',
                    'info'
                  )}
                  className="hover:text-indigo-600 transition-colors p-1 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{comment.authorName}</span>
                          <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Comment Input */}
              <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  placeholder={language === 'bn' ? 'সহপাঠীর পোস্টে মন্তব্য লিখুন...' : 'Write an academic reply or answer...'}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-hidden focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!commentInputs[post.id]?.trim()}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </article>
          );
        })}
      </div>

      {/* CREATE POST MODAL */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'bn' ? 'একাডেমিক পোস্ট বা প্রজেক্ট টিম তৈরি করুন' : 'Create Academic Post or Team Finder'}
              </h3>
              <button onClick={() => setIsNewPostModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'পোস্টের শিরোনাম *' : 'Post Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Need 2 Teammates for Cloud Computing Term Paper"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as DiscussionPost['category'])}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Project Collaboration">Project Collaboration</option>
                    <option value="Academic Question">Academic Question</option>
                    <option value="Exam Prep">Exam Prep</option>
                    <option value="Campus News">Campus News</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ট্যাগসমূহ (কমা দিয়ে)' : 'Tags (Comma Separated)'}
                  </label>
                  <input
                    type="text"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    placeholder="CSE311, Go, Research"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'বিস্তারিত ও বিবরণ *' : 'Post Details & Scope *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Outline what you are working on, required roles, or the question you are solving..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Attach Photo or Video to Post */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'bn' ? 'মিডিয়া যুক্ত করুন (ছবি বা ভিডিও)' : 'Attach Media (Photo or Video)'}
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'ছবি আপলোড' : 'Image'}</span>
                      <input type="file" accept="image/*" onChange={(e) => handlePostMediaUpload(e, 'image')} className="hidden" />
                    </label>
                    <label className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer">
                      <Video className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'ভিডিও আপলোড' : 'Video'}</span>
                      <input type="file" accept="video/*" onChange={(e) => handlePostMediaUpload(e, 'video')} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={handleSelectSampleVideo}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
                    >
                      {language === 'bn' ? 'ডেমো ভিডিও' : 'Demo Video'}
                    </button>
                  </div>
                </div>

                {mediaUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 bg-black flex items-center justify-center">
                    {mediaType === 'video' ? (
                      <video src={mediaUrl} controls className="max-h-44 w-full object-contain" />
                    ) : (
                      <img src={mediaUrl} alt="" className="w-full h-36 object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => { setMediaUrl(''); setMediaType('none'); setMediaName(''); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/75 text-white rounded-full hover:bg-black cursor-pointer shadow-md"
                      title={t.close}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'পোস্ট প্রকাশ করুন' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
