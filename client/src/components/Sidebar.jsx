import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Tag,
  MapPin,
  BarChart3,
  Globe2,
  Settings,
  ExternalLink,
  Power,
  X
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Sidebar({ isOpen, onClose }) {
  const { activeTab, setActiveTab, orders, products, settings, toggleStoreOpenStatus } = useAdmin();

  const pendingOrdersCount = orders.filter(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.orderStatus)).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount ? `${pendingOrdersCount}` : null },
    { id: 'products', label: 'Products', icon: Package, badge: products.length ? `${products.length}` : null },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'delivery', label: 'Delivery & Riders', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'storefront-api', label: 'Storefront & API', icon: Globe2 },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-black flex items-center justify-center text-lg font-bold shadow-sm">
              🐝
            </div>
            <div>
              <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight">
                BeeGo <span className="text-amber-500">Admin</span>
              </span>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                Control Panel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Live Status Control */}
        <div className="p-3 mx-3 my-3 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                settings.isOpen ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                {settings.isOpen ? 'Store Active' : 'Store Offline'}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                {settings.isOpen ? 'Accepting orders' : 'Orders paused'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleStoreOpenStatus}
            title={settings.isOpen ? 'Click to Pause Store' : 'Click to Activate Store'}
            className={`p-1.5 rounded-md border text-xs font-semibold transition-colors flex items-center gap-1 ${
              settings.isOpen
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100'
                : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-500 dark:text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-black text-amber-400'
                        : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Storefront Link */}
        <div className="p-3 border-t border-gray-200 dark:border-zinc-800 space-y-2">
          <a
            href="https://bee-go.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-xs font-semibold text-gray-800 dark:text-zinc-200 transition-colors"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>

          <div className="flex items-center justify-between px-1 text-[11px] text-gray-500 dark:text-zinc-400">
            <span>BeeGo Panel</span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              API Connected
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
