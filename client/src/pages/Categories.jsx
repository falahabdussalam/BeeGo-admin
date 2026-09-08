import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';
import CategoryModal from '../components/CategoryModal';

export default function Categories() {
  const { categories, products, showToast, refreshAllData } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleDelete = async (id, name) => {
    const prodsInCat = products.filter(p => p.category === id).length;
    if (prodsInCat > 0) {
      if (!window.confirm(`Category "${name}" currently contains ${prodsInCat} products. Are you sure you want to delete it?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Delete category "${name}"?`)) return;
    }

    try {
      await api.deleteCategory(id);
      showToast('Category deleted');
      refreshAllData(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      await api.updateCategory(cat.id, { isActive: !cat.isActive });
      showToast(`Category "${cat.name}" is now ${!cat.isActive ? 'Active' : 'Hidden'}`);
      refreshAllData(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Categories
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Structure your catalog into departments for storefront browsing
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="btn-primary text-xs py-2 px-3.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Grid of Categories or Empty State */}
      {categories.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-gray-400">
            <FolderTree className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            No categories created
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            Create categories (e.g. Groceries, Dairy, Snacks) to organize products in your store.
          </p>
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsModalOpen(true);
            }}
            className="btn-primary text-xs py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            return (
              <div
                key={cat.id}
                className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:border-gray-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  {/* Banner & Icon Header */}
                  {cat.bannerImage ? (
                    <div className="relative h-28 w-full bg-gray-100 dark:bg-zinc-800">
                      <img
                        src={cat.bannerImage}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/95 dark:bg-zinc-900/95 flex items-center justify-center text-base shadow-sm">
                          {cat.icon || '📁'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm leading-tight">
                            {cat.name}
                          </h3>
                          <span className="text-[10px] text-amber-300 font-medium">
                            {count} {count === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs transition-colors ${
                          cat.isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-800/90 text-zinc-300'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 pb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
                          {cat.icon || '📁'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {cat.name}
                          </h3>
                          <span className="text-[11px] text-gray-500 dark:text-zinc-400">
                            {count} {count === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                  )}

                  {/* Description Body */}
                  <div className="p-4 pt-3 space-y-1.5">
                    <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2">
                      {cat.description || 'No description provided.'}
                    </p>
                    <p className="text-[11px] font-mono text-gray-400 dark:text-zinc-500">
                      Slug: <span className="font-medium text-gray-700 dark:text-zinc-300">{cat.id}</span>
                    </p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-3 pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-1">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-md text-gray-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
      />
    </div>
  );
}
