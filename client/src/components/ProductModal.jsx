import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

const PRESET_IMAGES = [
  { label: 'Biryani / Meal', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
  { label: 'Pandi Curry', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Grocery Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cooking Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Oranges / Fruits', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fresh Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { label: 'Coorg Coffee', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Wild Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' },
  { label: 'Medicines / Strip', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fresh Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tender Coconut', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' }
];

export default function ProductModal({ isOpen, onClose, product = null, onSaved }) {
  const { categories, showToast, refreshAllData } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    category: 'groceries',
    price: '',
    originalPrice: '',
    unit: '1 Unit',
    stock: '25',
    inStock: true,
    isPopular: false,
    badge: '',
    prepTime: '15-20 mins',
    description: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'groceries',
        price: product.price || '',
        originalPrice: product.originalPrice || product.price || '',
        unit: product.unit || '1 Unit',
        stock: product.stock !== undefined ? product.stock : '25',
        inStock: product.inStock !== false,
        isPopular: Boolean(product.isPopular),
        badge: product.badge || '',
        prepTime: product.prepTime || '15-20 mins',
        description: product.description || '',
        image: product.image || PRESET_IMAGES[0].url
      });
    } else {
      setFormData({
        name: '',
        category: categories[0]?.id || 'groceries',
        price: '',
        originalPrice: '',
        unit: '1 Unit',
        stock: '25',
        inStock: true,
        isPopular: false,
        badge: '',
        prepTime: '15-20 mins',
        description: '',
        image: PRESET_IMAGES[0].url
      });
    }
  }, [product, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showToast('Please provide Product Name and Price', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        stock: Number(formData.stock)
      };

      if (product) {
        await api.updateProduct(product.id, payload);
        showToast('Product updated successfully! 🎉');
      } else {
        await api.createProduct(payload);
        showToast('New product added to catalog! 🚀');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-darkbg-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-beego-500/10 text-beego-600 dark:text-beego-400 flex items-center justify-center font-black">
              📦
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {product ? 'Edit Virajpete Item' : 'Add New Item to BeeGo'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Configure item details, pricing & stock for instant delivery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-darkbg-hover transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Special Kodava Pandi Curry"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-beego-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-beego-500 text-gray-900 dark:text-white"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Unit */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Selling Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="240"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-beego-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Original Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="280"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-beego-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Unit / Quantity
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. 1 kg, 500ml, 1 Portion"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-beego-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Stock & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Available Stock Units
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                placeholder="25"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-beego-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Badge / Tag
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={e => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Bestseller / Fresh Pick"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-beego-500 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Est. Prep / Delivery
              </label>
              <input
                type="text"
                value={formData.prepTime}
                onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
                placeholder="15-20 mins"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-beego-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* In-Stock & Popular Toggles */}
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 rounded text-beego-500 focus:ring-beego-500 accent-beego-500"
              />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Item is In Stock & Available for Delivery
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 rounded text-beego-500 focus:ring-beego-500 accent-beego-500"
              />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Show in "Virajpete Bestsellers" section 🔥
              </span>
            </label>
          </div>

          {/* Image URL & Preset Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Image URL</span>
              <span className="text-[11px] text-gray-400 font-normal">Click preset or paste custom URL</span>
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-mono text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 dark:border-darkbg-border shrink-0 bg-gray-100">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = PRESET_IMAGES[0].url; }}
                />
              </div>
            </div>

            {/* Presets pill list */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, image: preset.url })}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border transition-all ${
                    formData.image === preset.url
                      ? 'bg-beego-500 text-black border-beego-500'
                      : 'bg-gray-100 dark:bg-darkbg border-gray-200 dark:border-darkbg-border text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Product Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Freshly prepared with authentic Kodava spices, packaged hot..."
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>

          {/* Footer Actions */}
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
              {saving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{product ? 'Save Changes' : 'Publish Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
