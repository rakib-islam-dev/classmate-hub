import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  X, 
  ExternalLink, 
  BookOpen, 
  Sparkles
} from 'lucide-react';

export const GoogleSearchModal: React.FC = () => {
  const { isGoogleSearchOpen, setIsGoogleSearchOpen, language, showToast } = useApp();
  const [query, setQuery] = useState('');

  if (!isGoogleSearchOpen) return null;

  const quickStudySuggestions = [
    { title: 'SSC 2027 Physics Chapter 3 Laws of Motion formulas', cat: 'Physics' },
    { title: 'SSC Higher Math Chapter 9 Exponential and Logarithmic Functions', cat: 'Higher Math' },
    { title: 'SSC Chemistry Chapter 4 Periodic Table & Trends', cat: 'Chemistry' },
    { title: 'SSC Biology Chapter 2 Cells and Tissues of Plants and Animals', cat: 'Biology' },
    { title: 'Quantum Cosmo School Lama Bandarban history and campus', cat: 'Campus' },
    { title: 'SSC 2027 ICT Chapter 3 Number System & Digital Logic', cat: 'ICT' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
    window.open(url, '_blank');
    showToast(language === 'bn' ? 'গুগল সার্চ ওপেন হয়েছে 🔍' : 'Google Search Opened 🔍', query.trim(), 'info');
  };

  const handleQuickClick = (itemTitle: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(itemTitle)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'গুগল স্টাডি সার্চ অ্যাসিস্ট্যান্ট' : 'In-App Google Search & Study Assistant'}
              </h3>
              <p className="text-[11px] text-slate-400">SSC 2027 Academic Lookup Engine</p>
            </div>
          </div>
          <button onClick={() => setIsGoogleSearchOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={language === 'bn' ? 'পড়ালেখার যেকোনো বিষয় বা প্রশ্ন লিখুন...' : 'Search any topic, question, formula...'}
              className="w-full pl-10 pr-24 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-500" />
            {language === 'bn' ? 'SSC 2027 জনপ্রিয় সার্চ টপিকসমূহ:' : 'Popular SSC Topics:'}
          </span>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {quickStudySuggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleQuickClick(item.title)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {item.title}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
