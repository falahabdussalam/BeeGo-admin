import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

const COLOR_OPTIONS = [
  { label: 'Red / Amber (Hot Food)', value: 'from-red-500 to-amber-600' },
  { label: 'Emerald / Teal (Groceries)', value: 'from-emerald-600 to-teal-600' },
  { label: 'Blue / Cyan (Medicines)', value: 'from-blue-600 to-cyan-600' },
  { label: 'Green / Emerald (Veggies)', value: 'from-green-500 to-emerald-600' },
  { label: 'Amber / Coffee (Coorg Special)', value: 'from-amber-700 to-orange-700' },
  { label: 'Sky / Blue (Dairy & Milk)', value: 'from-sky-500 to-blue-600' },
  { label: 'Purple / Indigo (Drinks)', value: 'from-purple-500 to-indigo-600' }
];

export default function CategoryModal({ isOpen, onClose, category = null }) {
  const { showToast, refreshAllData } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    icon: '🍲',
    description: '',
    color: 'from-emerald-600 to-teal-600',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        icon: category.icon || '🍲',
        description: category.description || '',
        color: category.color || COLOR_OPTIONS[0].value,
        bannerImage: category.bannerImage || '',
        isActive: category.isActive !== false
      });
    } else {
      setFormData({
        name: '',
        icon: '🍲',
        description: '',
        color: COLOR_OPTIONS[0].value,
        bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        isActive: true
      });
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      setSaving(true);
      if (category) {
        await api.updateCategory(category.id, formData);
        showToast('Category updated successfully');
      } else {
        await api.createCategory(formData);
        showToast('Category created successfully');
      }
      await refreshAllData(true);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-darkbg-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-beego-500/10 text-beego-600 dark:text-beego-400 flex items-center justify-center text-xl font-black">
              📂
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {category ? 'Edit Category' : 'Create New Category'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Organize products for BeeGo customers in Virajpete
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Category Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Traditional Kodava Sweets"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Emoji Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🍯"
                className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-center text-xl font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Color Gradient Theme</label>
            <select
              value={formData.color}
              onChange={e => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            >
              {COLOR_OPTIONS.map((opt, idx) => (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Banner Image URL</label>
            <input
              type="url"
              value={formData.bannerImage}
              onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-mono text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description for customer storefront"
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border">
            <input
              type="checkbox"
              id="cat-active"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-beego-500 focus:ring-beego-500 accent-beego-500"
            />
            <label htmlFor="cat-active" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
              Active & Visible on BeeGo Storefront
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-darkbg-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl font-bold text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkbg-hover transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-2xl bg-beego-500 hover:bg-beego-600 text-black font-extrabold text-xs shadow-glow-yellow flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{category ? 'Update Category' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
