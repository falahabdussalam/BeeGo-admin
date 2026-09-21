import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ExternalLink,
  Store,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const { login } = useAdmin();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email/username and password');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login({
        email: email.trim(),
        password,
        rememberMe
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@beego.com');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#07090e] text-gray-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center text-xl font-black shadow-md shadow-amber-500/20">
            🐝
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">
                BeeGo <span className="text-amber-500">Admin</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/80">
                Staff Only
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">
              Virajpete Town & Kodagu District Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://bee-go.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold text-gray-700 dark:text-zinc-300 transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-amber-500" />
            <span>Customer Website</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>

          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-xs"
            title="Toggle theme"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
            {/* Header decorative accent */}
            <div className="h-1.5 w-full bg-linear-to-r from-amber-400 via-amber-500 to-amber-600" />

            <div className="p-6 sm:p-8 space-y-6">
              {/* Form title */}
              <div className="space-y-1.5 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Admin Sign In
                </h1>
                <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xs mx-auto">
                  Access the dispatch pipeline, product catalog, partner stores, and store settings.
                </p>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2.5">
                  <span className="text-sm">⚠️</span>
                  <span className="flex-1">{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center justify-between">
                    <span>Admin Email or Username</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@beego.com"
                      autoComplete="username"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center justify-between">
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-amber-500 border-gray-300 dark:border-zinc-700 rounded focus:ring-amber-400 accent-amber-500"
                    />
                    <span>Stay signed in on this computer</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Admin Command Center</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Fill Demo Credentials */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="w-full py-2 px-3 rounded-lg border border-dashed border-amber-300 dark:border-amber-700/80 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Click to Auto-fill Default Admin Login</span>
                </button>
              </div>

              {/* Security notice regarding customer login separation */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 text-[11px] text-gray-500 dark:text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-zinc-300">
                  <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Looking for the Customer Store?</span>
                </div>
                <p>
                  This portal is strictly for BeeGo administrators. Regular customer logins, order placement, and shopping take place directly on the main website.
                </p>
                <div className="pt-1.5">
                  <a
                    href="https://bee-go.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <span>Visit BeeGo Main Customer Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-gray-400 dark:text-zinc-500 mt-6">
            BeeGo Virajpete Express • Kodagu District Delivery Command System
          </p>
        </div>
      </main>

      {/* Page bottom indicator */}
      <footer className="py-3 text-center border-t border-gray-200 dark:border-zinc-800/60 text-[11px] text-gray-400 dark:text-zinc-600">
        Connected to BeeGo Local Backend & Catalog Synchronizer
      </footer>
    </div>
  );
}
