import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MarketplaceView } from './components/MarketplaceView';
import { ChatView } from './components/ChatView';
import { FeedView } from './components/FeedView';
import { CloudVaultView } from './components/CloudVaultView';
import { ClassmatesView } from './components/ClassmatesView';
import { ProfileView } from './components/ProfileView';
import { AdminPanelView } from './components/AdminPanelView';
import { CallModal } from './components/CallModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Megaphone, AlertTriangle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, systemSettings, language } = useApp();

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
        <Sidebar />

        <main className="flex-1 p-3 sm:p-6 overflow-y-auto pb-20 md:pb-6">
          {activeTab === 'marketplace' && <MarketplaceView />}
          {activeTab === 'messages' && <ChatView />}
          {activeTab === 'feed' && <FeedView />}
          {activeTab === 'files' && <CloudVaultView />}
          {activeTab === 'classmates' && <ClassmatesView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'admin' && <AdminPanelView />}
        </main>
      </div>

      <CallModal />
      <AuthModal />
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
