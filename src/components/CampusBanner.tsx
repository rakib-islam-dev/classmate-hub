import React, { useState } from 'react';
import { 
  Trees, 
  Eye, 
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CampusPhotoModal } from './CampusPhotoModal';

interface CampusBannerProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const CampusBanner: React.FC<CampusBannerProps> = ({ variant = 'full', className = '' }) => {
  const { campusPhoto, t, language } = useApp();
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  return (
    <>
      <div className={`relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 ${className}`}>
        
        {/* Background Campus Picture */}
        <div className="absolute inset-0 z-0">
          <img
            src={campusPhoto}
            alt="Our School Campus"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none transform hover:scale-105 transition-transform duration-700"
          />
          {/* Subtle gradient overlays for readability and aesthetics */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-900/25" />
          <div className="absolute inset-0 bg-indigo-950/30 mix-blend-multiply" />
        </div>

        {/* Foreground Content */}
        <div className={`relative z-10 p-5 sm:p-7 text-white flex flex-col justify-between ${variant === 'compact' ? 'min-h-[160px]' : 'min-h-[220px]'}`}>
          
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-bold shadow-xs">
                <Trees className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'কোয়ান্টাম কসমো স্কুল • লামা, বান্দরবান' : 'Quantum Cosmo School • Lama, Bandarban'}</span>
              </span>
              <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md text-[11px] font-bold text-indigo-200 border border-indigo-400/30">
                <span>{language === 'bn' ? '🎓 এসএসসি ২০২৭ ব্যাচ' : '🎓 SSC 2027 Batch'}</span>
              </span>
            </div>

            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold transition-all transform active:scale-95 shadow-md cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{t.exploreCampusPhoto}</span>
            </button>
          </div>

          {/* Bottom title & description */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  {language === 'bn' ? 'Quantum Cosmo School - SSC 2027 স্টাডি ও নোটস হাব' : 'Quantum Cosmo School - SSC 2027 Collaboration Hub'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl leading-relaxed drop-shadow-xs">
                {language === 'bn'
                  ? 'কোয়ান্টাম কসমো স্কুলের সবুজ পাহাড়ি ক্যাম্পাসে এসএসসি ২০২৭ ব্যাচের সহপাঠীদের এক্সক্লুসিভ নোটস এক্সচেঞ্জ, টেস্ট পেপার সলিউশন, স্টাডি রুম ও গ্রুপ কল।'
                  : 'Exclusive collaboration platform for Quantum Cosmo School SSC 2027 candidates. Trade handwritten notes, test paper solutions, and join live study rooms.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{language === 'bn' ? 'সম্পূর্ণ ছবি ও আপলোড' : 'View & Upload Photo'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <CampusPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />
    </>
  );
};
