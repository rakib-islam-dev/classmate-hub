import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic, RotateCcw } from 'lucide-react';

interface VoiceMessagePlayerProps {
  audioUrl: string;
  durationSec?: number;
  isMe: boolean;
  language: 'en' | 'bn';
}

export const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({
  audioUrl,
  durationSec = 10,
  isMe,
  language
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(durationSec || 10);
  const [speed, setSpeed] = useState<number>(1);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setTotalDuration(Math.round(audio.duration));
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setHasError(false);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio playback error:', err);
        setHasError(true);
        setIsPlaying(false);
      });
    }
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const nextSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    audioRef.current.playbackRate = nextSpeed;
    setSpeed(nextSpeed);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
  
  // Height variation for realistic waveform sound bars
  const waveHeights = [45, 75, 35, 90, 60, 100, 80, 50, 95, 70, 40, 85, 100, 65, 45, 90, 75, 55, 35, 80, 95, 60, 45, 30];

  return (
    <div 
      className={`mt-2 p-3 rounded-2xl flex items-center gap-3 transition-all ${
        isMe 
          ? 'bg-indigo-700/60 text-white border border-indigo-400/40 shadow-xs' 
          : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xs'
      }`}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer ${
          isMe
            ? 'bg-white text-indigo-700 hover:bg-indigo-50'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        title={isPlaying ? 'Pause' : 'Play Voice Message'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 ml-0.5 fill-current" />
        )}
      </button>

      {/* Waveform & Scrubber */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-0.5 sm:gap-1 h-5.5 overflow-hidden">
          {waveHeights.map((h, i) => {
            const barPct = (i / waveHeights.length) * 100;
            const isPassed = barPct <= progressPct;
            return (
              <span
                key={i}
                className={`w-1 rounded-full transition-all ${
                  isMe
                    ? (isPassed ? 'bg-white' : 'bg-indigo-300/40')
                    : (isPassed ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-650')
                } ${isPlaying && isPassed ? 'scale-y-110' : ''}`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>

        {/* Range slider */}
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max={totalDuration || 10}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 dark:accent-indigo-400"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono opacity-85">
          <span className="flex items-center gap-1 font-sans font-medium">
            <Mic className="w-3 h-3 text-indigo-400 shrink-0" />
            <span>{language === 'bn' ? 'ভয়েস বার্তা' : 'Voice Note'}</span>
          </span>
          <span>
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        {hasError && (
          <p className="text-[10px] text-rose-400 font-sans flex items-center gap-1">
            <RotateCcw className="w-2.5 h-2.5" />
            <span>{language === 'bn' ? 'অডিও চালানো যায়নি, আবার চেষ্টা করুন।' : 'Audio unavailable, click retry.'}</span>
          </p>
        )}
      </div>

      {/* Playback speed toggle */}
      <button
        type="button"
        onClick={cycleSpeed}
        className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-colors shrink-0 cursor-pointer ${
          isMe 
            ? 'bg-white/20 hover:bg-white/30 text-white' 
            : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
        }`}
        title={language === 'bn' ? 'গতি পরিবর্তন করুন (1x / 1.5x / 2x)' : 'Playback Speed (1x / 1.5x / 2x)'}
      >
        {speed}x
      </button>
    </div>
  );
};
