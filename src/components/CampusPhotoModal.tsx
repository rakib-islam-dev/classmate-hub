import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Sun, 
  Compass, 
  Trees, 
  Building2, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  Link
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CampusPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Landmark {
  id: string;
  name: string;
  category: string;
  x: number; // percentage
  y: number; // percentage
  description: string;
}

export const CampusPhotoModal: React.FC<CampusPhotoModalProps> = ({ isOpen, onClose }) => {
  const { campusPhoto, setCampusPhoto, resetCampusPhoto, t, language, showToast } = useApp();

  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  if (!isOpen) return null;

  const landmarks: Landmark[] = [
    {
      id: 'lm_1',
      name: language === 'bn' ? 'প্রধান একাডেমিক ভবন ও ক্লাসরুম' : 'Central Academic Building & Classrooms',
      category: language === 'bn' ? 'এসএসসি একাডেমিক ভবন' : 'Academic Classrooms',
      x: 48,
      y: 65,
      description: language === 'bn' 
        ? 'কোয়ান্টাম কসমো স্কুলের মূল একাডেমিক ভবন যেখানে এসএসসি ২০২৭ ব্যাচের বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগের ক্লাস পরিচালিত হয়।' 
        : 'The central academic complex where Quantum Cosmo School SSC 2027 classes for Science, Commerce, and Humanities are held.'
    },
    {
      id: 'lm_2',
      name: language === 'bn' ? 'বিজ্ঞান ল্যাবরেটরি ও আইসিটি সেন্টার' : 'Science Laboratory & ICT Center',
      category: language === 'bn' ? 'ব্যবহারিক ল্যাব' : 'Science Labs & ICT',
      x: 79,
      y: 53,
      description: language === 'bn' 
        ? 'পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান প্র্যাকটিক্যাল ল্যাব ও কম্পিউটার ল্যাব।' 
        : 'Fully-equipped Physics, Chemistry, Biology practical laboratories and high-speed computer programming lab.'
    },
    {
      id: 'lm_3',
      name: language === 'bn' ? 'কসমো ডরমিটরি ও ছাত্রাবাস' : 'Cosmo Student Dormitories',
      category: language === 'bn' ? 'শিক্ষার্থী আবাস' : 'Student Housing',
      x: 34,
      y: 53,
      description: language === 'bn' 
        ? 'লামার সবুজ পাহাড়ে অবস্থিত কসমো শিক্ষার্থীদের মনোরম ও সুশৃঙ্খল আবাসিক ডরমিটরি।' 
        : 'Peaceful residential dormitories located in the scenic hills of Lama, Bandarban.'
    },
    {
      id: 'lm_4',
      name: language === 'bn' ? 'কসমো স্পোর্টস গ্রাউন্ড ও জিমনেসিয়াম' : 'Cosmo Sports Ground & Gymnastics Arena',
      category: language === 'bn' ? 'ক্রীড়া ও শরীরচর্চা' : 'Sports & Athletics',
      x: 29,
      y: 75,
      description: language === 'bn' 
        ? 'জাতীয় চ্যাম্পিয়ন কোয়ান্টাম জিমন্যাস্ট ও ক্রীড়াবিদদের আন্তর্জাতিক মানের প্র্যাকটিস গ্রাউন্ড।' 
        : 'Renowned sports ground and athletics track where Quantum Cosmo students train and excel.'
    },
    {
      id: 'lm_5',
      name: language === 'bn' ? 'ধ্যান কেন্দ্র ও সবুজ পাহাড়ি প্রাঙ্গণ' : 'Meditation Center & Hill Trails',
      category: language === 'bn' ? 'প্রশান্তিময় পরিবেশ' : 'Meditation & Nature',
      x: 60,
      y: 38,
      description: language === 'bn' 
        ? 'মনোসংযোগ ও শান্ত পরিবেশের জন্য মনোরম পাহাড়ি বন ও ওয়াকিং ট্রেইল।' 
        : 'Lush tropical biodiversity forest trails and peaceful meditation zones fostering mental focus.'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCampusPhoto(reader.result);
          setShowUploadDrawer(false);
          showToast(
            language === 'bn' ? 'ক্যাম্পাসের ছবি আপডেট হয়েছে' : 'Campus Photo Updated',
            language === 'bn' ? 'আপনার স্কুলের আসল ছবি সফলভাবে যুক্ত হয়েছে।' : 'Real school picture has been applied across the platform.',
            'success'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;
    setCampusPhoto(customPhotoUrl.trim());
    setCustomPhotoUrl('');
    setShowUploadDrawer(false);
    showToast(
      language === 'bn' ? 'ক্যাম্পাসের ছবি আপডেট হয়েছে' : 'Campus Photo Updated',
      language === 'bn' ? 'আপনার স্কুলের আসল ছবি সফলভাবে যুক্ত হয়েছে।' : 'Real school picture has been applied across the platform.',
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  {language === 'bn' ? 'আমাদের ক্যাম্পাসের ছবি ও দর্শনীয় স্থান' : 'Our School Campus & Landmarks'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {language === 'bn' ? 'রিয়েল ক্যাম্পাস ছবি' : 'Real School Photo'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                {language === 'bn' ? 'লাল ছাদযুক্ত ভবন ও পাহাড়ঘেরা সবুজ ক্যাম্পাস • ক্লাসমেট ক্যাম্পাস কমিউনিটি' : 'Lush green hills & distinctive red-roofed academic halls • ClassMate Student Community'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Upload Button */}
            <button
              onClick={() => setShowUploadDrawer(!showUploadDrawer)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.uploadRealSchoolPhoto}</span>
            </button>

            {/* Landmarks toggle */}
            <button
              onClick={() => setShowLandmarks(!showLandmarks)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showLandmarks
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'স্থানসমূহ' : 'Landmarks'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload Custom School Photo Drawer */}
        {showUploadDrawer && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/60 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                  {language === 'bn' ? 'আপনার স্কুলের আসল ছবি যুক্ত করুন' : 'Add Your Real School Campus Picture'}
                </h4>
              </div>
              <button
                type="button"
                onClick={resetCampusPhoto}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetDefaultPhoto}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Option 1: File Upload */}
              <label className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-emerald-400/60 hover:border-emerald-500 bg-white dark:bg-slate-900 cursor-pointer transition-colors text-center">
                <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'bn' ? 'ডিভাইস বা গ্যালারি থেকে ছবি আপলোড করুন' : 'Upload from Device / Gallery'}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              {/* Option 2: Image URL */}
              <form onSubmit={handleUrlSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Link className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder={language === 'bn' ? 'ছবির অনলাইন লিঙ্ক (URL) দিন...' : 'Paste image URL...'}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-hidden focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!customPhotoUrl.trim()}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'সেট করুন' : 'Set Photo'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Interactive Image Canvas */}
        <div className="relative flex-1 overflow-auto bg-slate-950 flex items-center justify-center min-h-[320px] max-h-[560px]">
          <div 
            className="relative w-full h-full transition-transform duration-300 flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={campusPhoto}
              alt="Our School Aerial Campus"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[560px] object-cover sm:object-contain select-none"
            />

            {/* Landmark Interactive Pins */}
            {showLandmarks && landmarks.map((lm) => (
              <div
                key={lm.id}
                style={{ top: `${lm.y}%`, left: `${lm.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                <button
                  onClick={() => setSelectedLandmark(lm)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg transition-all transform hover:scale-110 cursor-pointer ${
                    selectedLandmark?.id === lm.id
                      ? 'bg-rose-500 text-white ring-4 ring-rose-400/30'
                      : 'bg-slate-900/90 text-white border border-white/30 backdrop-blur-sm hover:bg-indigo-600'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span className="whitespace-nowrap hidden sm:inline">{lm.name.split(' ')[0]}</span>
                </button>

                {/* Hover Tooltip */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded-xl bg-slate-900/95 text-white text-[11px] border border-slate-700 shadow-xl pointer-events-none z-30">
                  <p className="font-bold text-amber-300">{lm.name}</p>
                  <p className="text-[10px] text-slate-300 mt-1 leading-snug">{lm.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-white text-xs z-20">
            <span className="text-[11px] text-slate-300">{language === 'bn' ? 'জুম:' : 'Zoom:'}</span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.25))}
              className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold cursor-pointer"
            >
              -
            </button>
            <span className="font-mono text-xs w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))}
              className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Environmental Campus Stats */}
          <div className="absolute top-4 right-4 hidden sm:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-white text-[11px] z-20">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Sun className="w-3.5 h-3.5" />
              <span>28°C {language === 'bn' ? 'রৌদ্রোজ্জ্বল' : 'Sunny'}</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-1.5 text-indigo-300">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'উচ্চতা ৩৪০ মি.' : 'Elev. 340m'}</span>
            </div>
          </div>
        </div>

        {/* Landmark Detail Drawer */}
        {selectedLandmark && (
          <div className="p-4 bg-indigo-50 dark:bg-slate-800/90 border-t border-indigo-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedLandmark.name}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-semibold">
                    {selectedLandmark.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {selectedLandmark.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedLandmark(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            {language === 'bn' 
              ? 'আমাদের ক্যাম্পাসের অফিসিয়াল ল্যান্ডস্কেপ ও পরিবেশ • ক্লাসমেট হাব' 
              : 'Official community campus background for ClassMate'}
          </p>

          <div className="flex items-center gap-3">
            <a
              href={campusPhoto}
              download="Our_School_Campus.jpg"
              className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'bn' ? 'ছবি ডাউনলোড করুন' : 'Download Image'}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
