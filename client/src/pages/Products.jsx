import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  Package
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Products & Inventory
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Manage product pricing, stock levels, and store inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-white dark:bg-zinc-800 p-1 rounded-lg border border-gray-300 dark:border-zinc-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-gray-100 dark:bg-zinc-700 text-amber-600 dark:text-amber-400'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-100 dark:bg-zinc-700 text-amber-600 dark:text-amber-400'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="btn-primary text-xs py-2 px-3.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products by name, tag, or description..."
              className="control-input pl-9"
            />
          </div>

          {/* Stock Filter Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              className="control-select"
            >
              <option value="all">All Stock Statuses</option>
              <option value="instock">In Stock Only</option>
              <option value="lowstock">Low Stock (≤ 10)</option>
              <option value="outstock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar (if categories exist) */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{cat.icon || '📁'}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75">
                  ({products.filter(p => p.category === cat.id).length})
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Content: Table or Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-gray-400">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {products.length === 0 ? "No products in store catalog" : "No matching products found"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            {products.length === 0
              ? "Click below to add your first product with price, stock, and category details."
              : "Try adjusting your search terms or filters to find what you're looking for."}
          </p>
          {products.length === 0 ? (
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="btn-primary text-xs py-2 px-4"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Product</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setStockFilter('all');
              }}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-zinc-800/70 text-gray-500 dark:text-zinc-400 font-semibold border-b border-gray-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 font-normal">
                {filteredProducts.map(prod => {
                  const cat = categories.find(c => c.id === prod.category);
                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      {/* Product details */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-200 dark:border-zinc-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-gray-200 dark:border-zinc-700">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div className="max-w-xs sm:max-w-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                {prod.name}
                              </span>
                              {prod.badge && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-1">
                              {prod.description || prod.unit}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-medium text-xs">
                          <span>{cat?.icon || '📁'}</span>
                          <span>{cat?.name || prod.category || 'General'}</span>
                        </span>
                      </td>

                      {/* Price & Unit */}
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            ₹{prod.price}
                          </span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-xs text-gray-400 line-through ml-1.5">
                              ₹{prod.originalPrice}
                            </span>
                          )}
                          <p className="text-[11px] text-gray-400 dark:text-zinc-500">{prod.unit}</p>
                        </div>
                      </td>

                      {/* Stock Units */}
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            prod.stock <= 5
                              ? 'text-rose-600 dark:text-rose-400'
                              : prod.stock <= 15
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>

                      {/* In-Stock Toggle Button */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleProductStock(prod.id, prod.inStock)}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            prod.inStock
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {prod.inStock ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{prod.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1.5 rounded-md text-gray-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Product"
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
              className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col justify-between space-y-3 shadow-sm hover:border-gray-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="relative rounded-lg overflow-hidden aspect-4/3 mb-3 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-8 h-8" />
                    </div>
                  )}
                  {prod.badge && (
                    <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-black/80 text-amber-400 backdrop-blur-xs">
                      {prod.badge}
                    </span>
                  )}
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                      prod.inStock ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {prod.inStock ? 'In Stock' : 'Out'}
                  </span>
                </div>

                <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                  {prod.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 mt-1">
                  {prod.description || `${prod.unit} available`}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-base text-gray-900 dark:text-white">
                    ₹{prod.price}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-zinc-400 block">{prod.unit}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-500 hover:text-rose-600"
                    title="Delete"
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
