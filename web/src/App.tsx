import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/Home';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentRoute.startsWith('/admin')) {
    return (
      <div className="p-8 font-mono text-xs">
        <h1 className="text-base font-bold mb-4">CMS Console Loading...</h1>
        <button
          onClick={() => navigateTo('/')}
          className="px-3 py-1.5 bg-brand-900 text-white font-semibold"
        >
          ← Return to Portfolio
        </button>
      </div>
    );
  }

  return <HomePage onNavigateToAdmin={() => navigateTo('/admin')} />;
};

export default App;
