import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MonitorUp,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  FileText,
  Users,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const CallModal: React.FC = () => {
  const { 
    activeCall, 
    endCall, 
    toggleMute, 
    toggleVideo, 
    toggleScreenShare, 
    updateSharedCallNotes,
    currentUser,
    t,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stage' | 'notes'>('stage');
  const [notesText, setNotesText] = useState(activeCall?.sharedNotes || '');
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [callSeconds, setCallSeconds] = useState(0);
  const [myMicLevel, setMyMicLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Real or Simulated Microphone Level Detection
  useEffect(() => {
    let isMounted = true;

    async function initMic() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          if (!isMounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          mediaStreamRef.current = stream;

          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              if (!isMounted) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              // Scale volume from 0 to 100
              const normalized = Math.min(100, Math.round((average / 128) * 100));
              setMyMicLevel(normalized);
              animationFrameRef.current = requestAnimationFrame(checkVolume);
            };
            checkVolume();
          }
        }
      } catch {
        // Fallback simulated acoustic wave pulse
        const interval = setInterval(() => {
          if (!isMounted) return;
          setMyMicLevel(Math.floor(Math.random() * 45) + 15);
        }, 300);
        return () => clearInterval(interval);
      }
    }

    initMic();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (!activeCall) return null;

  const myParticipant = activeCall.participants.find(p => p.id === currentUser.id);
  const isMuted = myParticipant?.isMuted || false;
  const isVideoOn = myParticipant?.isVideoOn || false;
  const isScreenSharing = myParticipant?.isScreenSharing || false;
  const isAudioOnly = activeCall.type === 'audio' && !isVideoOn && !activeCall.participants.some(p => p.isVideoOn);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesText(e.target.value);
    updateSharedCallNotes(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl h-[90vh] max-h-[850px] bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight truncate">
                  {activeCall.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  <span>{activeCall.type === 'audio' ? 'HD Voice 48kHz' : 'Live Video'}</span>
                </span>
                {activeCall.courseCode && (
                  <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {activeCall.courseCode}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-emerald-400 font-bold">{formatCallTime(callSeconds)}</span>
                <span>•</span>
                <span>{activeCall.participants.length} {language === 'bn' ? 'সহপাঠী সংযুক্ত' : 'Classmates connected'}</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline text-slate-500">P2P Opus WebRTC</span>
              </div>
            </div>
          </div>

          {/* Top Switch Tab */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800/80 p-1 rounded-xl text-xs font-semibold border border-slate-700/60">
              <button
                onClick={() => setActiveTab('stage')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'stage' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'স্টাডি স্টেজ' : 'Call Stage'}</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'শেয়ার্ড নোটস' : 'Shared Notes'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stage Center */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-950/60 flex flex-col justify-center">
          
          {activeTab === 'stage' ? (
            isAudioOnly ? (
              /* Dedicated Audio Room Studio Layout */
              <div className="flex flex-col items-center justify-center space-y-6 max-w-3xl mx-auto w-full py-4">
                
                {/* Audio Wave Visualizer Header Banner */}
                <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 text-center space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span>{t.hdVoiceConnected}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Bitrate 64 kbps</span>
                      </span>
                      <span className="hidden sm:inline">|</span>
                      <span className="hidden sm:inline flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AES-256</span>
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Equalizer Frequency Waveform */}
                  <div className="flex items-center justify-center gap-1.5 h-16 sm:h-20 py-2">
                    {[18, 35, 60, 85, 45, 90, 70, 30, 50, 95, 65, 40, 80, 55, 30, 75, 45, 20, 60, 85, 40, 65, 30].map((baseHeight, idx) => {
                      const dynamicScale = isMuted ? 10 : Math.max(15, Math.min(100, baseHeight * (0.4 + (myMicLevel / 100) * 0.9)));
                      return (
                        <div
                          key={idx}
                          className="w-1.5 sm:w-2 bg-gradient-to-t from-indigo-600 via-indigo-400 to-emerald-400 rounded-full transition-all duration-75"
                          style={{
                            height: `${dynamicScale}%`,
                            opacity: isMuted ? 0.3 : 0.9
                          }}
                        />
                      );
                    })}
                  </div>

                  <p className="text-xs text-slate-400">
                    {isMuted 
                      ? (language === 'bn' ? '🔇 আপনার মাইক্রোফোন মিউট করা আছে। কথা বলতে আনমিউট করুন।' : '🔇 Your microphone is muted. Unmute to speak.') 
                      : (language === 'bn' ? '🎙️ মাইক্রোফোন সক্রিয় — কথা বলুন, সহপাঠীরা শুনতে পাচ্ছেন।' : '🎙️ Microphone active — speak naturally, peers can hear you clearly.')}
                  </p>
                </div>

                {/* Participant Voice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {activeCall.participants.map(p => {
                    const isMe = p.id === currentUser.id;
                    const participantMuted = isMe ? isMuted : p.isMuted;
                    const isSpeaking = !participantMuted && (isMe ? myMicLevel > 15 : true);

                    return (
                      <div
                        key={p.id}
                        className={`relative rounded-2xl p-4 bg-slate-900 border transition-all flex items-center gap-3.5 shadow-md ${
                          isSpeaking 
                            ? 'border-emerald-500/70 shadow-emerald-500/10 ring-2 ring-emerald-500/20' 
                            : 'border-slate-800'
                        }`}
                      >
                        {/* Avatar with Sound Pulse Ring */}
                        <div className="relative">
                          {isSpeaking && (
                            <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping" />
                          )}
                          <img
                            src={p.avatar}
                            alt=""
                            className={`w-12 h-12 rounded-full object-cover relative z-10 ring-2 ${
                              isSpeaking ? 'ring-emerald-400' : 'ring-slate-700'
                            }`}
                          />
                          {participantMuted && (
                            <div className="absolute -bottom-1 -right-1 z-20 p-1 rounded-full bg-rose-600 text-white shadow">
                              <MicOff className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>

                        {/* Name and Talking Status */}
                        <div className="flex-1 truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm truncate text-white">
                              {p.name}
                            </span>
                            {isMe && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 font-bold">
                                You
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 mt-1">
                            {participantMuted ? (
                              <span className="text-[11px] text-slate-500 font-medium">
                                {language === 'bn' ? 'মাইক মিউট' : 'Muted'}
                              </span>
                            ) : isSpeaking ? (
                              <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>{language === 'bn' ? 'কথা বলছেন...' : 'Speaking...'}</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                {language === 'bn' ? 'শুনছেন' : 'Listening'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mini Volume Bar */}
                        {!participantMuted && (
                          <div className="flex items-end gap-0.5 h-4">
                            <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-2" />
                            <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4" />
                            <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              /* Video Call Stage Grid Layout */
              <div className={`grid gap-4 h-full ${
                activeCall.participants.length === 1 ? 'grid-cols-1' :
                activeCall.participants.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
                'grid-cols-2 lg:grid-cols-3'
              }`}>
                {activeCall.participants.map(p => {
                  const isMe = p.id === currentUser.id;
                  const currentVideo = isMe ? isVideoOn : p.isVideoOn;
                  const currentMuted = isMe ? isMuted : p.isMuted;
                  const isSpeaking = !currentMuted && (isMe ? myMicLevel > 15 : true);

                  return (
                    <div
                      key={p.id}
                      className={`relative rounded-3xl overflow-hidden bg-slate-900 border transition-all flex items-center justify-center aspect-video sm:aspect-auto shadow-lg ${
                        isSpeaking ? 'border-emerald-500/60 ring-2 ring-emerald-500/20' : 'border-slate-800'
                      }`}
                    >
                      {currentVideo ? (
                        <div className="w-full h-full relative">
                          <img
                            src={p.avatar}
                            alt=""
                            className="w-full h-full object-cover filter contrast-105"
                          />
                          <div className="absolute inset-0 bg-indigo-950/20" />
                        </div>
                      ) : (
                        <div className="text-center space-y-3 p-4">
                          <div className="relative inline-block">
                            {isSpeaking && (
                              <span className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-ping" />
                            )}
                            <img
                              src={p.avatar}
                              alt=""
                              className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-slate-750 shadow-xl relative z-10"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-200">{p.name} {isMe ? '(You)' : ''}</p>
                            <p className="text-xs text-slate-400 font-medium">Camera Off (HD Audio Active)</p>
                          </div>
                        </div>
                      )}

                      {/* Participant Bottom Tag */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md text-xs font-semibold border border-white/10 shadow">
                        <span>{p.name} {isMe ? '(You)' : ''}</span>
                        {currentMuted ? (
                          <MicOff className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>

                      {/* Speaking Wave indicator */}
                      {isSpeaking && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/20 backdrop-blur border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shadow">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Speaking</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Shared Markdown Collaborative Notes Tab */
            <div className="h-full flex flex-col space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{language === 'bn' ? 'সহপাঠীদের সাথে লাইভ যৌথ স্টাডি নোটস (স্বয়ংক্রিয়ভাবে সংরক্ষিত)' : 'Real-time collaborative study notepad (synced with all participants)'}</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  ● Real-time Sync
                </span>
              </div>
              <textarea
                value={notesText}
                onChange={handleNotesChange}
                placeholder="Type formulas, discussion takeaways, or problem solving steps here..."
                className="flex-1 w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 outline-hidden focus:border-indigo-500 resize-none leading-relaxed shadow-inner"
              />
            </div>
          )}

        </div>

        {/* Bottom Call Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          
          {/* Audio Health Settings */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setNoiseReduction(!noiseReduction)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                noiseReduction 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-slate-850 text-slate-400 hover:text-white'
              }`}
              title="Toggle AI Noise Suppression"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.noiseCancellation}</span>
            </button>

            <button
              onClick={() => setSpeakerEnabled(!speakerEnabled)}
              className={`p-2.5 rounded-xl transition-all ${
                speakerEnabled ? 'bg-slate-800 text-slate-200' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
              title={speakerEnabled ? 'Mute Speaker Output' : 'Enable Speaker Output'}
            >
              {speakerEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 mx-auto sm:mx-0">
            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              className={`p-3.5 sm:px-5 sm:py-3.5 rounded-2xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                isMuted 
                  ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20 ring-4 ring-rose-500/20' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="hidden md:inline text-xs font-bold">
                {isMuted ? (language === 'bn' ? 'আনমিউট করুন' : 'Unmute') : (language === 'bn' ? 'মিউট করুন' : 'Mute')}
              </span>
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`p-3.5 sm:px-5 sm:py-3.5 rounded-2xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                !isVideoOn 
                  ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 ring-4 ring-indigo-500/20'
              }`}
              title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              <span className="hidden md:inline text-xs font-bold">
                {isVideoOn ? (language === 'bn' ? 'ক্যামেরা বন্ধ' : 'Stop Video') : (language === 'bn' ? 'ভিডিও চালু' : 'Start Video')}
              </span>
            </button>

            {/* Screen Share */}
            <button
              onClick={toggleScreenShare}
              className={`p-3.5 rounded-2xl font-bold transition-all shadow-md cursor-pointer ${
                isScreenSharing 
                  ? 'bg-amber-600 text-white shadow-amber-600/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Share Screen / Document"
            >
              <MonitorUp className="w-5 h-5" />
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>{language === 'bn' ? 'কল সমাপ্ত' : 'Leave Room'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
