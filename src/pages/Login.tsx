import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Sparkles,
  Shield,
  User,
  ArrowRight,
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMsg(res.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick demo account autofill
  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setErrorMsg('');
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome Back to BlogSpace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Sign in to your account to write articles and join discussions.
        </p>
      </div>

      {/* Quick Demo Logins Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2.5">
        <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Quick Test Credentials (Pre-seeded Demo Accounts):
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('admin@blogspace.com')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all text-center shadow-xs flex flex-col items-center"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500 mb-0.5" />
            <span>Admin</span>
            <span className="text-[9px] text-slate-400 font-normal">Full Control</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('subi@blogspace.com')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all text-center shadow-xs flex flex-col items-center"
          >
            <User className="w-3.5 h-3.5 text-indigo-500 mb-0.5" />
            <span>Subiksha</span>
            <span className="text-[9px] text-slate-400 font-normal">Author</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('alex@blogspace.com')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all text-center shadow-xs flex flex-col items-center"
          >
            <User className="w-3.5 h-3.5 text-emerald-500 mb-0.5" />
            <span>Alex</span>
            <span className="text-[9px] text-slate-400 font-normal">Author</span>
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="login-submit-button"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Account</span>
              </>
            )}
          </button>
        </form>

        {/* Register Redirection */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
