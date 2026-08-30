import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  Sparkles,
  Flame
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';
import ProductModal from '../components/ProductModal';

export default function Products() {
  const { products, categories, toggleProductStock, showToast, refreshAllData } = useAdmin();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Stock filter
      if (stockFilter === 'instock' && (!p.inStock || p.stock <= 0)) {
        return false;
      }
      if (stockFilter === 'outstock' && (p.inStock && p.stock > 0)) {
        return false;
      }
      if (stockFilter === 'lowstock' && (p.stock > 10 || !p.inStock)) {
        return false;
      }
      // Search
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.badge && p.badge.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, selectedCategory, stockFilter, search]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      try {
        await api.deleteProduct(id);
        showToast('Product removed from catalog');
        refreshAllData(true);
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Products & Inventory Catalog
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Manage pricing, stock levels & live items for Virajpete 30-min delivery
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-darkbg-card p-1 rounded-2xl border border-gray-200/60 dark:border-darkbg-border">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-darkbg shadow-xs text-beego-500'
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-darkbg shadow-xs text-beego-500'
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-beego-500 hover:bg-beego-600 text-black font-black text-xs shadow-glow-yellow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products by name, tag, or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>

          {/* Stock Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            >
              <option value="all">All Stock Statuses</option>
              <option value="instock">🟢 In Stock Only</option>
              <option value="lowstock">🟡 Low Stock (&lt; 10)</option>
              <option value="outstock">🔴 Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-beego-500 text-black shadow-xs'
                : 'bg-gray-100 dark:bg-darkbg text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-beego-500 text-black shadow-xs'
                  : 'bg-gray-100 dark:bg-darkbg text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-70">({cat.itemCount || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Content: Table or Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">No products found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your search query or category filters, or add a new item to this category.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setStockFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-darkbg text-xs font-bold hover:bg-gray-200"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-darkbg text-gray-400 dark:text-gray-500 font-extrabold uppercase border-b border-gray-100 dark:border-darkbg-border">
                <tr>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-darkbg-border font-medium">
                {filteredProducts.map(prod => {
                  const cat = categories.find(c => c.id === prod.category);
                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-darkbg-hover/50 transition-colors"
                    >
                      {/* Product details */}
                      <td className="p-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-gray-200 dark:border-darkbg-border"
                          />
                          <div className="max-w-xs sm:max-w-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm text-gray-900 dark:text-white">
                                {prod.name}
                              </span>
                              {prod.badge && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-400/20">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                              {prod.description || `${prod.unit} • Fast delivery`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-darkbg text-gray-700 dark:text-gray-300 font-bold text-xs">
                          <span>{cat?.icon || '📦'}</span>
                          <span>{cat?.name || prod.category}</span>
                        </span>
                      </td>

                      {/* Price & Unit */}
                      <td className="p-4">
                        <div>
                          <span className="font-black text-sm text-gray-900 dark:text-white">
                            ₹{prod.price}
                          </span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-xs text-gray-400 line-through ml-1.5 font-normal">
                              ₹{prod.originalPrice}
                            </span>
                          )}
                          <p className="text-[10px] text-gray-400">{prod.unit}</p>
                        </div>
                      </td>

                      {/* Stock Units */}
                      <td className="p-4">
                        <div>
                          <span
                            className={`font-extrabold ${
                              prod.stock <= 5
                                ? 'text-red-500'
                                : prod.stock <= 15
                                ? 'text-amber-500'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {prod.stock} units
                          </span>
                          <p className="text-[10px] text-gray-400">Virajpete Hub</p>
                        </div>
                      </td>

                      {/* In-Stock Toggle Button */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleProductStock(prod.id, prod.inStock)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                            prod.inStock
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {prod.inStock ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{prod.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-beego-500 hover:bg-gray-100 dark:hover:bg-darkbg-hover transition-all"
                            title="Edit Item"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(prod => (
            <div
              key={prod.id}
              className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border flex flex-col justify-between space-y-3 hover:shadow-md transition-all group"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 mb-3 bg-gray-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.badge && (
                    <span className="absolute top-2 left-2 text-[10px] font-black px-2.5 py-1 rounded-full bg-black/75 text-beego-400 backdrop-blur-xs">
                      {prod.badge}
                    </span>
                  )}
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prod.inStock ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {prod.inStock ? 'In Stock' : 'Out'}
                  </span>
                </div>

                <h4 className="font-black text-sm text-gray-900 dark:text-white line-clamp-1">
                  {prod.name}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                  {prod.description}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-darkbg-border flex items-center justify-between">
                <div>
                  <span className="font-black text-base text-gray-900 dark:text-white">
                    ₹{prod.price}
                  </span>
                  <span className="text-[10px] text-gray-400 block">{prod.unit}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-darkbg-hover text-gray-600 dark:text-gray-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Add / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />
    </div>
  );
}
