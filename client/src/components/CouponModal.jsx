import React, { useState, useEffect } from 'react';
import { X, Check, Tag } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

export default function CouponModal({ isOpen, onClose, coupon = null }) {
  const { showToast, refreshAllData } = useAdmin();
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'fixed',
    discountValue: '',
    minOrderValue: '199',
    maxDiscount: '100',
    description: '',
    expiryDate: '2026-12-31',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        discountType: coupon.discountType || 'fixed',
        discountValue: coupon.discountValue || '',
        minOrderValue: coupon.minOrderValue || '0',
        maxDiscount: coupon.maxDiscount || '100',
        description: coupon.description || '',
        expiryDate: coupon.expiryDate || '2026-12-31',
        isActive: coupon.isActive !== false
      });
    } else {
      setFormData({
        code: '',
        discountType: 'fixed',
        discountValue: '',
        minOrderValue: '199',
        maxDiscount: '100',
        description: '',
        expiryDate: '2026-12-31',
        isActive: true
      });
    }
  }, [coupon]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      showToast('Coupon code and discount value are required', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscount: Number(formData.maxDiscount)
      };

      if (coupon) {
        await api.updateCoupon(coupon.id, payload);
        showToast('Coupon updated successfully');
      } else {
        await api.createCoupon(payload);
        showToast('Coupon created successfully');
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
              🏷️
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {coupon ? 'Edit Promo Coupon' : 'Create Promo Coupon'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Set discounts and promotions for Virajpete orders
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. KODAGU50 or FREEDEL"
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-mono font-black tracking-wider text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              >
                <option value="fixed">Fixed Discount (₹ Off)</option>
                <option value="percentage">Percentage (% Off)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.discountValue}
                onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? '50 (%)' : '100 (₹)'}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Min Order Value (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.minOrderValue}
                onChange={e => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="199"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Max Discount Cap (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.maxDiscount}
                onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="100"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. ₹100 OFF on Virajpete local groceries"
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/60 dark:border-darkbg-border">
            <input
              type="checkbox"
              id="cpn-active"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-beego-500 focus:ring-beego-500 accent-beego-500"
            />
            <label htmlFor="cpn-active" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
              Coupon is Active & Usable at Checkout
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
              <span>{coupon ? 'Save Coupon' : 'Create Coupon'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
