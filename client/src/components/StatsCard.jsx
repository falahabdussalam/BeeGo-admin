import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, prefix = '', suffix = '', icon: Icon, change, isPositive, subtitle, color = 'beego' }) {
  const colorMap = {
    beego: 'text-beego-500 bg-beego-500/10 border-beego-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl border ${colorMap[color] || colorMap.beego}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {prefix}{value}{suffix}
        </span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
