import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { id, message, type: 'success' | 'error' | 'info' }

  // Global store data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [zones, setZones] = useState([]);
  const [riders, setRiders] = useState([]);
  const [settings, setSettings] = useState({});
  const [analytics, setAnalytics] = useState(null);

  // Sound notification
  const playAlertSound = useCallback(() => {
    if (settings.enableSoundAlerts !== false) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        // audio context blocked or unsupported
      }
    }
  }, [settings.enableSoundAlerts]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const refreshAllData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [prodsRes, catsRes, ordsRes, cpnRes, zonesRes, ridersRes, settRes, anaRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getCoupons(),
        api.getZones(),
        api.getRiders(),
        api.getSettings(),
        api.getAnalytics()
      ]);

      setProducts(prodsRes.data || []);
      setCategories(catsRes.data || []);
      setOrders(ordsRes.data || []);
      setCoupons(cpnRes.data || []);
      setZones(zonesRes.data || []);
      setRiders(ridersRes.data || []);
      setSettings(settRes.data || {});
      setAnalytics(anaRes.data || null);
    } catch (err) {
      console.error('Failed to load store data:', err);
      showToast(err.message || 'Error connecting to API server', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Periodic polling every 20 seconds for live orders
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const ordsRes = await api.getOrders();
        const newOrders = ordsRes.data || [];
        setOrders(prev => {
          if (newOrders.length > prev.length) {
            playAlertSound();
            showToast(`🚨 New incoming order #${newOrders[0]?.orderNumber} received!`, 'info');
          }
          return newOrders;
        });
        const anaRes = await api.getAnalytics();
        if (anaRes.data) setAnalytics(anaRes.data);
      } catch (e) {
        // quiet fail on background polling
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [playAlertSound, showToast]);

  // Quick Action Helpers
  const toggleProductStock = async (productId, currentStatus) => {
    try {
      const updated = await api.updateProductStock(productId, { inStock: !currentStatus });
      setProducts(prev => prev.map(p => (p.id === productId ? updated.data : p)));
      showToast(`Product stock status updated to ${!currentStatus ? 'In Stock' : 'Out of Stock'}`);
      return updated.data;
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const updateOrderStatus = async (orderId, newStatus, extra = {}) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, extra);
      setOrders(prev => prev.map(o => (o.id === orderId || o.orderNumber === orderId ? updated.data : o)));
      showToast(`Order status updated to ${newStatus.toUpperCase()}`);
      refreshAllData(true);
      return updated.data;
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleStoreOpenStatus = async () => {
    try {
      const newStatus = !settings.isOpen;
      const updated = await api.updateSettings({ isOpen: newStatus });
      setSettings(updated.data);
      showToast(`Store is now ${newStatus ? 'OPEN for orders 🟢' : 'CLOSED 🔴'}`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        loading,
        toast,
        showToast,
        products,
        categories,
        orders,
        coupons,
        zones,
        riders,
        settings,
        analytics,
        refreshAllData,
        toggleProductStock,
        updateOrderStatus,
        toggleStoreOpenStatus,
        setSettings
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
