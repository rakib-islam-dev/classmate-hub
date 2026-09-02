import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EducationalNewsItem } from '../types';
import { 
  Sparkles, 
  BookOpen, 
  Heart, 
  MessageSquare, 
  Search, 
  Plus, 
  X, 
  Trash2, 
  ArrowUpRight 
} from 'lucide-react';

export const EducationalNewsView: React.FC = () => {
  const { 
    currentUser, 
    educationalNews, 
    addEducationalNews, 
    toggleLikeEduNews, 
    addCommentToEduNews, 
    deleteEduNews, 
    language, 
    isAdmin,
    setIsGoogleSearchOpen
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<EducationalNewsItem | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});

  // Add News Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'SSC 2027' | 'Science & Tech' | 'Math & Olympiad' | 'General Knowledge' | 'English & ICT'>('SSC 2027');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCoverImage, setNewCoverImage] = useState('');
  const [newTags, setNewTags] = useState('SSC2027, ExamPrep');

  const filteredNews = educationalNews.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ((item.content || '').toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || (!newContent.trim() && !newSummary.trim())) return;

    const defaultImages: Record<string, string> = {
      'SSC 2027': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      'Science & Tech': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      'Math & Olympiad': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
      'English & ICT': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      'General Knowledge': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
    };

    const finalCover = newCoverImage.trim() || defaultImages[newCategory] || defaultImages['SSC 2027'];
    const parsedTags = newTags.split(',').map(t => t.trim().replace('#', '')).filter(Boolean);

    addEducationalNews({
      title: newTitle.trim(),
      category: newCategory,
      summary: newSummary.trim() || newContent.slice(0, 120) + '...',
      content: newContent.trim() || newSummary.trim(),
      imageUrl: finalCover,
      coverImage: finalCover,
      author: currentUser.name,
      source: 'Quantum Cosmo School SSC 2027 Academic Panel',
      tags: parsedTags.length > 0 ? parsedTags : ['SSC2027']
    });

    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewCoverImage('');
    setIsAddNewsOpen(false);
  };

  const handleCommentSubmit = (newsId: string) => {
    const text = commentInputs[newsId]?.trim();
    if (!text) return;
    addCommentToEduNews(newsId, text);
    setCommentInputs(prev => ({ ...prev, [newsId]: '' }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto pb-12">
      {/* Header & Featured Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>SSC 2027 Daily Academic Feed & Updates</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black">
            {language === 'bn' ? 'শিক্ষামূলক আপডেট, সাজেশন্স ও বিজ্ঞান কর্নার' : 'Educational News & SSC 2027 Prep'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            {language === 'bn'
              ? 'নিয়মিত নতুন পড়াশোনার আপডেট, পদার্থ ও উচ্চতর গণিতের শর্টকাট মেথড, এবং স্পেশাল মডেল টেস্ট।'
              : 'Curated SSC 2027 study tips, board exam analysis, science guides, and daily campus updates.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsGoogleSearchOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{language === 'bn' ? 'গুগল স্টাডি সার্চ' : 'Google Search'}</span>
          </button>

          <button
            onClick={() => setIsAddNewsOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>{language === 'bn' ? 'আপডেট পোস্ট করুন' : 'Post Update'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: language === 'bn' ? 'সব খবর' : 'All Updates' },
            { id: 'SSC 2027', label: language === 'bn' ? 'SSC 2027 প্রস্তুতি' : 'SSC Prep' },
            { id: 'Science & Tech', label: language === 'bn' ? 'বিজ্ঞান ও অলিম্পিয়াড' : 'Science' },
            { id: 'Math & Olympiad', label: language === 'bn' ? 'উচ্চতর গণিত' : 'Higher Math' },
            { id: 'English & ICT', label: 'ICT & English' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'টপিক বা সংবাদ খুঁজুন...' : 'Search articles...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNews.map(item => {
          const cover = item.coverImage || item.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80';
          const authorDisplay = item.author || item.source;
          const tagsList = item.tags || ['SSC2027'];

          return (
            <article
              key={item.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div 
                className="relative aspect-[16/9] overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => setActiveArticle(item)}
              >
                <img
                  src={cover}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-amber-600 text-white backdrop-blur-md uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{authorDisplay}</span>
                    <span>{item.publishedAt}</span>
                  </div>

                  <h3 
                    onClick={() => setActiveArticle(item)}
                    className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-amber-500 transition-colors"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tagsList.map((tag: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLikeEduNews(item.id)}
                      className={`flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${
                        item.isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-rose-500' : ''}`} />
                      <span>{item.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveArticle(item)}
                      className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-indigo-400 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{item.comments.length}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveArticle(item)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'bn' ? 'বিস্তারিত' : 'Read'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {(isAdmin || item.source.includes(currentUser.name)) && (
                      <button
                        onClick={() => deleteEduNews(item.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Full Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                {activeArticle.category}
              </span>
              <button onClick={() => setActiveArticle(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{activeArticle.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>By {activeArticle.author || activeArticle.source}</span>
                <span>•</span>
                <span>{activeArticle.publishedAt}</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-950">
              <img 
                src={activeArticle.coverImage || activeArticle.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'} 
                alt="" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {activeArticle.content || activeArticle.summary}
            </div>

            {/* Comments */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Comments ({activeArticle.comments.length})
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activeArticle.comments.map(c => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{c.authorName}</span>
                      <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{c.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentInputs[activeArticle.id] || ''}
                  onChange={e => setCommentInputs(prev => ({ ...prev, [activeArticle.id]: e.target.value }))}
                  placeholder={language === 'bn' ? 'মতামত বা প্রশ্ন লিখুন...' : 'Write comment or question...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() => handleCommentSubmit(activeArticle.id)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {isAddNewsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'bn' ? 'নতুন শিক্ষামূলক আপডেট পোস্ট করুন' : 'Post Educational Article'}
                </h3>
              </div>
              <button onClick={() => setIsAddNewsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Physics Chapter 4 Work, Power & Energy Short Cut Hacks"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="SSC 2027">SSC 2027 Prep</option>
                    <option value="Science & Tech">Science & Tech / বিজ্ঞান ও প্রযুক্তি</option>
                    <option value="Math & Olympiad">Math & Olympiad / উচ্চতর গণিত</option>
                    <option value="English & ICT">English & ICT / আইসিটি</option>
                    <option value="General Knowledge">General Knowledge / সাধারণ জ্ঞান</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Tags</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="SSC2027, Physics"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Short Summary</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="Quick highlight of this post..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Article / Study Content *</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write the full lesson, formulas, suggestions or explanation..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddNewsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {language === 'bn' ? 'পোস্ট করুন' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
