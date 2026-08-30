const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/storefront/catalog - Complete catalog optimized for bee-go storefront
router.get('/catalog', (req, res) => {
  try {
    const settings = store.getSettings();
    const categories = store.getCategories().filter(c => c.isActive);
    const products = store.getProducts();
    const coupons = store.getCoupons().filter(c => c.isActive);
    const zones = store.getZones().filter(z => z.isActive);

    res.json({
      success: true,
      store: {
        name: settings.storeName,
        isOpen: settings.isOpen,
        notice: settings.emergencyNotice,
        whatsapp: settings.whatsappNumber,
        cleanWhatsapp: settings.cleanWhatsapp,
        currency: settings.currency,
        freeDeliveryAbove: settings.freeDeliveryThreshold,
        avgDeliveryMinutes: settings.avgDeliveryMinutes
      },
      categories,
      products,
      coupons,
      zones
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/storefront/status - Quick ping for store open/closed
router.get('/status', (req, res) => {
  try {
    const settings = store.getSettings();
    res.json({
      isOpen: settings.isOpen,
      notice: settings.emergencyNotice,
      whatsapp: settings.whatsappNumber
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/storefront/order - Submit order from storefront
router.post('/order', (req, res) => {
  try {
    const { items, customerName, customerPhone, address, grandTotal } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }
    const created = store.createOrder({
      ...req.body,
      orderStatus: 'pending'
    });
    res.status(201).json({
      success: true,
      message: 'Order created',
      orderNumber: created.orderNumber,
      order: created
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
