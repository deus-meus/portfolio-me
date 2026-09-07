import React, { useState } from 'react';
import { Lock, Shield, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
  onBackToHome: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(username, password);
      onLoginSuccess(res.username);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center items-center px-4 font-mono">
      <div className="w-full max-w-md bg-white border border-brand-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-brand-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-900 text-white">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-brand-900 tracking-wider uppercase">
                CMS CONSOLE ACCESS
              </h1>
              <span className="text-[10px] text-brand-500 block">
                Session Authentication
              </span>
            </div>
          </div>
          <button
            onClick={onBackToHome}
            className="text-xs text-brand-500 hover:text-brand-900 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Site
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-brand-700 font-semibold uppercase mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-brand-50 border border-brand-300 px-3 py-2 text-brand-900 focus:outline-none focus:border-brand-900"
            />
          </div>

          <div>
            <label className="block text-brand-700 font-semibold uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-50 border border-brand-300 px-3 py-2 text-brand-900 focus:outline-none focus:border-brand-900"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-900 text-white font-semibold hover:bg-brand-800 disabled:bg-brand-400 flex items-center justify-center gap-2 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              {loading ? 'AUTHENTICATING...' : 'ENTER CONSOLE'}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-brand-100 text-[11px] text-brand-500 text-center">
          Default seed credentials: <code className="bg-brand-100 px-1 py-0.5 text-brand-800">admin</code> / <code className="bg-brand-100 px-1 py-0.5 text-brand-800">admin123</code>
        </div>
      </div>
    </div>
  );
};
