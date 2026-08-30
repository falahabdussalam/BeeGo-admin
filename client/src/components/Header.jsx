import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  RotateCw,
  MessageCircle,
  Clock,
  Bell,
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
    const newVal = settings.enableSoundAlerts === false ? true : false;
    await updateSettings({ enableSoundAlerts: newVal });
    showToast(`Order sound alert ${newVal ? 'Enabled 🔔' : 'Muted 🔕'}`);
  };

  const cleanWa = settings.cleanWhatsapp || '918105326568';

  return (
    <header className="sticky top-0 z-30 h-16 lg:h-20 bg-white/80 dark:bg-darkbg-sidebar/80 backdrop-blur-xl border-b border-gray-100 dark:border-darkbg-border px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkbg-hover lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-darkbg-card px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-darkbg-border">
          <Clock className="w-3.5 h-3.5 text-beego-500" />
          <span>Virajpete, Kodagu: {time}</span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh Data button */}
        <button
          onClick={() => {
            refreshAllData();
            showToast('Refreshed store catalog and orders');
          }}
          disabled={loading}
          title="Refresh All Data"
          className="p-2.5 rounded-2xl bg-gray-100 dark:bg-darkbg-card border border-gray-200/60 dark:border-darkbg-border text-gray-600 dark:text-gray-300 hover:text-beego-500 dark:hover:text-beego-400 hover:bg-gray-200/60 dark:hover:bg-darkbg-hover transition-all"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-beego-500' : ''}`} />
        </button>

        {/* Audio Alert Toggle */}
        <button
          onClick={toggleSound}
          title={settings.enableSoundAlerts !== false ? 'Sound Alerts: ON' : 'Sound Alerts: MUTED'}
          className="p-2.5 rounded-2xl bg-gray-100 dark:bg-darkbg-card border border-gray-200/60 dark:border-darkbg-border text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-darkbg-hover transition-all"
        >
          {settings.enableSoundAlerts !== false ? (
            <Volume2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* WhatsApp Quick Launcher */}
        <a
          href={`https://wa.me/${cleanWa}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open WhatsApp Support Hub (+918105326568)"
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Hub</span>
        </a>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2.5 rounded-2xl bg-gray-100 dark:bg-darkbg-card border border-gray-200/60 dark:border-darkbg-border text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-darkbg-hover transition-all"
        >
          {isDark ? <Sun className="w-4 h-4 text-beego-400" /> : <Moon className="w-4 h-4 text-gray-700" />}
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-darkbg-border">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-beego-500 to-amber-500 text-black font-black flex items-center justify-center text-sm shadow-sm">
            BG
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-black text-gray-900 dark:text-white leading-tight">
              BeeGo Admin
            </p>
            <p className="text-[10px] font-bold text-gray-400">
              Virajpete Head
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
