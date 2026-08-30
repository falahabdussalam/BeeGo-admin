import React, { useState } from 'react';
import { Plus, Tag, Edit2, Trash2, CheckCircle2, Clock, Zap } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';
import CouponModal from '../components/CouponModal';

export default function Coupons() {
  const { coupons, showToast, refreshAllData } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleDelete = async (id, code) => {
    if (window.confirm(`Delete coupon "${code}"?`)) {
      try {
        await api.deleteCoupon(id);
        showToast('Coupon deleted');
        refreshAllData(true);
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleToggleActive = async (cpn) => {
    try {
      await api.updateCoupon(cpn.id, { isActive: !cpn.isActive });
      showToast(`Coupon ${cpn.code} is now ${!cpn.isActive ? 'Active' : 'Paused'}`);
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
            Coupons & Promo Codes
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Manage checkout discounts, free delivery codes & Virajpete campaigns
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCoupon(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-beego-500 hover:bg-beego-600 text-black font-black text-xs shadow-glow-yellow flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(cpn => (
          <div
            key={cpn.id}
            className="p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border flex flex-col justify-between space-y-4 hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Top row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-beego-500/10 text-beego-600 dark:text-beego-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="font-mono font-black text-base tracking-wider text-gray-900 dark:text-white">
                    {cpn.code}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleActive(cpn)}
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full transition-all ${
                    cpn.isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-gray-100 dark:bg-darkbg text-gray-400'
                  }`}
                >
                  {cpn.isActive ? 'Active' : 'Paused'}
                </button>
              </div>

              {/* Discount Value */}
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200/50 dark:border-darkbg-border flex items-center justify-between">
                <div>
                  <span className="text-lg font-black text-beego-600 dark:text-beego-400">
                    {cpn.discountType === 'percentage' ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} OFF`}
                  </span>
                  <p className="text-[10px] text-gray-400">
                    Min order: ₹{cpn.minOrderValue} {cpn.discountType === 'percentage' ? `(Max ₹${cpn.maxDiscount})` : ''}
                  </p>
                </div>
                <div className="text-right text-[11px] font-bold text-gray-400">
                  <span>{cpn.usageCount || 0} used</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-medium">
                {cpn.description}
              </p>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-100 dark:border-darkbg-border flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                Exp: {cpn.expiryDate}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingCoupon(cpn);
                    setIsModalOpen(true);
                  }}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-darkbg-hover text-gray-600 dark:text-gray-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cpn.id, cpn.code)}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCoupon(null);
        }}
        coupon={editingCoupon}
      />
    </div>
  );
}
