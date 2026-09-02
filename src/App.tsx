import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WelcomeView } from './components/WelcomeView';
import { PersonalDriveView } from './components/PersonalDriveView';
import { ReelsView } from './components/ReelsView';
import { EducationalNewsView } from './components/EducationalNewsView';
import { StudyGamesView } from './components/StudyGamesView';
import { MarketplaceView } from './components/MarketplaceView';
import { ChatView } from './components/ChatView';
import { FeedView } from './components/FeedView';
import { CloudVaultView } from './components/CloudVaultView';
import { ClassmatesView } from './components/ClassmatesView';
import { ProfileView } from './components/ProfileView';
import { AdminPanelView } from './components/AdminPanelView';
import { CallModal } from './components/CallModal';
import { AuthModal } from './components/AuthModal';
import { HelpTicketModal } from './components/HelpTicketModal';
import { GoogleSearchModal } from './components/GoogleSearchModal';
import { Toast } from './components/Toast';
import { Megaphone, AlertTriangle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, isLoggedIn, systemSettings, language } = useApp();

  return (
    <div className="h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors overflow-hidden">
      <Navbar />

      {/* Global Broadcast Announcement (from Admin Panel) */}
      {systemSettings.announcement && (
        <div className="shrink-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white px-4 py-2.5 text-xs font-bold shadow-inner flex items-center justify-center gap-2 animate-in slide-in-from-top">
          <Megaphone className="w-4 h-4 text-amber-300 animate-bounce shrink-0" />
          <span className="truncate">{systemSettings.announcement}</span>
        </div>
      )}

      {/* Maintenance Mode Banner if active */}
      {systemSettings.maintenanceMode && (
        <div className="shrink-0 bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-black flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{language === 'bn' ? 'সিস্টেম রক্ষণাবেক্ষণ অডিট চলছে — সকল ফিচার সংরক্ষিত।' : 'Campus maintenance & security audit in progress.'}</span>
        </div>
      )}

      <div className="flex-1 flex max-w-7xl w-full mx-auto overflow-hidden">
        {/* Academic Modules Sidebar only visible to logged-in students */}
        {isLoggedIn && <Sidebar />}

        <main className={`flex-1 p-3 sm:p-6 overflow-y-auto ${isLoggedIn ? 'pb-20 md:pb-6' : 'pb-8'}`}>
          {/* Guest or Welcome view */}
          {(!isLoggedIn || activeTab === 'welcome') && <WelcomeView />}

          {/* Protected Internal Academic Views */}
          {isLoggedIn && (
            <>
              {activeTab === 'drive' && <PersonalDriveView />}
              {activeTab === 'reels' && <ReelsView />}
              {activeTab === 'edu_news' && <EducationalNewsView />}
              {activeTab === 'games' && <StudyGamesView />}
              {activeTab === 'feed' && <FeedView />}
              {activeTab === 'messages' && <ChatView />}
              {activeTab === 'classmates' && <ClassmatesView />}
              {activeTab === 'files' && <CloudVaultView />}
              {activeTab === 'marketplace' && <MarketplaceView />}
              {activeTab === 'profile' && <ProfileView />}
              {activeTab === 'admin' && <AdminPanelView />}
            </>
          )}
        </main>
      </div>

      <CallModal />
      <AuthModal />
      <HelpTicketModal />
      <GoogleSearchModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;

