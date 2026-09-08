import React, { useState } from 'react';
import { Plus, Tag, Edit2, Trash2 } from 'lucide-react';
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Coupons & Discounts
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Create promotional discount codes and cart checkout incentives
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCoupon(null);
            setIsModalOpen(true);
          }}
          className="btn-primary text-xs py-2 px-3.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons List or Empty State */}
      {coupons.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-gray-400">
            <Tag className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            No discount coupons active
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            Create discount vouchers (e.g. WELCOME10, SAVE50) to reward customers at checkout.
          </p>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setIsModalOpen(true);
            }}
            className="btn-primary text-xs py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Coupon</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map(cpn => (
            <div
              key={cpn.id}
              className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex flex-col justify-between space-y-3 shadow-sm hover:border-gray-300 dark:hover:border-zinc-700 transition-colors"
            >
              {/* Top row */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                      <Tag className="w-4 h-4" />
                    </div>
                    <span className="font-mono font-bold text-base tracking-wider text-gray-900 dark:text-white">
                      {cpn.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleActive(cpn)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                      cpn.isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                    }`}
                  >
                    {cpn.isActive ? 'Active' : 'Paused'}
                  </button>
                </div>

                {/* Discount Value */}
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                      {cpn.discountType === 'percentage' ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} OFF`}
                    </span>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                      Min order: ₹{cpn.minOrderValue} {cpn.discountType === 'percentage' && cpn.maxDiscount ? `(Max ₹${cpn.maxDiscount})` : ''}
                    </p>
                  </div>
                  <div className="text-right text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                    <span>{cpn.usedCount || 0} uses</span>
                  </div>
                </div>

                {cpn.description && (
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {cpn.description}
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs text-gray-400">
                <span className="text-[11px]">
                  Exp: {cpn.expiryDate || 'No expiry'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingCoupon(cpn);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
                    title="Edit Coupon"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cpn.id, cpn.code)}
                    className="p-1.5 rounded-md text-gray-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
