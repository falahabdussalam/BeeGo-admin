import React, { useState, useEffect } from 'react';
import {
  Store,
  MessageSquare,
  Clock,
  IndianRupee,
  Check,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

export default function Settings() {
  const { settings, showToast, refreshAllData, setSettings } = useAdmin();
  const [formData, setFormData] = useState({
    storeName: '',
    storeTagline: '',
    whatsappNumber: '',
    cleanWhatsapp: '',
    contactEmail: '',
    address: '',
    currency: '₹',
    defaultDeliveryFee: 20,
    freeDeliveryThreshold: 199,
    avgDeliveryMinutes: 30,
    maxDeliveryRadiusKm: 10,
    operatingHours: '08:00 AM - 10:00 PM',
    emergencyNotice: '',
    isOpen: true,
    enableSoundAlerts: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || 'BeeGo Store',
        storeTagline: settings.storeTagline || 'Fast & Reliable Online Delivery',
        whatsappNumber: settings.whatsappNumber || '',
        cleanWhatsapp: settings.cleanWhatsapp || '',
        contactEmail: settings.contactEmail || '',
        address: settings.address || '',
        currency: settings.currency || '₹',
        defaultDeliveryFee: settings.defaultDeliveryFee || 20,
        freeDeliveryThreshold: settings.freeDeliveryThreshold || 199,
        avgDeliveryMinutes: settings.avgDeliveryMinutes || 30,
        maxDeliveryRadiusKm: settings.maxDeliveryRadiusKm || 10,
        operatingHours: settings.operatingHours || '08:00 AM - 10:00 PM',
        emergencyNotice: settings.emergencyNotice || '',
        isOpen: settings.isOpen !== false,
        enableSoundAlerts: settings.enableSoundAlerts !== false
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const cleanWa = formData.whatsappNumber.replace(/[^0-9]/g, '');
      const payload = {
        ...formData,
        cleanWhatsapp: cleanWa,
        defaultDeliveryFee: Number(formData.defaultDeliveryFee),
        freeDeliveryThreshold: Number(formData.freeDeliveryThreshold),
        avgDeliveryMinutes: Number(formData.avgDeliveryMinutes),
        maxDeliveryRadiusKm: Number(formData.maxDeliveryRadiusKm)
      };

      const updated = await api.updateSettings(payload);
      setSettings(updated.data);
      showToast('Store settings saved successfully');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('⚠️ This will permanently remove all products, categories, orders, coupons, zones, and riders from the database. Are you sure?')) {
      try {
        await api.clearStore();
        showToast('All saved store data cleared');
        await refreshAllData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleResetSettings = async () => {
    if (window.confirm('Reset store configuration settings to default?')) {
      try {
        await api.resetStore();
        showToast('Settings reset to defaults');
        await refreshAllData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Store Settings & Configuration
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Manage business profile, WhatsApp dispatch contact, and delivery fee thresholds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Profile */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-500" />
            <h2 className="font-semibold text-sm text-gray-900 dark:text-white">
              Store Profile & Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="control-label">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="control-input"
              />
            </div>

            <div>
              <label className="control-label">Tagline / Subtitle</label>
              <input
                type="text"
                value={formData.storeTagline}
                onChange={e => setFormData({ ...formData, storeTagline: e.target.value })}
                className="control-input"
              />
            </div>
          </div>

          <div>
            <label className="control-label">Store Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full shop / warehouse address"
              className="control-input"
            />
          </div>
        </div>

        {/* WhatsApp & Contact */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <h2 className="font-semibold text-sm text-gray-900 dark:text-white">
              Customer Support & Contact Info
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="control-label">
                WhatsApp Dispatch & Support Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+91 9876543210"
                className="control-input"
              />
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                Used for instant customer messages and rider dispatch links
              </p>
            </div>

            <div>
              <label className="control-label">Support Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="contact@store.com"
                className="control-input"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rules & Thresholds */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <h2 className="font-semibold text-sm text-gray-900 dark:text-white">
              Delivery Operations & Thresholds
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="control-label">Base Fee (₹)</label>
              <input
                type="number"
                value={formData.defaultDeliveryFee}
                onChange={e => setFormData({ ...formData, defaultDeliveryFee: e.target.value })}
                className="control-input font-medium"
              />
            </div>

            <div>
              <label className="control-label">Free Above (₹)</label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={e => setFormData({ ...formData, freeDeliveryThreshold: e.target.value })}
                className="control-input font-medium"
              />
            </div>

            <div>
              <label className="control-label">Avg Mins</label>
              <input
                type="number"
                value={formData.avgDeliveryMinutes}
                onChange={e => setFormData({ ...formData, avgDeliveryMinutes: e.target.value })}
                className="control-input font-medium"
              />
            </div>

            <div>
              <label className="control-label">Radius (km)</label>
              <input
                type="number"
                value={formData.maxDeliveryRadiusKm}
                onChange={e => setFormData({ ...formData, maxDeliveryRadiusKm: e.target.value })}
                className="control-input font-medium"
              />
            </div>
          </div>

          <div>
            <label className="control-label">Emergency Announcement Notice (Optional)</label>
            <input
              type="text"
              value={formData.emergencyNotice}
              onChange={e => setFormData({ ...formData, emergencyNotice: e.target.value })}
              placeholder="e.g. Due to heavy weather, deliveries may experience slight delays"
              className="control-input"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearAllData}
              className="btn-danger text-xs py-2 px-3"
              title="Clear all saved products, categories, orders, and coupons"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>

            <button
              type="button"
              onClick={handleResetSettings}
              className="btn-secondary text-xs py-2 px-3"
              title="Reset configuration to clean defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Settings</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2 px-6"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
