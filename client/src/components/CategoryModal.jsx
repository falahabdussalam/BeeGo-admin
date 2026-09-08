import React, { useState, useEffect } from 'react';
import { X, Check, FolderTree } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

export default function CategoryModal({ isOpen, onClose, category = null }) {
  const { showToast, refreshAllData } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    description: '',
    bannerImage: '',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        icon: category.icon || '📦',
        description: category.description || '',
        bannerImage: category.bannerImage || '',
        isActive: category.isActive !== false
      });
    } else {
      setFormData({
        name: '',
        icon: '📦',
        description: '',
        bannerImage: '',
        isActive: true
      });
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {category ? 'Edit Category' : 'Create Category'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Organize catalog items into departments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3">
              <label className="control-label">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Groceries, Dairy, Snacks"
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📦"
                className="control-input text-center text-lg"
              />
            </div>
          </div>

          <div>
            <label className="control-label">Description (Optional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description for customers"
              className="control-input"
            />
          </div>

          <div>
            <label className="control-label">Banner Image URL (Optional)</label>
            <input
              type="url"
              value={formData.bannerImage}
              onChange={e => setFormData({ ...formData, bannerImage: e.target.value })}
              placeholder="https://..."
              className="control-input"
            />
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700">
            <input
              type="checkbox"
              id="cat-active"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
            />
            <label htmlFor="cat-active" className="text-xs font-medium text-gray-800 dark:text-zinc-200 cursor-pointer">
              Active and visible on storefront
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
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
