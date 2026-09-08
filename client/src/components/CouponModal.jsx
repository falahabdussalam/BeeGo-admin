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
    expiryDate: '',
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
        expiryDate: coupon.expiryDate || '',
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
        expiryDate: '',
        isActive: true
      });
    }
  }, [coupon]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {coupon ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Configure discount rules and customer redemption criteria
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="control-label">
                Coupon Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SAVE20"
                className="control-input font-mono font-bold"
              />
            </div>

            <div>
              <label className="control-label">
                Discount Type
              </label>
              <select
                value={formData.discountType}
                onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                className="control-select"
              >
                <option value="fixed">Fixed Amount (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="control-label">
                Discount Value <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.discountValue}
                onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">
                Min Order Value (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrderValue}
                onChange={e => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="199"
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">
                Max Cap (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxDiscount}
                onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="100"
                className="control-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="control-label">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">
                Description (Optional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Save ₹50 on orders above ₹199"
                className="control-input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700">
            <input
              type="checkbox"
              id="cpn-active"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500"
            />
            <label htmlFor="cpn-active" className="text-xs font-medium text-gray-800 dark:text-zinc-200 cursor-pointer">
              Active and ready for redemption
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
              <span>{coupon ? 'Update Coupon' : 'Create Coupon'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
