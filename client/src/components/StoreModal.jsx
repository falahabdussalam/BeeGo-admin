import React, { useState, useEffect } from 'react';
import { X, Store, MapPin, Phone, Clock, DollarSign, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const PRESET_STORE_IMAGES = [
  { label: 'Supermarket / Grocery', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fresh Fruits & Veg', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80' },
  { label: 'Coffee & Spices', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Bakery & Cafe', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { label: 'Pharmacy & Medical', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
  { label: 'Food & Meals', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' }
];

export default function StoreModal({ isOpen, onClose, store = null, onSaved }) {
  const { categories, createStore, updateStore, showToast } = useAdmin();

  const [formData, setFormData] = useState({
    name: '',
    category: 'groceries',
    phone: '+91 8105326568',
    address: 'Virajpete, Kodagu',
    deliveryTime: '20-30 mins',
    minOrder: '99',
    rating: '4.9',
    isOpen: true,
    isActive: true,
    image: '',
    description: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || '',
        category: store.category || 'groceries',
        phone: store.phone || '+91 8105326568',
        address: store.address || 'Virajpete, Kodagu',
        deliveryTime: store.deliveryTime || '20-30 mins',
        minOrder: store.minOrder !== undefined ? `${store.minOrder}` : '99',
        rating: store.rating !== undefined ? `${store.rating}` : '4.9',
        isOpen: store.isOpen !== false,
        isActive: store.isActive !== false,
        image: store.image || '',
        description: store.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: categories[0]?.id || 'groceries',
        phone: '+91 8105326568',
        address: 'Virajpete Town, Kodagu',
        deliveryTime: '20-30 mins',
        minOrder: '99',
        rating: '4.9',
        isOpen: true,
        isActive: true,
        image: PRESET_STORE_IMAGES[0].url,
        description: ''
      });
    }
  }, [store, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a Store Name', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        name: formData.name.trim(),
        minOrder: Number(formData.minOrder) || 0,
        rating: Number(formData.rating) || 4.8
      };

      if (store) {
        await updateStore(store.id, payload);
      } else {
        await createStore(payload);
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      showToast(err.message || 'Error saving store', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center text-sm font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {store ? 'Edit Partner Store' : 'Add New Store / Outlet'}
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                Partner merchant outlet for customer products and dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Store Name */}
          <div className="space-y-1">
            <label className="font-bold text-gray-700 dark:text-zinc-300">
              Store / Outlet Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Virajpete Express Mart, Coorg Spices Hub..."
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Category & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-zinc-300">
                Primary Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-zinc-300">
                Store Phone / WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 8105326568"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Address / Location */}
          <div className="space-y-1">
            <label className="font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Location / Street Address in Virajpete</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Clock Tower, Main Bazaar Road, Virajpete..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Delivery Time & Min Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Delivery Time</span>
              </label>
              <input
                type="text"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                placeholder="20-30 mins"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                <span>Min Order (₹)</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                placeholder="99"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-zinc-300">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-gray-700 dark:text-zinc-300">
              Short Description / Specialties
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Fresh groceries, daily supplies, organic staples..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden resize-none"
            />
          </div>

          {/* Store Image URL & Presets */}
          <div className="space-y-1.5">
            <label className="font-bold text-gray-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Store Banner Image URL</span>
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-xs"
            />

            {/* Presets */}
            <div className="pt-1">
              <span className="text-[10px] text-gray-500 dark:text-zinc-400 block mb-1">
                Quick Preset Images:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_STORE_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: preset.url })}
                    className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                      formData.image === preset.url
                        ? 'bg-amber-500 text-black border-amber-500 font-bold'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:border-amber-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isOpen}
                onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-400"
              />
              <span className="font-semibold text-gray-700 dark:text-zinc-300">
                Store Currently Open (Accepting Orders)
              </span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold text-gray-700 dark:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? 'Saving...' : store ? 'Update Store' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
