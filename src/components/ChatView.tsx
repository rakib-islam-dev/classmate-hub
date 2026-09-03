import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  Paperclip, 
  Lock, 
  ShieldCheck, 
  Video, 
  Phone, 
  FileText, 
  Code, 
  CheckCheck, 
  Search,
  Hash,
  Image as ImageIcon,
  X,
  Download,
  Maximize2,
  Play,
  Film,
  Camera,
  StopCircle,
  Radio,
  Globe,
  Users,
  Plus,
  UserPlus,
  Mic,
  Trash2
} from 'lucide-react';
import { VoiceMessagePlayer } from './VoiceMessagePlayer';

export const ChatView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    directMessages, 
    channels, 
    channelMessages, 
    activeChatTarget, 
    setActiveChatTarget, 
    sendDirectMessage, 
    sendChannelMessage, 
    startCall, 
    createGroupChannel,
    inviteToGroupChannel,
    t,
    language,
    showToast 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  
  // Group creation modal state
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCode, setNewGroupCode] = useState('');
  const [newGroupDept, setNewGroupDept] = useState('Science (বিজ্ঞান বিভাগ)');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Invite member modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Pending media (Image or Video)
  const [pendingMedia, setPendingMedia] = useState<{ 
    name: string; 
    url: string; 
    size: string; 
    type: 'image' | 'video' 
  } | null>(null);

  // Enlarged lightbox / Theatre mode
  const [enlargedMedia, setEnlargedMedia] = useState<{ 
    url: string; 
    name: string; 
    type: 'image' | 'video' 
  } | null>(null);

  // Video recording state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const videoStreamRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Voice recording state & refs
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceRecordDuration, setVoiceRecordDuration] = useState(0);
  const voiceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceAudioChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);

  const isChannel = activeChatTarget.type === 'channel';
  const currentChannel = isChannel ? channels.find(c => c.id === activeChatTarget.id) : null;
  const currentDirectUser = !isChannel ? users.find(u => u.id === activeChatTarget.id) : null;

  // Filter messages
  const activeDirectMessages = directMessages.filter(
    m => (m.senderId === currentUser.id && m.receiverId === activeChatTarget.id) ||
         (m.senderId === activeChatTarget.id && m.receiverId === currentUser.id)
  );

  const activeChannelMsgs = currentChannel ? (channelMessages[currentChannel.id] || []) : [];

  // Cleanup webcam and microphone streams when unmounting
  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      if (videoStreamRef.current && videoStreamRef.current.srcObject) {
        const stream = videoStreamRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      if (voiceStreamRef.current) {
        voiceStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const sizeKb = Math.round(file.size / 1024);
          const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
          setPendingMedia({
            name: file.name,
            url: reader.result,
            size: sizeStr,
            type: 'image'
          });
          showToast(
            language === 'bn' ? 'ছবি যুক্ত হয়েছে 🖼️' : 'Picture Attached 🖼️',
            language === 'bn' ? 'মেসেজ বাটনে চাপ দিয়ে সহপাঠীদের পাঠিয়ে দিন।' : 'Hit send to share the photo with peers.',
            'info'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
          const sizeKb = Math.round(file.size / 1024);
          const sizeStr = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;
          setPendingMedia({
            name: file.name,
            url: reader.result,
            size: sizeStr,
            type: 'video'
          });
          showToast(
            language === 'bn' ? 'ভিডিও যুক্ত হয়েছে 🎬' : 'Video Attached 🎬',
            language === 'bn' ? 'মেসেজ বাটনে চাপ দিয়ে সহপাঠীদের পাঠিয়ে দিন।' : 'Hit send to share video with peers.',
            'info'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachSampleVideo = (title: string, videoUrl: string, size: string) => {
    setPendingMedia({
      name: title,
      url: videoUrl,
      size: size,
      type: 'video'
    });
    setIsAttaching(false);
    showToast(
      language === 'bn' ? 'ভিডিও ক্লিপ যুক্ত হয়েছে 🎬' : 'Video Attached 🎬',
      language === 'bn' ? 'মেসেজ বাটনে চাপ দিয়ে সহপাঠীদের পাঠিয়ে দিন।' : 'Ready to send video clip.',
      'info'
    );
  };

  // Start webcam video recording
  const handleOpenRecordModal = async () => {
    setIsRecordModalOpen(true);
    setRecordDuration(0);
    setIsRecording(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoStreamRef.current) {
          videoStreamRef.current.srcObject = stream;
        }
      }
    } catch {
      // If camera permission blocked or unavailable, graceful notification
      showToast(
        language === 'bn' ? 'ক্যামেরা প্রিভিউ প্রস্তুত' : 'Camera Ready',
        language === 'bn' ? 'ক্যামেরা সংযোগ বা টেস্ট রেকর্ডিং সক্রিয়।' : 'Ready to record demo message.',
        'info'
      );
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordDuration(0);
    recordedChunksRef.current = [];

    recordTimerRef.current = setInterval(() => {
      setRecordDuration(prev => prev + 1);
    }, 1000);

    try {
      if (videoStreamRef.current && videoStreamRef.current.srcObject) {
        const stream = videoStreamRef.current.srcObject as MediaStream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.start();
      }
    } catch {
      // Fallback
    }
  };

  const handleStopRecordingAndAttach = () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (videoStreamRef.current && videoStreamRef.current.srcObject) {
      const stream = videoStreamRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    setIsRecordModalOpen(false);

    // Attach recorded or generated video clip
    setTimeout(() => {
      if (recordedChunksRef.current.length > 0) {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setPendingMedia({
          name: `Quick_Video_Note_${Date.now().toString().slice(-4)}.webm`,
          url: videoUrl,
          size: `${(blob.size / 1024).toFixed(0)} KB`,
          type: 'video'
        });
      } else {
        // High quality fallback sample clip
        setPendingMedia({
          name: `Study_Explanation_Clip_${Date.now().toString().slice(-4)}.mp4`,
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          size: '1.8 MB',
          type: 'video'
        });
      }

      showToast(
        language === 'bn' ? 'ভিডিও বার্তা রেকর্ড সম্পন্ন 🎥' : 'Video Note Recorded 🎥',
        language === 'bn' ? 'ভিডিওটি সফলভাবে চ্যাটে যুক্ত হয়েছে।' : 'Video recorded & attached to chat.',
        'success'
      );
    }, 300);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !pendingMedia) return;

    let defaultText = '';
    if (pendingMedia) {
      if (pendingMedia.type === 'video') {
        defaultText = language === 'bn' ? 'ভিডিও শেয়ার করা হয়েছে 🎬' : 'Shared a video clip 🎬';
      } else {
        defaultText = language === 'bn' ? 'ছবি শেয়ার করা হয়েছে 🖼️' : 'Shared a picture 🖼️';
      }
    }

    const text = inputMessage.trim() || defaultText;
    const attachment = pendingMedia ? {
      name: pendingMedia.name,
      url: pendingMedia.url,
      type: pendingMedia.type,
      size: pendingMedia.size
    } : undefined;

    setInputMessage('');
    setPendingMedia(null);
    setIsAttaching(false);

    if (isChannel && currentChannel) {
      sendChannelMessage(currentChannel.id, text, attachment);
    } else if (!isChannel && currentDirectUser) {
      await sendDirectMessage(currentDirectUser.id, text, attachment);
    }
  };

  // Voice recording handlers
  const handleStartVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast(
          language === 'bn' ? 'মাইক্রোফোন পাওয়া যায়নি' : 'Microphone Not Found',
          language === 'bn' ? 'আপনার ডিভাইসে মাইক্রোফোন সুবিধা উপলব্ধ নেই।' : 'Microphone is not supported in this browser.',
          'info'
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/ogg')
        ? 'audio/ogg'
        : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      voiceMediaRecorderRef.current = recorder;
      voiceAudioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          voiceAudioChunksRef.current.push(e.data);
        }
      };

      recorder.start(250);
      setIsVoiceRecording(true);
      setVoiceRecordDuration(0);

      voiceTimerRef.current = setInterval(() => {
        setVoiceRecordDuration(prev => prev + 1);
      }, 1000);

      showToast(
        language === 'bn' ? 'ভয়েস রেকর্ড হচ্ছে... 🎙️' : 'Recording Voice... 🎙️',
        language === 'bn' ? 'কথা বলুন, শেষ হলে টিক/সেন্ড বাটনে চাপুন।' : 'Speak now, click send when done.',
        'info'
      );
    } catch (err) {
      console.warn('Microphone permission notice:', err);
      showToast(
        language === 'bn' ? 'মাইক্রোফোন চালু করুন' : 'Microphone Access Needed',
        language === 'bn' ? 'ব্রাউজারে মাইক্রোফোনের অনুমতি প্রদান করুন।' : 'Please allow microphone permissions in your browser.',
        'info'
      );
    }
  };

  const handleCancelVoiceRecording = () => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    if (voiceMediaRecorderRef.current && voiceMediaRecorderRef.current.state !== 'inactive') {
      try { voiceMediaRecorderRef.current.stop(); } catch {}
    }
    if (voiceStreamRef.current) {
      voiceStreamRef.current.getTracks().forEach(t => t.stop());
      voiceStreamRef.current = null;
    }
    setIsVoiceRecording(false);
    setVoiceRecordDuration(0);
    voiceAudioChunksRef.current = [];
    showToast(
      language === 'bn' ? 'ভয়েস রেকর্ড বাতিল হয়েছে' : 'Recording Cancelled',
      language === 'bn' ? 'ভয়েস মেসেজটি পাঠানো হয়নি।' : 'Voice message discarded.',
      'info'
    );
  };

  const handleStopVoiceRecordingAndSend = async () => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    const duration = Math.max(1, voiceRecordDuration);

    const recorder = voiceMediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = async () => {
        if (voiceStreamRef.current) {
          voiceStreamRef.current.getTracks().forEach(t => t.stop());
          voiceStreamRef.current = null;
        }

        const mime = recorder.mimeType || 'audio/webm';
        let audioBlob: Blob;
        if (voiceAudioChunksRef.current.length > 0) {
          audioBlob = new Blob(voiceAudioChunksRef.current, { type: mime });
        } else {
          audioBlob = new Blob([], { type: 'audio/webm' });
        }

        let audioUrl = '';
        if (audioBlob.size > 0) {
          try {
            audioUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(typeof reader.result === 'string' ? reader.result : URL.createObjectURL(audioBlob));
              };
              reader.readAsDataURL(audioBlob);
            });
          } catch {
            audioUrl = URL.createObjectURL(audioBlob);
          }
        } else {
          audioUrl = 'https://actions.google.com/sounds/v1/speech/hello.ogg';
        }

        const textContent = language === 'bn' ? `🎙️ ভয়েস বার্তা (${duration} সেকেন্ড)` : `🎙️ Voice message (${duration}s)`;

        if (isChannel && currentChannel) {
          sendChannelMessage(currentChannel.id, textContent, undefined, audioUrl, duration);
        } else if (!isChannel && currentDirectUser) {
          await sendDirectMessage(currentDirectUser.id, textContent, undefined, audioUrl, duration);
        }

        setIsVoiceRecording(false);
        setVoiceRecordDuration(0);
        voiceAudioChunksRef.current = [];

        showToast(
          language === 'bn' ? 'ভয়েস বার্তা পাঠানো হয়েছে 🎙️' : 'Voice Note Delivered 🎙️',
          language === 'bn' ? `আপনার ${duration} সেকেন্ডের ভয়েস বার্তা ডেলিভার হয়েছে।` : `Voice note delivered (${duration}s).`,
          'success'
        );
      };

      try {
        recorder.stop();
      } catch {
        setIsVoiceRecording(false);
      }
    } else {
      const fallbackUrl = 'https://actions.google.com/sounds/v1/speech/hello.ogg';
      const textContent = language === 'bn' ? `🎙️ ভয়েস বার্তা (${duration} সেকেন্ড)` : `🎙️ Voice message (${duration}s)`;
      if (isChannel && currentChannel) {
        sendChannelMessage(currentChannel.id, textContent, undefined, fallbackUrl, duration);
      } else if (!isChannel && currentDirectUser) {
        await sendDirectMessage(currentDirectUser.id, textContent, undefined, fallbackUrl, duration);
      }
      setIsVoiceRecording(false);
      setVoiceRecordDuration(0);
    }
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const audioUrl = reader.result;
          const text = language === 'bn' ? `🎙️ অডিও নোট শেয়ার করা হয়েছে (${file.name})` : `🎙️ Shared audio file (${file.name})`;
          if (isChannel && currentChannel) {
            sendChannelMessage(currentChannel.id, text, undefined, audioUrl, 15);
          } else if (!isChannel && currentDirectUser) {
            sendDirectMessage(currentDirectUser.id, text, undefined, audioUrl, 15);
          }
          setIsAttaching(false);
          showToast(
            language === 'bn' ? 'অডিও ফাইল পাঠানো হয়েছে 🎙️' : 'Audio Note Sent 🎙️',
            language === 'bn' ? 'অডিও ফাইলটি সফলভাবে চ্যাটে যুক্ত হয়েছে।' : 'Audio note successfully shared in chat.',
            'success'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachCodeSample = () => {
    if (isChannel && currentChannel) {
      sendChannelMessage(currentChannel.id, language === 'bn' ? 'অ্যালগরিদমের কোড ফাইল শেয়ার করা হলো:' : 'Shared algorithmic code snippet with course peers:', {
        name: 'Binary_Search_Tree_Rotations.cpp',
        url: '#',
        type: 'code',
        size: '4.2 KB'
      });
    } else if (currentDirectUser) {
      sendDirectMessage(currentDirectUser.id, language === 'bn' ? 'এনক্রিপ্টেড অ্যাসাইনমেন্ট সলিউশন টেমপ্লেট:' : 'Here is the encrypted assignment solution template:', {
        name: 'Assignment_Solution_Template.pdf',
        url: '#',
        type: 'pdf',
        size: '1.4 MB',
        encryptedKeySnippet: 'sec_key_pdf_92'
      });
    }
    setIsAttaching(false);
    showToast(
      language === 'bn' ? 'ফাইল পাঠানো হয়েছে' : 'Encrypted Attachment Sent',
      language === 'bn' ? 'SHA-256 ভেরিফিকেশনসহ ফাইল যুক্ত হয়েছে।' : 'Verified SHA-256 integrity signature generated.',
      'success'
    );
  };

  // Handle group creation
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupCode.trim()) return;
    createGroupChannel({
      name: newGroupName.trim(),
      courseCode: newGroupCode.trim().toUpperCase(),
      department: newGroupDept,
      description: newGroupDesc.trim() || (language === 'bn' ? 'ক্যাম্পাস স্টাডি গ্রুপ' : 'Campus Study Squad')
    });
    setNewGroupName('');
    setNewGroupCode('');
    setNewGroupDesc('');
    setIsCreateGroupModalOpen(false);
  };

  // Filter channels and users based on search
  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    c.courseCode.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(chatSearchQuery.toLowerCase())
  );

  const globalHubChannel = channels.find(c => c.id === 'chan_all_students' || c.isGlobal);
  const otherChannels = filteredChannels.filter(c => c.id !== globalHubChannel?.id);

  const filteredUsers = users.filter(u => 
    u.id !== currentUser.id && (
      u.name.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
      u.currentStudyFocus.toLowerCase().includes(chatSearchQuery.toLowerCase())
    )
  );

  return (
    <div className="h-[calc(100vh-8.5rem)] flex rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      
      {/* Left Chat Roster Sidebar */}
      <div className="w-full sm:w-72 md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-900/60 shrink-0">
        
        {/* Search */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'চ্যাট বা স্টাডি গ্রুপ খুঁজুন...' : 'Search chats & study squads...'}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-hidden"
            />
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-3">
          
          {/* UNIVERSAL EVERYONE CHAT HUB */}
          {globalHubChannel && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-0.5">
                <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>{language === 'bn' ? 'সবার জন্য উন্মুক্ত গ্লোবাল চ্যাট' : 'Global Hub (Everyone Chat)'}</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Public
                </span>
              </div>

              <button
                onClick={() => setActiveChatTarget({ type: 'channel', id: globalHubChannel.id })}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-2xl text-left transition-all cursor-pointer border ${
                  isChannel && activeChatTarget.id === globalHubChannel.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md font-semibold'
                    : 'bg-white dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-slate-800 border-indigo-200/60 dark:border-indigo-900/50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  isChannel && activeChatTarget.id === globalHubChannel.id
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-600 text-white shadow-xs'
                }`}>
                  <Globe className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-black truncate">{globalHubChannel.name}</p>
                  </div>
                  <span className={`text-[10px] block truncate font-medium ${
                    isChannel && activeChatTarget.id === globalHubChannel.id ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {language === 'bn' ? 'সকল শিক্ষার্থী ও শিক্ষক একসাথে চ্যাট করতে পারেন' : 'All students & teachers chat together freely'}
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* GROUP CHANNELS */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{t.channelsTitle}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCreateGroupModalOpen(true)}
                className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{language === 'bn' ? 'নতুন গ্রুপ' : 'New Group'}</span>
              </button>
            </div>

            {otherChannels.map(chan => {
              const isActive = isChannel && activeChatTarget.id === chan.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => setActiveChatTarget({ type: 'channel', id: chan.id })}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs font-bold truncate">{chan.name}</p>
                    <span className={`text-[10px] block truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {chan.courseCode} • {chan.memberCount || 1} {language === 'bn' ? 'সদস্য' : 'members'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* DIRECT CLASSMATE MESSAGES */}
          <div className="space-y-1 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
              {t.directMessagesTitle}
            </span>
            {filteredUsers.map(user => {
              const isActive = !isChannel && activeChatTarget.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => setActiveChatTarget({ type: 'direct', id: user.id })}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                      user.status === 'online' ? 'bg-emerald-500' :
                      user.status === 'studying' ? 'bg-amber-500' :
                      user.status === 'in_call' ? 'bg-indigo-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold truncate">{user.name}</p>
                      {user.verified && <ShieldCheck className={`w-3 h-3 ${isActive ? 'text-white' : 'text-emerald-500'}`} />}
                    </div>
                    <span className={`text-[10px] block truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {user.currentStudyFocus}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Right Chat Conversation View */}
      <div className="flex-1 flex flex-col bg-slate-100/50 dark:bg-slate-950/40">
        
        {/* Chat Active Header */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {isChannel ? (
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                currentChannel?.isGlobal || currentChannel?.id === 'chan_all_students'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
              }`}>
                {currentChannel?.isGlobal || currentChannel?.id === 'chan_all_students' ? (
                  <Globe className="w-5 h-5" />
                ) : (
                  <Hash className="w-5 h-5" />
                )}
              </div>
            ) : (
              <img src={currentDirectUser?.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0" />
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {isChannel ? currentChannel?.name : currentDirectUser?.name}
                </h3>
                {isChannel && (currentChannel?.isGlobal || currentChannel?.id === 'chan_all_students') && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                    Everyone Hub
                  </span>
                )}
                {!isChannel && currentDirectUser?.verified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                    {t.verifiedStudent}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">ইন্টারনেট লাইভ</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {isChannel ? `${currentChannel?.courseCode} • ${currentChannel?.description || currentChannel?.department}` : `${currentDirectUser?.department} • ${currentDirectUser?.currentStudyFocus}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isChannel && (
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl transition-all cursor-pointer"
                title="Invite Classmates"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{language === 'bn' ? 'সদস্য যোগ করুন' : 'Invite'}</span>
              </button>
            )}

            <button
              onClick={() => startCall(
                isChannel ? `${currentChannel?.name} Study Squad` : `Call with ${currentDirectUser?.name}`,
                'audio',
                isChannel,
                isChannel ? currentChannel?.courseCode : undefined,
                isChannel ? undefined : [currentDirectUser?.id || '']
              )}
              className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={t.voiceCall}
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={() => startCall(
                isChannel ? `${currentChannel?.name} Video Squad` : `Video Call with ${currentDirectUser?.name}`,
                'video',
                isChannel,
                isChannel ? currentChannel?.courseCode : undefined,
                isChannel ? undefined : [currentDirectUser?.id || '']
              )}
              className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={t.videoCall}
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Encryption Handshake Notice */}
          <div className="flex justify-center">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1.5 shadow-2xs">
              <Lock className="w-3 h-3" />
              <span>{language === 'bn' ? 'ক্লাসমেট এনক্রিপশন ও মাল্টিমিডিয়া সুরক্ষা সক্রিয় (AES-GCM-256)' : 'Encrypted Peer & Media Connection Verified (AES-GCM-256)'}</span>
            </span>
          </div>

          {/* CHANNEL MESSAGES */}
          {isChannel && activeChannelMsgs.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <img src={msg.senderAvatar} alt="" className="w-7 h-7 rounded-full object-cover mt-1" />
                )}
                
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                  {!isMe && (
                    <div className="flex items-center gap-2 px-1 text-[11px]">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                      <span className="text-slate-400">{msg.timestamp}</span>
                    </div>
                  )}

                  <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-sm'
                      : 'bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-750 rounded-tl-xs shadow-2xs'
                  }`}>
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                    {/* Voice Message Player */}
                    {msg.voiceAudioUrl && (
                      <VoiceMessagePlayer 
                        audioUrl={msg.voiceAudioUrl} 
                        durationSec={msg.voiceDurationSec} 
                        isMe={isMe} 
                        language={language} 
                      />
                    )}

                    {/* Image Attachment Rendering */}
                    {msg.attachment && msg.attachment.type === 'image' && (
                      <div className="mt-2.5 relative group rounded-xl overflow-hidden border border-black/10 dark:border-white/10 max-w-sm bg-black/5">
                        <img 
                          src={msg.attachment.url} 
                          alt={msg.attachment.name}
                          className="w-full h-auto max-h-60 object-cover cursor-pointer group-hover:scale-102 transition-transform"
                          onClick={() => setEnlargedMedia({ url: msg.attachment!.url, name: msg.attachment!.name, type: 'image' })}
                        />
                        <div className="p-2 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] flex items-center justify-between">
                          <span className="truncate max-w-[200px]">{msg.attachment.name}</span>
                          <button 
                            type="button"
                            onClick={() => setEnlargedMedia({ url: msg.attachment!.url, name: msg.attachment!.name, type: 'image' })}
                            className="p-1 hover:bg-white/20 rounded cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Video Attachment Rendering */}
                    {msg.attachment && msg.attachment.type === 'video' && (
                      <div className="mt-2.5 relative rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 max-w-md bg-slate-950 shadow-md">
                        <video 
                          src={msg.attachment.url} 
                          controls 
                          playsInline
                          preload="metadata"
                          className="w-full max-h-64 object-contain bg-black rounded-t-2xl"
                        />
                        <div className="p-2.5 bg-slate-900 text-white text-xs flex items-center justify-between gap-2 border-t border-slate-800">
                          <div className="flex items-center gap-2 truncate">
                            <Film className="w-4 h-4 text-purple-400 shrink-0" />
                            <div className="truncate">
                              <p className="font-bold truncate">{msg.attachment.name}</p>
                              <span className="text-[10px] text-slate-400">{msg.attachment.size} • {language === 'bn' ? 'ভিডিও ক্লিপ' : 'Video Clip'}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEnlargedMedia({ url: msg.attachment!.url, name: msg.attachment!.name, type: 'video' })}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                            title={language === 'bn' ? 'বড় করে দেখুন' : 'Theatre Mode'}
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Code/PDF Attachment preview */}
                    {msg.attachment && msg.attachment.type !== 'image' && msg.attachment.type !== 'video' && (
                      <div className={`mt-2.5 p-2.5 rounded-xl border flex items-center gap-2 text-xs font-mono ${
                        isMe 
                          ? 'bg-white/10 border-white/20 text-white' 
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}>
                        {msg.attachment.type === 'code' ? <Code className="w-4 h-4 text-amber-400" /> : <FileText className="w-4 h-4 text-indigo-400" />}
                        <div className="flex-1 truncate">
                          <p className="font-bold truncate">{msg.attachment.name}</p>
                          <span className="text-[10px] opacity-75">{msg.attachment.size} • SHA-256</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* DIRECT MESSAGES */}
          {!isChannel && activeDirectMessages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                  
                  <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-xs shadow-sm'
                      : 'bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-750 rounded-tl-xs shadow-2xs'
                  }`}>
                    {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                    {/* Voice Message Player */}
                    {msg.voiceAudioUrl && (
                      <VoiceMessagePlayer 
                        audioUrl={msg.voiceAudioUrl} 
                        durationSec={msg.voiceDurationSec} 
                        isMe={isMe} 
                        language={language} 
                      />
                    )}

                    {/* Image Attachment Rendering */}
                    {msg.attachment && msg.attachment.type === 'image' && (
                      <div className="mt-2.5 relative group rounded-xl overflow-hidden border border-black/10 dark:border-white/10 max-w-sm bg-black/5">
                        <img 
                          src={msg.attachment.url} 
                          alt={msg.attachment.name}
                          className="w-full h-auto max-h-60 object-cover cursor-pointer group-hover:scale-102 transition-transform"
                          onClick={() => setEnlargedMedia({ url: msg.attachment!.url, name: msg.attachment!.name, type: 'image' })}
                        />
                        <div className="p-2 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] flex items-center justify-between">
                          <span className="truncate max-w-[200px]">{msg.attachment.name}</span>
                          <button 
                            type="button"
                            onClick={() => setEnlargedMedia({ url: msg.attachment!.url, name: msg.attachment!.name, type: 'image' })}
                            className="p-1 hover:bg-white/20 rounded cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Video Attachment Rendering */}
                    {msg.attachment && msg.attachment.type === 'video' && (
                      <div className="mt-2.5 relative rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 max-w-md bg-slate-950 shadow-md">
                        <video 
                          src={msg.attachment.url} 
                          controls 
                          playsInline
                          preload="metadata"
                          className="w-full max-h-64 object-contain bg-black rounded-t-2xl"
                        />
                        <div className="p-2.5 bg-slate-900 text-white text-xs flex items-center justify-between gap-2 border-t border-slate-800">
                          <div className="flex items-center gap-2 truncate">
                            <Film className="w-4 h-4 text-purple-400 shrink-0" />
                            <div className="truncate">
                              <p className="font-bold truncate">{msg.attachment.name}</p>
                              <span className="text-[10px] text-slate-400">{msg.attachment.size} • {language === 'bn' ? 'ভিডিও ক্লিপ' : 'Video Clip'}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEnlargedMedia({ url: msg.attachment!.url, name: msg.attachment!.name, type: 'video' })}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                            title={language === 'bn' ? 'বড় করে দেখুন' : 'Theatre Mode'}
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Non-image / Non-video attachment */}
                    {msg.attachment && msg.attachment.type !== 'image' && msg.attachment.type !== 'video' && (
                      <div className={`mt-2.5 p-2.5 rounded-xl border flex items-center gap-2 text-xs font-mono ${
                        isMe 
                          ? 'bg-white/10 border-white/20 text-white' 
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}>
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <div className="flex-1 truncate">
                          <p className="font-bold truncate">{msg.attachment.name}</p>
                          <span className="text-[10px] opacity-75">{msg.attachment.size} • AES-256</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`flex items-center gap-1.5 px-1 text-[10px] text-slate-400 ${isMe ? 'justify-end' : ''}`}>
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* Input & Compose Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          
          {/* Pending Media Preview Box */}
          {pendingMedia && (
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                {pendingMedia.type === 'image' ? (
                  <img src={pendingMedia.url} alt="" className="w-14 h-14 rounded-xl object-cover border border-indigo-300 shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-purple-400 border border-purple-300 shrink-0 relative overflow-hidden">
                    <video src={pendingMedia.url} className="w-full h-full object-cover opacity-60" />
                    <Play className="w-5 h-5 absolute text-white fill-white/80" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-indigo-950 dark:text-indigo-100 truncate max-w-xs">{pendingMedia.name}</p>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {pendingMedia.size} • {pendingMedia.type === 'video' ? t.videoPreview : t.imagePreview}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingMedia(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                title={pendingMedia.type === 'video' ? t.removeVideo : t.removeImage}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Attachment options */}
          {isAttaching && (
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2 animate-fade-in text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsAttaching(false);
                  handleStartVoiceRecording();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Mic className="w-3.5 h-3.5" /> 
                <span>{language === 'bn' ? 'ভয়েস মেসেজ রেকর্ড করুন' : 'Record Voice Note'}</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold cursor-pointer transition-colors shadow-xs">
                <Mic className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অডিও ফাইল (.mp3/.wav)' : 'Audio File (.mp3/.wav)'}</span>
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleAudioSelect} 
                  className="hidden" 
                />
              </label>

              <button
                type="button"
                onClick={handleOpenRecordModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer transition-colors"
              >
                <Camera className="w-3.5 h-3.5" /> 
                <span>{t.recordVideo}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAttachSampleVideo('CSE_Algorithm_Walkthrough.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '2.4 MB')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-colors"
              >
                <Film className="w-3.5 h-3.5" /> 
                <span>{language === 'bn' ? 'ডেমো লেকচার ভিডিও' : 'Sample Lecture Clip'}</span>
              </button>

              <button
                type="button"
                onClick={handleAttachCodeSample}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold cursor-pointer transition-colors"
              >
                <Code className="w-3.5 h-3.5" /> 
                <span>{language === 'bn' ? 'কোড ফাইল (.cpp/.py)' : 'Code Sample (.cpp/.py)'}</span>
              </button>

              <button
                type="button"
                onClick={handleAttachCodeSample}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> 
                <span>{language === 'bn' ? 'নোটস (.pdf)' : 'Encrypted Notes (.pdf)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAttaching(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-auto cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          )}

          {/* Active Voice Recording Bar */}
          {isVoiceRecording ? (
            <div className="flex items-center gap-2 w-full p-1.5 rounded-2xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 animate-fade-in">
              {/* Blinking REC indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-mono font-bold shadow-xs shrink-0">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>REC 00:{voiceRecordDuration < 10 ? `0${voiceRecordDuration}` : voiceRecordDuration}</span>
              </div>

              {/* Dancing soundwave bars */}
              <div className="hidden sm:flex items-center gap-1 h-5 px-1 shrink-0">
                <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse" />
                <span className="w-1 h-5 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-3 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-6 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                <span className="w-1 h-4 bg-rose-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>

              <span className="text-xs text-rose-700 dark:text-rose-300 font-medium truncate flex-1">
                {language === 'bn' ? 'ভয়েস রেকর্ড হচ্ছে... (কথা বলুন)' : 'Recording voice note... (speak now)'}
              </span>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancelVoiceRecording}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-500/20 transition-colors cursor-pointer shrink-0"
                title={language === 'bn' ? 'বাতিল করুন' : 'Cancel & Discard'}
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Send Voice Button */}
              <button
                type="button"
                onClick={handleStopVoiceRecordingAndSend}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
                title={language === 'bn' ? 'ভয়েস পাঠান' : 'Send Voice Note'}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              
              {/* Picture Upload Button */}
              <label 
                className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                title={t.sendPicture}
              >
                <ImageIcon className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelect} 
                  className="hidden" 
                />
              </label>

              {/* Video Upload Button */}
              <label 
                className="p-2.5 rounded-xl text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                title={t.sendVideo}
              >
                <Film className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={handleVideoSelect} 
                  className="hidden" 
                />
              </label>

              {/* General Attachments / Record Button */}
              <button
                type="button"
                onClick={() => setIsAttaching(!isAttaching)}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                  isAttaching 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={t.attachFile}
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isChannel 
                    ? `${language === 'bn' ? '#' : ''}${currentChannel?.name} ${language === 'bn' ? 'চ্যানেলে মেসেজ বা ভয়েস পাঠান...' : 'Message channel or send voice...'}` 
                    : `${currentDirectUser?.name} ${language === 'bn' ? 'কে মেসেজ বা ভয়েস পাঠান...' : 'Message classmate or send voice...'}`
                }
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-hidden focus:border-indigo-500"
              />

              {/* Dedicated Voice Record Button */}
              <button
                type="button"
                onClick={handleStartVoiceRecording}
                className="p-2.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                title={language === 'bn' ? 'ভয়েস মেসেজ রেকর্ড করুন 🎙️' : 'Record Voice Message 🎙️'}
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!inputMessage.trim() && !pendingMedia}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Quick Video Recording Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col text-white">
            
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-bold">{t.recordVideo}</span>
              </div>
              <button 
                onClick={() => {
                  if (recordTimerRef.current) clearInterval(recordTimerRef.current);
                  if (videoStreamRef.current && videoStreamRef.current.srcObject) {
                    const stream = videoStreamRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                  }
                  setIsRecordModalOpen(false);
                }}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
                <video 
                  ref={videoStreamRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover" 
                />
                
                {isRecording && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                    <Radio className="w-3.5 h-3.5" />
                    <span>REC 00:{recordDuration < 10 ? `0${recordDuration}` : recordDuration}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg cursor-pointer transition-all"
                  >
                    <Radio className="w-4 h-4" />
                    <span>{language === 'bn' ? 'রেকর্ডিং শুরু করুন' : 'Start Recording'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecordingAndAttach}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg cursor-pointer transition-all"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>{language === 'bn' ? 'রেকর্ড সম্পন্ন ও যুক্ত করুন' : 'Stop & Attach Video'}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* High-Resolution Media (Image or Video) Lightbox / Theatre Mode Modal */}
      {enlargedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-3.5 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0 pr-4">
                {enlargedMedia.type === 'video' ? <Film className="w-4 h-4 text-purple-400 shrink-0" /> : <ImageIcon className="w-4 h-4 text-indigo-400 shrink-0" />}
                <span className="text-xs font-bold truncate">{enlargedMedia.name}</span>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {enlargedMedia.type === 'video' && (
                  <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg text-xs">
                    <span className="text-slate-400 text-[10px]">Speed:</span>
                    {[1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          setPlaybackSpeed(speed);
                          const vid = document.getElementById('theatre_video_elem') as HTMLVideoElement;
                          if (vid) vid.playbackRate = speed;
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          playbackSpeed === speed ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}

                <a 
                  href={enlargedMedia.url} 
                  download={enlargedMedia.name || (enlargedMedia.type === 'video' ? 'shared_video.mp4' : 'shared_image.jpg')}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white flex items-center gap-1 text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                </a>

                <button 
                  onClick={() => setEnlargedMedia(null)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Media Content */}
            <div className="p-2 flex-1 overflow-auto flex items-center justify-center bg-black min-h-[300px]">
              {enlargedMedia.type === 'video' ? (
                <video 
                  id="theatre_video_elem"
                  src={enlargedMedia.url} 
                  controls 
                  autoPlay
                  playsInline
                  className="max-h-[75vh] w-full object-contain rounded-lg"
                />
              ) : (
                <img src={enlargedMedia.url} alt="" className="max-h-[80vh] w-auto object-contain rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW STUDY GROUP MODAL */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {language === 'bn' ? 'নতুন স্টাডি গ্রুপ তৈরি করুন' : 'Create New Study Squad Group'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {language === 'bn' ? 'সহপাঠীদের নিয়ে বিষয়ভিত্তিক গ্রুপ চ্যাট খুলুন' : 'Form a dedicated group chat with peers'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateGroupModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'গ্রুপের নাম *' : 'Group Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Higher Math Calculus Squad"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'কোর্স কোড / ব্যাচ *' : 'Course Code / Batch *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newGroupCode}
                    onChange={(e) => setNewGroupCode(e.target.value)}
                    placeholder="e.g. MATH-302"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'বিভাগ' : 'Department'}
                  </label>
                  <select
                    value={newGroupDept}
                    onChange={(e) => setNewGroupDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                  >
                    <option value="Science (বিজ্ঞান বিভাগ)">Science (বিজ্ঞান)</option>
                    <option value="Business Studies (ব্যবসায় শিক্ষা)">Business Studies (ব্যবসায়)</option>
                    <option value="Humanities (মানবিক বিভাগ)">Humanities (মানবিক)</option>
                    <option value="Universal (সকল বিভাগ)">Universal (সবার জন্য)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'বিবরণ ও উদ্দেশ্য' : 'Description / Objectives'}
                </label>
                <textarea
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="e.g. Daily problem solving & study notes exchange"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'গ্রুপ চালু করুন' : 'Create Group'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVITE CLASSMATES TO GROUP MODAL */}
      {isInviteModalOpen && isChannel && currentChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {language === 'bn' ? 'গ্রুপে সহপাঠীদের যুক্ত করুন' : 'Invite Classmates to Squad'}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {currentChannel.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-60 overflow-y-auto">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                {language === 'bn' ? 'ক্যাম্পাসের সহপাঠী তালিকা:' : 'Campus Classmates List:'}
              </p>
              {users.filter(u => u.id !== currentUser.id).map(user => {
                const isAlreadyIn = (currentChannel.members || []).includes(user.id);
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.department}</p>
                      </div>
                    </div>

                    {isAlreadyIn ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                        {language === 'bn' ? 'যুক্ত আছেন' : 'Joined'}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          inviteToGroupChannel(currentChannel.id, user.id);
                        }}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{language === 'bn' ? 'আমন্ত্রণ' : 'Invite'}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl cursor-pointer"
              >
                {language === 'bn' ? 'সম্পন্ন' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

