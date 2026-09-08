import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  RotateCw,
  MessageCircle,
  Clock,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useTheme } from '../context/ThemeContext';

export default function Header({ onMenuClick }) {
  const { settings, refreshAllData, loading, showToast, updateSettings } = useAdmin();
  const { isDark, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = async () => {
    const newVal = settings.enableSoundAlerts === false;
    await updateSettings({ enableSoundAlerts: newVal });
    showToast(`Order sound alerts ${newVal ? 'enabled' : 'muted'}`);
  };

  const cleanWa = settings.cleanWhatsapp;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left side: Hamburger & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 lg:hidden"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Local Time: {time}</span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* Refresh Data button */}
        <button
          onClick={() => {
            refreshAllData();
            showToast('Store catalog and orders refreshed');
          }}
          disabled={loading}
          title="Refresh Data"
          className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
        </button>

        {/* Audio Alert Toggle */}
        <button
          onClick={toggleSound}
          title={settings.enableSoundAlerts !== false ? 'Sound Alerts: Active' : 'Sound Alerts: Muted'}
          className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
        >
          {settings.enableSoundAlerts !== false ? (
            <Volume2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* WhatsApp Support Link (if configured) */}
        {cleanWa && (
          <a
            href={`https://wa.me/${cleanWa}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open WhatsApp Support Hub"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Support</span>
          </a>
        )}

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-black font-bold flex items-center justify-center text-xs shadow-sm">
            BG
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
              Admin
            </p>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">
              Manager
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
