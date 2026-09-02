import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GameTruthOrDare } from '../types';
import { 
  Dices, 
  HelpCircle, 
  Flame, 
  Shuffle, 
  Plus, 
  X, 
  Sparkles, 
  CheckCircle,
  Copy,
  Trash2
} from 'lucide-react';

export const StudyGamesView: React.FC = () => {
  const { 
    gamesList, 
    addGameTruthOrDare, 
    deleteGameTruthOrDare, 
    language, 
    isAdmin,
    showToast,
    setActiveTab
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'truth' | 'dare'>('all');
  const [activeCard, setActiveCard] = useState<GameTruthOrDare | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // Add Form
  const [newType, setNewType] = useState<'truth' | 'dare'>('truth');
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<'School Life' | 'Fun & Friendship' | 'SSC Studies' | 'Crazy Dares'>('School Life');

  const filteredGames = gamesList.filter((g: GameTruthOrDare) => {
    if (selectedFilter === 'truth') return g.type === 'truth';
    if (selectedFilter === 'dare') return g.type === 'dare';
    return true;
  });

  const handleSpinRandom = () => {
    if (gamesList.length === 0) return;
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * gamesList.length);
      setActiveCard(gamesList[randomIndex]);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    addGameTruthOrDare({
      type: newType,
      question: newQuestion.trim(),
      prompt: newQuestion.trim(),
      category: newCategory
    });

    setNewQuestion('');
    setIsAddModalOpen(false);
  };

  const handleCopyQuestion = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(language === 'bn' ? 'কপি হয়েছে' : 'Copied', 'Question copied to clipboard.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
            <Dices className="w-3.5 h-3.5 text-pink-200" />
            <span>SSC 2027 Batch Truth or Dare Corner</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black">
            {language === 'bn' ? 'ট্রুথ অর ডেয়ার — আড্ডা ও মজার খেলা' : 'Truth or Dare: Fun & Friendship'}
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
            {language === 'bn'
              ? 'স্কুল লাইফের স্মৃতি, সহপাঠীদের অজানা গল্প, ফিজিক্স/ম্যাথের মজাদার চ্যালেঞ্জ এবং ডেয়ার সম্পন্ন করুন!'
              : 'Break the study stress with school life confessions, academic challenges, and fun peer dares!'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSpinRandom}
            disabled={isSpinning}
            className="px-5 py-3 rounded-2xl bg-white text-purple-900 hover:bg-pink-50 font-black text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
          >
            <Shuffle className={`w-4 h-4 text-pink-600 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{language === 'bn' ? 'র‍্যান্ডম প্রশ্ন স্পিন' : 'Spin Random Card'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন প্রশ্ন যুক্ত করুন' : 'Add Question'}</span>
          </button>
        </div>
      </div>

      {/* Featured Active Card Display */}
      {activeCard && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-pink-500/50 shadow-xl animate-in zoom-in-95 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white ${
                activeCard.type === 'truth' ? 'bg-indigo-600' : 'bg-rose-600'
              }`}>
                {activeCard.type === 'truth' ? '💡 TRUTH' : '🔥 DARE'}
              </span>
              <span className="text-xs font-bold text-slate-500">{activeCard.category}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCopyQuestion(activeCard.question || activeCard.prompt || '')}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                title="Copy Question"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveCard(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="py-4 text-center space-y-2">
            <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white max-w-xl mx-auto leading-snug">
              "{activeCard.question || activeCard.prompt}"
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                showToast('Challenge Accepted!', 'Send your proof or response in Classmates Chat!', 'success');
                setActiveTab('messages');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'চ্যাটে উত্তর বা প্রমাণ পাঠান' : 'Submit Proof in Chat'}</span>
            </button>

            <button
              onClick={handleSpinRandom}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>{language === 'bn' ? 'অন্য একটি দেখাও' : 'Next Random Card'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 w-fit">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {language === 'bn' ? 'সব প্রশ্ন ও ডেয়ার' : 'All Cards'} ({gamesList.length})
        </button>

        <button
          onClick={() => setSelectedFilter('truth')}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedFilter === 'truth'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Truth</span>
        </button>

        <button
          onClick={() => setSelectedFilter('dare')}
          className={`flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedFilter === 'dare'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Dare</span>
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGames.map((game: GameTruthOrDare) => {
          const isTruth = game.type === 'truth';
          const qText = game.question || game.prompt;

          return (
            <div
              key={game.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all hover:shadow-md flex flex-col justify-between ${
                isTruth
                  ? 'border-indigo-100 dark:border-indigo-950/60 hover:border-indigo-500/50'
                  : 'border-rose-100 dark:border-rose-950/60 hover:border-rose-500/50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                    isTruth ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}>
                    {isTruth ? '💡 TRUTH' : '🔥 DARE'}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">{game.category}</span>
                </div>

                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed pt-1">
                  "{qText}"
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveCard(game)}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কার্ডটি সিলেক্ট করুন' : 'Play This Card'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyQuestion(qText || '')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    title="Copy Question"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => deleteGameTruthOrDare(game.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'নতুন ট্রুথ বা ডেয়ার যুক্ত করুন' : 'Add Truth or Dare Card'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="truth">Truth (সত্য বলা)</option>
                    <option value="dare">Dare (চ্যালেঞ্জ সম্পন্ন করা)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="School Life">School Life (ক্যাম্পাস জীবন)</option>
                    <option value="Fun & Friendship">Fun & Friendship (বন্ধুত্ব)</option>
                    <option value="SSC Studies">SSC Studies (পড়াশোনা ও স্বপ্ন)</option>
                    <option value="Crazy Dares">Crazy Dares (চ্যালেঞ্জ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'প্রশ্ন বা ডেয়ার নির্দেশাবলী *' : 'Question or Dare Prompt *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="e.g. কসমো স্কুলের সবচেয়ে মজার স্মৃতি কোনটি ছিল?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {language === 'bn' ? 'যোগ করুন' : 'Add Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
