import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MarketplaceItem, ListingCategory, PriceType, ListingCondition } from '../types';
import { 
  Plus, 
  Search, 
  Heart, 
  MessageSquare, 
  ArrowRightLeft, 
  Eye, 
  Gift, 
  Clock, 
  X,
  Trees,
  Upload
} from 'lucide-react';
import { CampusPhotoModal } from './CampusPhotoModal';

export const MarketplaceView: React.FC = () => {
  const { 
    marketplaceItems, 
    addMarketplaceItem, 
    toggleLikeItem, 
    currentUser, 
    setActiveChatTarget, 
    setActiveTab, 
    t,
    language,
    showToast 
  } = useApp();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriceType, setSelectedPriceType] = useState<string>('All');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState<MarketplaceItem | null>(null);

  // New Listing Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Textbooks');
  const [condition, setCondition] = useState<ListingCondition>('Good');
  const [priceType, setPriceType] = useState<PriceType>('trade');
  const [price, setPrice] = useState<number>(10);
  const [tradeFor, setTradeFor] = useState('');
  const [courseCode, setCourseCode] = useState('CSE 311');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80');

  const categories: string[] = [
    'All',
    'Textbooks',
    'Handwritten Notes',
    'Calculators & Tech',
    'Lab Equipment',
    'Past Exams & Solutions',
    'Coursework Projects'
  ];

  const priceTypes = ['All', 'trade', 'sale', 'free', 'lend'];

  // Filter items
  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tradeFor && item.tradeFor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesPriceType = selectedPriceType === 'All' || item.priceType === selectedPriceType;

    return matchesSearch && matchesCategory && matchesPriceType;
  });

  const handleCustomItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          showToast(
            language === 'bn' ? 'ছবির প্রিভিউ তৈরি হয়েছে' : 'Item Photo Attached',
            language === 'bn' ? 'আপনার আইটেমের আসল ছবি যুক্ত হয়েছে।' : 'Custom item photo uploaded.',
            'success'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addMarketplaceItem({
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      priceType,
      price: priceType === 'sale' ? Number(price) : undefined,
      tradeFor: priceType === 'trade' || priceType === 'lend' ? tradeFor.trim() || (language === 'bn' ? 'প্রয়োজনীয় যেকোনো স্টাডি ম্যাটেরিয়াল' : 'Any relevant course materials') : undefined,
      courseCode: courseCode.trim() || 'GENERAL',
      images: [imageUrl.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setTradeFor('');
    setIsPostModalOpen(false);
  };

  const handleStartTradeChat = (item: MarketplaceItem) => {
    if (item.sellerId === currentUser.id) {
      showToast(
        language === 'bn' ? 'আপনার নিজস্ব লিস্টিং' : 'Your Listing',
        language === 'bn' ? 'এটি আপনার নিজের পোস্ট করা আইটেম।' : 'This is your own listing.',
        'info'
      );
      return;
    }
    setActiveChatTarget({ type: 'direct', id: item.sellerId });
    setActiveTab('messages');
    showToast(
      language === 'bn' ? 'সহপাঠীর সাথে সংযোগ হচ্ছে' : 'Connecting with Classmate',
      `${item.sellerName} ${language === 'bn' ? 'এর সাথে চ্যাট রুম খোলা হয়েছে।' : 'opened chat regarding'} "${item.title}"`,
      'info'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Post Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-850 to-violet-900 text-white shadow-xl shadow-indigo-900/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
              {language === 'bn' ? 'ক্যাম্পাস পিয়ার এক্সচেঞ্জ' : 'Campus Peer Exchange'}
            </span>
            <span className="text-xs text-indigo-200 hidden sm:inline">• {language === 'bn' ? 'নিরাপদ ও নির্ভরযোগ্য' : 'Safe • On-Campus • Zero Platform Fees'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {t.marketplaceHeader}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-xl">
            {t.marketplaceSub}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
          >
            <Trees className="w-4 h-4 text-emerald-300" />
            <span>{t.campusSpots}</span>
          </button>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>{t.postItem}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Field */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'কোর্স কোড (যেমন CSE 311), বইয়ের নাম বা নোটস খুঁজুন...' : 'Search course code (e.g. CSE 311, MATH 205), textbook title, or notes...'}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-hidden transition-all"
            />
          </div>

          {/* Deal Type Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {priceTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedPriceType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  selectedPriceType === type
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type === 'trade' ? (language === 'bn' ? '🔄 অদলবদল (Swap)' : '🔄 Swap / Trade') :
                 type === 'sale' ? (language === 'bn' ? '💵 ক্রয় / বিক্রয়' : '💵 Buy / Sell') :
                 type === 'free' ? (language === 'bn' ? '🎁 বিনামূল্যে দান' : '🎁 Free Giveaway') :
                 type === 'lend' ? (language === 'bn' ? '⏱️ ধার নেওয়া / দেওয়া' : '⏱️ Borrow / Lend') : 
                 (language === 'bn' ? 'সকল লিস্টিং' : 'All Listings')}
              </button>
            ))}
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredItems.map(item => {
          const isOwner = item.sellerId === currentUser.id;

          return (
            <div
              key={item.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Price / Trade Badge */}
                  <div className="absolute top-3 left-3">
                    {item.priceType === 'trade' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600/95 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3" />
                        <span>{t.tradeSwap}</span>
                      </span>
                    )}
                    {item.priceType === 'sale' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/95 text-white backdrop-blur-md shadow-md">
                        ${item.price} USD
                      </span>
                    )}
                    {item.priceType === 'free' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600/95 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        <span>{t.freeGiveaway}</span>
                      </span>
                    )}
                    {item.priceType === 'lend' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-600/95 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{t.borrowLend}</span>
                      </span>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => toggleLikeItem(item.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      item.isLikedByUser
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-slate-900/60 text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {/* Course Code Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-900/80 text-amber-300 backdrop-blur-md border border-white/10">
                      {item.courseCode}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.category}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      {item.condition}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {item.tradeFor && (
                    <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-1.5">
                      <ArrowRightLeft className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                      <span className="line-clamp-1">
                        <strong>{language === 'bn' ? 'বিনিময়ে চায়:' : 'Seeking:'}</strong> {item.tradeFor}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Seller info & Action button */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={item.sellerAvatar}
                      alt={item.sellerName}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block truncate">{item.sellerName}</span>
                      <span className="text-[10px] text-slate-400">{item.sellerDepartment}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setSelectedItemDetail(item)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title={language === 'bn' ? 'বিস্তারিত দেখুন' : 'Quick View Details'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleStartTradeChat(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isOwner ? (language === 'bn' ? 'আমার পোস্ট' : 'My Item') : (language === 'bn' ? 'চ্যাট করুন' : 'Trade Chat')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ITEM DETAIL MODAL */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="relative aspect-16/9 bg-slate-950">
              <img
                src={selectedItemDetail.images[0]}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                  <span>{selectedItemDetail.courseCode} • {selectedItemDetail.category}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedItemDetail.condition}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedItemDetail.title}
                </h3>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <p className="whitespace-pre-line leading-relaxed">{selectedItemDetail.description}</p>
              </div>

              {selectedItemDetail.tradeFor && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs">
                  <strong>{language === 'bn' ? 'বিনিময় পছন্দ:' : 'Trade Preference:'}</strong> {selectedItemDetail.tradeFor}
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={selectedItemDetail.sellerAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">{selectedItemDetail.sellerName}</p>
                    <p className="text-[11px] text-slate-400">{selectedItemDetail.sellerDepartment}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleStartTradeChat(selectedItemDetail);
                    setSelectedItemDetail(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer"
                >
                  {language === 'bn' ? 'সরাসরি প্রপোজাল পাঠান' : 'Send Direct Trade Proposal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE LISTING MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto p-5 sm:p-6">
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'bn' ? 'ক্যাম্পাস ট্রেডের জন্য বই বা নোটস পোস্ট করুন' : 'List Item or Notes for Campus Trade'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'সহপাঠীদের সাথে সরাসরি লেনদেন করুন' : 'Share with classmates safely within campus'}
                </p>
              </div>
              <button 
                onClick={() => setIsPostModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'শিরোনাম / বইয়ের নাম *' : 'Title / Book Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Operating Systems Concepts (Silberschatz) or Calculus Hand Notes"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ListingCategory)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Textbooks">Textbooks</option>
                    <option value="Handwritten Notes">Handwritten Notes</option>
                    <option value="Calculators & Tech">Calculators & Tech</option>
                    <option value="Lab Equipment">Lab Equipment</option>
                    <option value="Past Exams & Solutions">Past Exams & Solutions</option>
                    <option value="Coursework Projects">Coursework Projects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'কোর্স কোড' : 'Course Code'}
                  </label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CSE 311 or PHY 102"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'লিস্টিং টাইপ' : 'Listing Type'}
                  </label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as PriceType)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="trade">Trade / Swap</option>
                    <option value="sale">Sell (Fixed Price)</option>
                    <option value="free">Free Giveaway / Share</option>
                    <option value="lend">Borrow / Lend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'কন্ডিশন' : 'Condition'}
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ListingCondition)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Digital PDF / Code">Digital PDF / Code</option>
                  </select>
                </div>
              </div>

              {priceType === 'sale' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'মূল্য ($ বা সমপরিমাণ)' : 'Price ($ USD or Equivalent)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
              )}

              {(priceType === 'trade' || priceType === 'lend') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'বিনিময়ে আপনি কী চান?' : 'What would you like in return?'}
                  </label>
                  <input
                    type="text"
                    value={tradeFor}
                    onChange={(e) => setTradeFor(e.target.value)}
                    placeholder="e.g. Seeking Algorithms CLRS or Microelectronics 4th Ed"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'বিবরণ ও গুরুত্বপূর্ণ তথ্য *' : 'Description & Key Highlights *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention edition, highlighting, included problem solutions, lab notes, etc..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Upload Custom Photo or Select Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'bn' ? 'আইটেম বা বইয়ের ছবি' : 'Item / Book Photograph'}
                  </label>
                  <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Real Photo'}</span>
                    <input type="file" accept="image/*" onChange={handleCustomItemImageUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex gap-2 overflow-x-auto py-1">
                  {[
                    imageUrl,
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&auto=format&fit=crop&q=80'
                  ].filter((v, i, a) => a.indexOf(v) === i).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      onClick={() => setImageUrl(img)}
                      className={`w-16 h-12 rounded-xl object-cover cursor-pointer transition-all ${imageUrl === img ? 'ring-2 ring-indigo-600 scale-105' : 'opacity-60'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'পোস্ট প্রকাশ করুন' : 'Publish Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <CampusPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

    </div>
  );
};
