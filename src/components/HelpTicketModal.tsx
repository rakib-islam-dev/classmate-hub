import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpTicket } from '../types';
import { 
  HelpCircle, 
  X, 
  Send, 
  Mic, 
  Square, 
  ShieldCheck, 
  CheckCircle2,
  KeyRound,
  User as UserIcon,
  Mail
} from 'lucide-react';

export const HelpTicketModal: React.FC = () => {
  const { 
    isHelpModalOpen, 
    setIsHelpModalOpen, 
    currentUser, 
    users,
    helpTickets, 
    submitHelpTicket, 
    resolveHelpTicket, 
    adminResetUserPassword,
    resetPassword,
    isAdmin, 
    language,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'create' | 'my_tickets' | 'admin_inbox'>('create');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [requesterName, setRequesterName] = useState(currentUser?.name && currentUser.name !== 'Rakibul Islam (Cadet)' ? currentUser.name : '');
  const [requesterContact, setRequesterContact] = useState(currentUser?.email && currentUser.email !== 'rakibulislamq1673@gmail.com' ? currentUser.email : '');
  const [category, setCategory] = useState<HelpTicket['category']>('password_reset');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | undefined>(undefined);
  const [adminReplyText, setAdminReplyText] = useState<{ [id: string]: string }>({});

  if (!isHelpModalOpen) return null;

  const handleRecordVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast(language === 'bn' ? 'ভয়েস রেকর্ড হচ্ছে... 🎤' : 'Recording voice...', 'Speak your problem clearly', 'info');
      setTimeout(() => {
        setIsRecording(false);
        setVoiceAudioUrl('https://actions.google.com/sounds/v1/speech/hello.ogg');
        showToast(language === 'bn' ? 'ভয়েস মেসেজ যুক্ত হয়েছে 🎵' : 'Voice attached 🎵', 'Voice recorded successfully', 'success');
      }, 3000);
    } else {
      setIsRecording(false);
      setVoiceAudioUrl('https://actions.google.com/sounds/v1/speech/hello.ogg');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSubject = subject.trim() || (category === 'password_reset' 
      ? (language === 'bn' ? '🔑 পাসওয়ার্ড রিসেট ও সহায়তা রিকোয়েস্ট' : 'Password Reset Request') 
      : (language === 'bn' ? 'ক্যাম্পাস হেল্প টিকিট' : 'General Help Ticket'));

    if (!message.trim() && !voiceAudioUrl) {
      showToast('Error', language === 'bn' ? 'অনুগ্রহ করে সমস্যার বিবরণ লিখুন।' : 'Please provide description of the issue.', 'info');
      return;
    }

    const contactStr = requesterContact.trim() ? `[Contact: ${requesterContact.trim()}] ` : '';
    const fullMsg = `${contactStr}${message.trim()}`;

    submitHelpTicket(
      finalSubject, 
      fullMsg, 
      category, 
      voiceAudioUrl, 
      {
        name: requesterName.trim() || currentUser.name,
        email: requesterContact.trim() || currentUser.email,
        userId: currentUser.id
      }
    );

    setSubject('');
    setMessage('');
    setVoiceAudioUrl(undefined);
    setActiveTab('my_tickets');
  };

  const myTickets = helpTickets.filter(t => 
    t.userId === currentUser.id || 
    (requesterContact && t.userEmail && t.userEmail.toLowerCase() === requesterContact.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'হেল্প ডেস্ক ও পাসওয়ার্ড সহায়তা' : 'Support Desk & Password Recovery'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'অ্যাডমিনকে সরাসরি জানান, খুব দ্রুত সমাধান করা হবে' : 'Submit ticket directly to batch admins'}
              </p>
            </div>
          </div>

          <button onClick={() => setIsHelpModalOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-white dark:bg-slate-900 text-cyan-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            {language === 'bn' ? 'নতুন টিকিট জমা দিন' : 'Submit Ticket'}
          </button>
          <button
            onClick={() => setActiveTab('my_tickets')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'my_tickets' ? 'bg-white dark:bg-slate-900 text-cyan-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            {language === 'bn' ? 'আমার টিকিটসমূহ' : 'My Tickets'} ({myTickets.length})
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin_inbox')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'admin_inbox' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              Admin Inbox ({helpTickets.length})
            </button>
          )}
        </div>

        {/* Create Ticket View */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'bn' ? 'সমস্যার ধরণ (Category)' : 'Category'}
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                <option value="password_reset">{language === 'bn' ? '🔑 পাসওয়ার্ড ভুলে গেছি / নতুন পাসওয়ার্ড দরকার' : 'Password Reset / Recovery'}</option>
                <option value="account_access">{language === 'bn' ? '🔒 অ্যাকাউন্টে ঢুকতে পারছি না' : 'Account Access Issue'}</option>
                <option value="drive_issue">{language === 'bn' ? '📁 ড্রাইভ বা ফাইল সম্পর্কিত সমস্যা' : 'Drive / File Storage Issue'}</option>
                <option value="general_help">{language === 'bn' ? '💡 অন্যান্য সাহায্য বা পরামর্শ' : 'General Assistance / Feedback'}</option>
              </select>
            </div>

            {/* Requester Identity Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'আপনার নাম / শিক্ষার্থীর নাম *' : 'Student Name *'}
                </label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={requesterName}
                    onChange={e => setRequesterName(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: Rakibul Islam' : 'e.g. Rakibul Islam'}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'ইমেইল / ইউজারনেম / ফোন নম্বর *' : 'Email / Username / Phone *'}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={requesterContact}
                    onChange={e => setRequesterContact(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: student@gmail.com বা মোবাইল নম্বর' : 'e.g. student@gmail.com or phone'}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'bn' ? 'বিষয় / সারসংক্ষেপ *' : 'Subject *'}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: আমার পাসওয়ার্ড ভুলে গেছি, রিসেট করে দিন' : 'e.g. Forgot my password, please reset'}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'bn' ? 'বিস্তারিত বর্ণনা (বা ভয়েস মেসেজ দিন)' : 'Detailed Description'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={language === 'bn' ? 'আপনার ইউজারনেম, ইমেইল ও সমস্যার বিবরণ লিখুন...' : 'Provide your details and issue...'}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Voice Message Recorder for Quick Help */}
            <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/50 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-cyan-900 dark:text-cyan-200 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ভয়েস মেসেজ রেকর্ড করুন' : 'Record Voice Note'}</span>
                </span>
                <p className="text-[10px] text-slate-500">
                  {voiceAudioUrl ? (language === 'bn' ? '✅ ভয়েস নোট যুক্ত হয়েছে' : 'Voice note attached') : (language === 'bn' ? 'লিখতে কষ্ট হলে সরাসরি মুখে বলে টিকিট পাঠান' : 'Speak your issue directly')}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRecordVoice}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : voiceAudioUrl 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
              >
                {isRecording ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Recording...' : voiceAudioUrl ? 'Re-record' : 'Record Voice'}</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'bn' ? 'টিকিট সাবমিট করুন' : 'Submit Ticket'}</span>
              </button>
            </div>
          </form>
        )}

        {/* My Tickets View */}
        {activeTab === 'my_tickets' && (
          <div className="space-y-3">
            {myTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-xs">You have no active support tickets.</p>
              </div>
            ) : (
              myTickets.map(ticket => (
                <div key={ticket.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ticket.status.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ticket.subject}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{ticket.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{ticket.message}</p>

                  {ticket.adminReply && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                      <span className="font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Admin Reply:
                      </span>
                      <p>{ticket.adminReply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Admin Inbox View */}
        {activeTab === 'admin_inbox' && isAdmin && (
          <div className="space-y-3">
            {helpTickets.map(ticket => (
              <div key={ticket.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={ticket.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ticket.userName}</span>
                      <span className="text-[10px] text-slate-400 block">{ticket.userEmail}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ticket.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ticket.subject}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{ticket.message}</p>
                </div>

                {/* Resolve Box & One-Click Password Reset */}
                {ticket.status === 'open' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {ticket.category === 'password_reset' && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                        <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'পাসওয়ার্ড রিসেট রিকোয়েস্ট' : 'Password Reset Ticket'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            const target = users.find(u => 
                              u.id === ticket.userId ||
                              (ticket.userEmail && u.email.toLowerCase() === ticket.userEmail.toLowerCase()) ||
                              (ticket.message && ticket.message.toLowerCase().includes(u.email.toLowerCase())) ||
                              u.name.toLowerCase() === ticket.userName.toLowerCase()
                            );
                            if (target) {
                              await adminResetUserPassword(target.id);
                            } else {
                              const emailCandidate = ticket.userEmail || (ticket.message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0]);
                              if (emailCandidate) {
                                await resetPassword(emailCandidate);
                                resolveHelpTicket(
                                  ticket.id, 
                                  language === 'bn' 
                                    ? `অ্যাডমিন কর্তৃক Firebase Auth পাসওয়ার্ড রিসেট রিকোয়েস্ট অনুমোদিত হয়েছে। ${emailCandidate} ঠিকানায় অফিসিয়াল পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।` 
                                    : `Admin processed your request. Official Firebase Authentication password reset link dispatched to ${emailCandidate}.`
                                );
                              } else {
                                resolveHelpTicket(
                                  ticket.id, 
                                  language === 'bn' 
                                    ? 'আপনার একাউন্টের সঠিক ইমেইল পাওয়া যায়নি। অনুগ্রহ করে নিবন্ধিত ইমেইল প্রদান করুন।' 
                                    : 'No registered email found. Please provide your registered account email.'
                                );
                              }
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-transform active:scale-95"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span>{language === 'bn' ? 'রিসেট লিংক পাঠান' : 'Send Reset Link'}</span>
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={adminReplyText[ticket.id] || ''}
                        onChange={e => setAdminReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                        placeholder={language === 'bn' ? 'অ্যাডমিন রিপ্লাই বা সমাধান লিখুন...' : 'Write resolution reply or custom password...'}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                      <button
                        onClick={() => resolveHelpTicket(ticket.id, adminReplyText[ticket.id])}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                      >
                        {language === 'bn' ? 'সমাধান করুন' : 'Resolve'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
