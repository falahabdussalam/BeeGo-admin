import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
  };

  const bgStyles = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white',
    error: 'border-rose-200 dark:border-rose-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white',
    info: 'border-amber-200 dark:border-amber-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div
        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border shadow-lg max-w-md text-xs font-medium ${
          bgStyles[toast.type] || bgStyles.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <p className="flex-1">{toast.message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
