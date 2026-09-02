import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, PhoneCall } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5">
      <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
        toastMessage.type === 'success'
          ? 'bg-slate-900/90 text-white border-emerald-500/40 ring-1 ring-emerald-500/30'
          : toastMessage.type === 'call'
          ? 'bg-indigo-950/95 text-white border-indigo-500/40 ring-1 ring-indigo-500/30'
          : 'bg-slate-900/90 text-white border-slate-700'
      }`}>
        <div className="mt-0.5">
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toastMessage.type === 'call' && <PhoneCall className="w-5 h-5 text-indigo-400 animate-pulse" />}
          {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
        </div>
        <div className="flex-1 text-xs">
          <h4 className="font-bold text-white text-xs sm:text-sm">{toastMessage.title}</h4>
          <p className="text-slate-300 mt-0.5 leading-relaxed">{toastMessage.desc}</p>
        </div>
      </div>
    </div>
  );
};
