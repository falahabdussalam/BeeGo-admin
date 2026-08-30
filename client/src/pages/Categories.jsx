import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
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
      if (!window.confirm(`Category "${name}" currently contains ${prodsInCat} items. Are you sure you want to delete it?`)) {
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
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Categories & Departments
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Structure your Virajpete catalog for quick browsing on BeeGo app
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-beego-500 hover:bg-beego-600 text-black font-black text-xs shadow-glow-yellow flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => {
          const count = products.filter(p => p.category === cat.id).length;
          return (
            <div
              key={cat.id}
              className="rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Banner & Icon Header */}
                <div className="relative h-32 w-full bg-gray-200">
                  <img
                    src={cat.bannerImage}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Icon badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-darkbg-card/90 backdrop-blur-md flex items-center justify-center text-xl shadow-md">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base leading-tight drop-shadow-xs">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] font-bold text-beego-400">
                        {count} items active
                      </span>
                    </div>
                  </div>

                  {/* Status pill */}
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-md transition-all ${
                      cat.isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </button>
                </div>

                {/* Description Body */}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2">
                    {cat.description || 'No description provided.'}
                  </p>
                  <p className="text-[11px] font-mono text-gray-400">
                    ID: <span className="font-bold text-gray-700 dark:text-gray-300">`{cat.id}`</span>
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-2 border-t border-gray-100 dark:border-darkbg-border flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">
                  Virajpete Catalog
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkbg-hover hover:text-beego-500"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
