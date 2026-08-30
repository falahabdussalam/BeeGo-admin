import React, { useState, useEffect } from 'react';
import { X, Check, Bike } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

export default function RiderModal({ isOpen, onClose, rider = null }) {
  const { zones, showToast, refreshAllData } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: 'Hero Splendor (KA-12-E-4521)',
    zone: 'Virajpete Clock Tower & Main Bazaar',
    status: 'available'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rider) {
      setFormData({
        name: rider.name || '',
        phone: rider.phone || '',
        vehicle: rider.vehicle || '',
        zone: rider.zone || zones[0]?.name || 'Virajpete Clock Tower',
        status: rider.status || 'available'
      });
    } else {
      setFormData({
        name: '',
        phone: '+91 ',
        vehicle: '',
        zone: zones[0]?.name || 'Virajpete Clock Tower',
        status: 'available'
      });
    }
  }, [rider, zones]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Rider name and contact phone are required', 'error');
      return;
    }

    try {
      setSaving(true);
      if (rider) {
        await api.updateRider(rider.id, formData);
        showToast('Rider profile updated');
      } else {
        await api.createRider(formData);
        showToast('New delivery partner registered! 🛵');
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
              🛵
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {rider ? 'Edit Rider Details' : 'Register New Delivery Partner'}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                BeeGo Virajpete express delivery fleet
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
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Rider Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Naveen Poovaiah"
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Phone Number (WhatsApp)</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 9448123456"
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-sm font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Vehicle Model & Reg No</label>
            <input
              type="text"
              value={formData.vehicle}
              onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
              placeholder="e.g. Honda Activa 6G (KA-12-Q-8819)"
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Primary Delivery Zone</label>
              <select
                value={formData.zone}
                onChange={e => setFormData({ ...formData, zone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.name}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Availability Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              >
                <option value="available">🟢 Available for Dispatch</option>
                <option value="busy">🟡 Out on Delivery</option>
                <option value="offline">⚪ Offline</option>
              </select>
            </div>
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
              <span>{rider ? 'Save Rider' : 'Register Rider'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
