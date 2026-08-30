import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  MessageSquare,
  Clock,
  IndianRupee,
  Volume2,
  AlertTriangle,
  Check,
  RotateCcw
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { api } from '../services/api';

export default function Settings() {
  const { settings, showToast, refreshAllData, setSettings } = useAdmin();
  const [formData, setFormData] = useState({
    storeName: '',
    storeTagline: '',
    whatsappNumber: '+918105326568',
    cleanWhatsapp: '918105326568',
    contactEmail: '',
    address: '',
    currency: '₹',
    defaultDeliveryFee: 20,
    freeDeliveryThreshold: 199,
    avgDeliveryMinutes: 30,
    maxDeliveryRadiusKm: 12,
    operatingHours: '07:00 AM - 10:30 PM',
    emergencyNotice: '',
    isOpen: true,
    enableSoundAlerts: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || 'BeeGo Virajpete Express',
        storeTagline: settings.storeTagline || '30-Min Ultra Fast Delivery in Virajpete Town & Kodagu',
        whatsappNumber: settings.whatsappNumber || '+918105326568',
        cleanWhatsapp: settings.cleanWhatsapp || '918105326568',
        contactEmail: settings.contactEmail || 'admin@beego.in',
        address: settings.address || 'Clock Tower Road, Main Bazaar, Virajpete, Kodagu - 571218',
        currency: settings.currency || '₹',
        defaultDeliveryFee: settings.defaultDeliveryFee || 20,
        freeDeliveryThreshold: settings.freeDeliveryThreshold || 199,
        avgDeliveryMinutes: settings.avgDeliveryMinutes || 30,
        maxDeliveryRadiusKm: settings.maxDeliveryRadiusKm || 12,
        operatingHours: settings.operatingHours || '07:00 AM - 10:30 PM',
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
      showToast('Store settings saved successfully! 🎉');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetFactory = async () => {
    if (window.confirm('⚠️ WARNING: This will reset all products, categories, coupons, and orders to default Virajpete starter data. Continue?')) {
      try {
        await api.resetStore();
        showToast('Store reset to factory demo data');
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
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Store Configuration & Live Controls
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          Manage business info, Virajpete WhatsApp dispatch numbers & delivery thresholds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Profile */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
          <div className="flex items-center gap-2.5">
            <Store className="w-5 h-5 text-beego-500" />
            <h2 className="font-black text-base text-gray-900 dark:text-white">
              Store Profile & Branding
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Tagline / Subtitle</label>
              <input
                type="text"
                value={formData.storeTagline}
                onChange={e => setFormData({ ...formData, storeTagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Physical Store Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
            />
          </div>
        </div>

        {/* WhatsApp & Contact */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <h2 className="font-black text-base text-gray-900 dark:text-white">
              WhatsApp Dispatch & Customer Support
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Support WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+918105326568"
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
              <p className="text-[10px] text-gray-400">Main receiver for 1-click customer & rider orders</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Support Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-beego-500"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rules & Thresholds */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-purple-500" />
            <h2 className="font-black text-base text-gray-900 dark:text-white">
              Delivery Operations & Free Delivery Threshold
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Default Delivery Fee (₹)</label>
              <input
                type="number"
                value={formData.defaultDeliveryFee}
                onChange={e => setFormData({ ...formData, defaultDeliveryFee: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Free Delivery Over (₹)</label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={e => setFormData({ ...formData, freeDeliveryThreshold: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Avg Delivery Mins</label>
              <input
                type="number"
                value={formData.avgDeliveryMinutes}
                onChange={e => setFormData({ ...formData, avgDeliveryMinutes: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Max Radius (km)</label>
              <input
                type="number"
                value={formData.maxDeliveryRadiusKm}
                onChange={e => setFormData({ ...formData, maxDeliveryRadiusKm: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-bold text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Emergency Announcement Banner (Optional)</label>
            <input
              type="text"
              value={formData.emergencyNotice}
              onChange={e => setFormData({ ...formData, emergencyNotice: e.target.value })}
              placeholder="e.g. Heavy rain in Virajpete: Deliveries may take 10 extra mins"
              className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-darkbg-border text-xs font-semibold text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetFactory}
            className="px-4 py-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Store Data</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-2xl bg-beego-500 hover:bg-beego-600 text-black font-black text-xs shadow-glow-yellow flex items-center gap-2 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
