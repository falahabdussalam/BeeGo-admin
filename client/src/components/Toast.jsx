import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-beego-500 shrink-0" />
  };

  const bgStyles = {
    success: 'border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-200',
    error: 'border-red-500/30 bg-red-50/90 dark:bg-red-950/90 text-red-900 dark:text-red-200',
    info: 'border-beego-500/30 bg-amber-50/90 dark:bg-amber-950/90 text-amber-900 dark:text-amber-200'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-lg shadow-xl max-w-md ${
          bgStyles[toast.type] || bgStyles.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <p className="text-sm font-semibold">{toast.message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
