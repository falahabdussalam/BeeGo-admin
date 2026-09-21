import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  MapPin,
  Clock,
  Phone,
  Power,
  Edit2,
  Trash2,
  ExternalLink,
  PackageCheck,
  Star
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import StoreModal from '../components/StoreModal';

export default function Stores() {
  const { stores, updateStore, deleteStore, showToast, categories } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const filteredStores = stores.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      (s.address && s.address.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q));

    const matchesCategory =
      categoryFilter === 'all' || s.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleToggleStoreStatus = async (store) => {
    try {
      const newStatus = !store.isOpen;
      await updateStore(store.id, { isOpen: newStatus });
      showToast(`${store.name} is now ${newStatus ? 'OPEN 🟢' : 'CLOSED 🔴'}`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteStore = async (store) => {
    if (confirm(`Are you sure you want to remove store "${store.name}"? Products linked to this store will fallback to default.`)) {
      try {
        await deleteStore(store.id);
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Stores & Outlets
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              {stores.length} Outlets
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Manage partner merchants, supply hubs, and fulfillment points in Virajpete Town
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://bee-go.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs py-2 px-3"
          >
            <span>View Main Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => {
              setEditingStore(null);
              setModalOpen(true);
            }}
            className="btn-primary text-xs py-2 px-3.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Store Outlet</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base">🐝</span>
          <div>
            <span className="font-bold">Live Catalog Integration:</span>
            <span className="ml-1 text-amber-800 dark:text-amber-300">
              Stores added here appear on product tags (`🏨 [Store Name]`) and dispatch routings on the main BeeGo website.
            </span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stores by name, address, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-700 dark:text-zinc-300 focus:outline-hidden"
          >
            <option value="all">All Store Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto text-xl">
            🏬
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            No Stores Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            {searchQuery
              ? `No partner stores match "${searchQuery}". Try changing your search query.`
              : 'Click "Add Store Outlet" above to configure your first partner merchant in Virajpete.'}
          </p>
          <button
            onClick={() => {
              setEditingStore(null);
              setModalOpen(true);
            }}
            className="btn-primary text-xs py-1.5 px-3 mx-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Store Outlet</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStores.map((store) => {
            const matchedCategory = categories.find((c) => c.id === store.category);
            return (
              <div
                key={store.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Store Banner */}
                  <div className="relative h-36 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                    <img
                      src={store.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                          store.isOpen
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-rose-500/90 text-white'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {store.isOpen ? 'Open • Taking Orders' : 'Store Paused'}
                      </span>
                    </div>

                    {/* Category pill */}
                    {matchedCategory && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-semibold border border-white/20">
                        {matchedCategory.icon} {matchedCategory.name}
                      </div>
                    )}

                    {/* Title overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-extrabold text-base leading-tight truncate drop-shadow-xs">
                        {store.name}
                      </h3>
                      <p className="text-[11px] text-zinc-300 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{store.address || 'Virajpete, Kodagu'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 space-y-3 text-xs">
                    {store.description && (
                      <p className="text-gray-600 dark:text-zinc-400 text-[11px] line-clamp-2">
                        {store.description}
                      </p>
                    )}

                    {/* Metadata chips */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 dark:border-zinc-800 text-[11px]">
                      <div className="text-center">
                        <span className="text-gray-400 block text-[10px]">Speed</span>
                        <span className="font-bold text-gray-800 dark:text-zinc-200 flex items-center justify-center gap-0.5">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {store.deliveryTime || '20-30m'}
                        </span>
                      </div>
                      <div className="text-center border-x border-gray-100 dark:border-zinc-800">
                        <span className="text-gray-400 block text-[10px]">Min Order</span>
                        <span className="font-bold text-gray-800 dark:text-zinc-200">
                          ₹{store.minOrder || 0}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-400 block text-[10px]">Products</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5">
                          <PackageCheck className="w-3 h-3" />
                          {store.itemCount || 0}
                        </span>
                      </div>
                    </div>

                    {/* Phone / Contact */}
                    {store.phone && (
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span>{store.phone}</span>
                        </span>
                        <a
                          href={`https://wa.me/${store.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                        >
                          WhatsApp ↗
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStoreStatus(store)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      store.isOpen
                        ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{store.isOpen ? 'Pause Store' : 'Activate'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingStore(store);
                        setModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                      title="Edit store outlet"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete store"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Store Modal */}
      {modalOpen && (
        <StoreModal
          isOpen={modalOpen}
          store={editingStore}
          onClose={() => {
            setModalOpen(false);
            setEditingStore(null);
          }}
        />
      )}
    </div>
  );
}
