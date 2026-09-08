import React, { useState, useEffect } from 'react';
import { X, Check, Package } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

const PRESET_IMAGES = [
  { label: 'Food & Meals', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
  { label: 'Groceries / Grains', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cooking Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fruits & Veggies', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80' },
  { label: 'Coffee / Tea', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dairy & Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
  { label: 'Beverages', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Health / OTC', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' }
];

export default function ProductModal({ isOpen, onClose, product = null, onSaved }) {
  const { categories, showToast, refreshAllData } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    unit: '1 Unit',
    stock: '25',
    inStock: true,
    isPopular: false,
    badge: '',
    prepTime: '15-20 mins',
    description: '',
    image: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || (categories[0]?.id || 'general'),
        price: product.price || '',
        originalPrice: product.originalPrice || product.price || '',
        unit: product.unit || '1 Unit',
        stock: product.stock !== undefined ? product.stock : '25',
        inStock: product.inStock !== false,
        isPopular: Boolean(product.isPopular),
        badge: product.badge || '',
        prepTime: product.prepTime || '15-20 mins',
        description: product.description || '',
        image: product.image || ''
      });
    } else {
      setFormData({
        name: '',
        category: categories[0]?.id || 'general',
        price: '',
        originalPrice: '',
        unit: '1 Unit',
        stock: '25',
        inStock: true,
        isPopular: false,
        badge: '',
        prepTime: '15-20 mins',
        description: '',
        image: ''
      });
    }
  }, [product, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('Please provide a Product Name and Price', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        category: formData.category || 'general',
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        stock: Number(formData.stock)
      };

      if (product) {
        await api.updateProduct(product.id, payload);
        showToast('Product updated successfully');
      } else {
        await api.createProduct(payload);
        showToast('New product added to catalog');
      }

      await refreshAllData(true);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Configure item details, pricing, and stock quantity
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="control-label">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Basmati Rice (1kg)"
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">
                Category
              </label>
              {categories.length > 0 ? (
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="control-select"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  <option value="general">General</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Groceries"
                  className="control-input"
                />
              )}
            </div>
          </div>

          {/* Pricing & Unit */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="control-label">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="150"
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">
                Original Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="180"
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">
                Unit / Measurement
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. 1 kg, 500g, Pack"
                className="control-input"
              />
            </div>
          </div>

          {/* Stock & Tag */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="control-label">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                placeholder="25"
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={e => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Popular, Fresh"
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">
                Est. Delivery Time
              </label>
              <input
                type="text"
                value={formData.prepTime}
                onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
                placeholder="15-20 mins"
                className="control-input"
              />
            </div>
          </div>

          {/* In-Stock & Featured Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 p-3.5 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span className="text-xs font-medium text-gray-800 dark:text-zinc-200">
                In Stock and Available
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span className="text-xs font-medium text-gray-800 dark:text-zinc-200">
                Highlight as Featured Item
              </span>
            </label>
          </div>

          {/* Image URL & Preset Selection */}
          <div className="space-y-2">
            <label className="control-label flex items-center justify-between">
              <span>Image URL (Optional)</span>
              <span className="text-[11px] text-gray-400 font-normal">Direct image link or select preset</span>
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="control-input"
              />
              {formData.image && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700 shrink-0 bg-gray-100">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            {/* Presets pill list */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors ${
                    formData.image === preset.url
                      ? 'bg-amber-500 text-black border-amber-500 font-semibold'
                      : 'bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="control-label">
              Product Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide key details, specifications, or packaging info..."
              className="control-input"
            />
          </div>

          {/* Footer Actions */}
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
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{product ? 'Save Changes' : 'Add Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
