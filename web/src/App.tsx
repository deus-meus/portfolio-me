import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { HomePage } from './pages/Home';
import { Login } from './pages/admin/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { AdminCaseStudies } from './pages/admin/CaseStudies';
import { AdminSkills } from './pages/admin/Skills';
import { AdminExperience } from './pages/admin/Experience';
import { AdminWebhooks } from './pages/admin/Webhooks';
import { AdminProfile } from './pages/admin/Profile';
import { api } from './services/api';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const me = await api.getMe();
      setAdminUser(me.username);
    } catch {
      setAdminUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setAdminUser(null);
    navigateTo('/');
  };

  // If in Admin Section
  if (currentPath.startsWith('/admin')) {
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-brand-50 flex items-center justify-center font-mono text-xs text-brand-600">
          Checking console authorization...
        </div>
      );
    }

    if (!adminUser) {
      return (
        <Login
          onLoginSuccess={(username) => {
            setAdminUser(username);
            navigateTo('/admin');
          }}
          onBackToHome={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onLogout={handleLogout}
        onBackToSite={() => navigateTo('/')}
        username={adminUser}
      >
        {adminTab === 'dashboard' && <Dashboard onNavigate={setAdminTab} />}
        {adminTab === 'case-studies' && <AdminCaseStudies />}
        {adminTab === 'skills' && <AdminSkills />}
        {adminTab === 'experience' && <AdminExperience />}
        {adminTab === 'webhooks' && <AdminWebhooks />}
        {adminTab === 'profile' && <AdminProfile />}
      </AdminLayout>
    );
  }

  // Otherwise, render Public Portfolio
  return (
    <LanguageProvider>
      <HomePage />
    </LanguageProvider>
  );
};

export default App;
