import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Coupons from './pages/Coupons';
import Delivery from './pages/Delivery';
import Analytics from './pages/Analytics';
import StorefrontApi from './pages/StorefrontApi';
import Settings from './pages/Settings';

function AdminShell() {
  const { activeTab, loading, toast } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'categories':
        return <Categories />;
      case 'coupons':
        return <Coupons />;
      case 'delivery':
        return <Delivery />;
      case 'analytics':
        return <Analytics />;
      case 'storefront-api':
        return <StorefrontApi />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 flex transition-colors duration-150">
      {/* Navigation Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                Loading store data...
              </p>
            </div>
          ) : (
            renderActivePage()
          )}
        </main>
      </div>

      {/* Toast notifications */}
      <Toast toast={toast} onClose={() => {}} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <AdminShell />
      </AdminProvider>
    </ThemeProvider>
  );
}
