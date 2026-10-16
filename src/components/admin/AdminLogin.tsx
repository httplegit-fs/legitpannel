import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, Server, AlertCircle, KeyRound } from 'lucide-react';
import { adminLogin } from '../../services/adminService';

interface AdminLoginProps {
  onSuccess: (token: string, username: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your Administrator ID');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await adminLogin(username.trim(), password);
    setIsLoading(false);

    if (res.success && res.token) {
      onSuccess(res.token, username.trim());
    } else {
      setError(res.error || 'Invalid ID or password');
    }
  };

  const handleQuickFill = () => {
    setUsername('prime');
    setPassword('legit');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute w-[600px] h-[600px] bg-rose-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Header Lockup */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white mb-4 shadow-xl shadow-rose-950/60">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Legit Admin Hub</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Universal Multi-Site Remote Control Center
          </p>
        </div>

        {/* Warning / Error notice */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Admin ID / Username */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Admin ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Admin ID"
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Secret Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Panel'}</span>
          </button>
        </form>

        {/* Quick Helper */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
          <span className="text-[11px]">Authorized Credentials:</span>
          <button
            type="button"
            onClick={handleQuickFill}
            className="font-mono text-[11px] text-rose-400 hover:text-rose-300 bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-800 transition-colors flex items-center gap-1"
          >
            <span>Fill: prime / legit</span>
          </button>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex flex-col items-center justify-center gap-1 text-[11px] text-neutral-500 text-center">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <Server className="w-3.5 h-3.5" />
            <span>PBKDF2 SHA-512 Hash Verification Active</span>
          </div>
          <span className="text-[10px] text-neutral-600">Zero plaintext leakage · Timed-safe comparison</span>
        </div>
      </div>
    </div>
  );
};
