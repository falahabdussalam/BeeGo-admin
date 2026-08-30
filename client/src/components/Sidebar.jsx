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
    { id: 'orders', label: 'Live Orders', icon: ShoppingBag, badge: pendingOrdersCount ? `${pendingOrdersCount}` : null, badgeColor: 'bg-emerald-500' },
    { id: 'products', label: 'Products Catalog', icon: Package, badge: `${products.length}` },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'coupons', label: 'Coupons & Deals', icon: Tag },
    { id: 'delivery', label: 'Delivery & Riders', icon: MapPin },
    { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
    { id: 'storefront-api', label: 'Storefront & API', icon: Globe2, highlight: true },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 lg:w-72 bg-white dark:bg-darkbg-sidebar border-r border-gray-100 dark:border-darkbg-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-darkbg-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-beego-500 text-black flex items-center justify-center text-xl shadow-glow-yellow font-black">
              🐝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-gray-900 dark:text-white tracking-tight">
                  BeeGo<span className="text-beego-500">.Admin</span>
                </span>
              </div>
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                Virajpete Control Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Live Status Banner */}
        <div className="px-4 py-3 mx-4 my-3 rounded-2xl bg-gray-50 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                settings.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                {settings.isOpen ? 'Store is OPEN' : 'Store is CLOSED'}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                {settings.isOpen ? 'Accepting Orders' : 'Paused in Virajpete'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleStoreOpenStatus}
            title={settings.isOpen ? 'Click to Close Store' : 'Click to Open Store'}
            className={`p-2 rounded-xl transition-all ${
              settings.isOpen
                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-beego-500 text-black shadow-glow-yellow'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkbg-hover hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-black text-beego-400'
                        : item.badgeColor || 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
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
        <div className="p-4 border-t border-gray-100 dark:border-darkbg-border space-y-2">
          <a
            href="https://bee-go.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs font-black hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all"
          >
            <div className="flex items-center gap-2">
              <span>View Live Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[10px] text-gray-400 font-semibold">BeeGo Virajpete v1.0</span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              API Connected
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
