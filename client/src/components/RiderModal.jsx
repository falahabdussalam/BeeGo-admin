import React, { useState, useEffect } from 'react';
import { X, Check, Bike } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

export default function RiderModal({ isOpen, onClose, rider = null }) {
  const { zones, showToast, refreshAllData } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    zone: '',
    status: 'available'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rider) {
      setFormData({
        name: rider.name || '',
        phone: rider.phone || '',
        vehicle: rider.vehicle || '',
        zone: rider.zone || (zones[0]?.name || 'Standard Area'),
        status: rider.status || 'available'
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        vehicle: '',
        zone: zones[0]?.name || 'Standard Area',
        status: 'available'
      });
    }
  }, [rider, zones]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
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
        showToast('New delivery partner registered');
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
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {rider ? 'Edit Rider Profile' : 'Register Delivery Partner'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Manage dispatch contact and assigned delivery area
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
          <div>
            <label className="control-label">
              Rider Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="control-input"
            />
          </div>

          <div>
            <label className="control-label">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 9876543210"
              className="control-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="control-label">Vehicle Details</label>
              <input
                type="text"
                value={formData.vehicle}
                onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                placeholder="e.g. Motorcycle / Scooter"
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">Assigned Zone</label>
              {zones.length > 0 ? (
                <select
                  value={formData.zone}
                  onChange={e => setFormData({ ...formData, zone: e.target.value })}
                  className="control-select"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.name}>
                      {z.name}
                    </option>
                  ))}
                  <option value="Primary Area">Primary Area</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.zone}
                  onChange={e => setFormData({ ...formData, zone: e.target.value })}
                  placeholder="e.g. Downtown Area"
                  className="control-input"
                />
              )}
            </div>
          </div>

          <div>
            <label className="control-label">Initial Availability</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="control-select"
            >
              <option value="available">Available for Orders</option>
              <option value="busy">On Delivery</option>
              <option value="offline">Offline</option>
            </select>
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
              <span>{rider ? 'Update Details' : 'Register Rider'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
