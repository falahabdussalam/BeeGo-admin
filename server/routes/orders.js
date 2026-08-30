const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/orders - list all orders
router.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    const orders = store.getOrders({ status, search });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id - single order
router.get('/:id', (req, res) => {
  try {
    const order = store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders - create new order (used by live storefront or admin)
router.post('/', (req, res) => {
  try {
    const { items, grandTotal } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }
    const created = store.createOrder(req.body);
    res.status(201).json({ success: true, message: 'Order placed successfully', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/orders/:id/status - update status or assign rider
router.patch('/:id/status', (req, res) => {
  try {
    const { status, riderId, riderName, paymentStatus } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const updated = store.updateOrderStatus(req.params.id, status, {
      riderId,
      riderName,
      paymentStatus
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order status updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id/whatsapp-links - get preformatted WhatsApp links for rider and customer
router.get('/:id/whatsapp-links', (req, res) => {
  try {
    const order = store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const settings = store.getSettings();
    const storeWhatsApp = settings.cleanWhatsapp || '918105326568';

    // Format item list
    const itemsText = order.items
      .map((it, idx) => `${idx + 1}. ${it.name} (x${it.quantity}) - ₹${it.price * it.quantity}`)
      .join('\n');

    // Customer message
    const customerMsg = `🐝 *BeeGo Virajpete Express Update* 🐝\n\n` +
      `Hello *${order.customerName}*,\n` +
      `Your Order *#${order.orderNumber}* is now *${order.orderStatus.toUpperCase()}*.\n\n` +
      `📦 *Items:*\n${itemsText}\n\n` +
      `💰 *Total Amount:* ₹${order.grandTotal} (${order.paymentMethod} - ${order.paymentStatus})\n` +
      `📍 *Delivery Address:* ${order.address.fullAddress}, ${order.address.city}\n\n` +
      `🛵 *Rider:* ${order.riderName || 'BeeGo Express Fleet'}\n` +
      `📞 *Help / Inquiry:* +${storeWhatsApp}\n\n` +
      `Thank you for ordering with BeeGo Virajpete!`;

    // Rider dispatch message
    const riderMsg = `🚨 *BeeGo Virajpete - NEW DISPATCH* 🚨\n\n` +
      `*Order ID:* #${order.orderNumber}\n` +
      `*Customer:* ${order.customerName} (${order.customerPhone})\n` +
      `*Address:* ${order.address.fullAddress}\n` +
      `*Landmark:* ${order.address.landmark || 'N/A'}\n\n` +
      `*Items to Pick & Deliver:*\n${itemsText}\n\n` +
      `*Collect Amount:* ₹${order.paymentMethod === 'COD' ? order.grandTotal : 0} (${order.paymentMethod})\n` +
      `*Customer Note:* ${order.notes || 'None'}\n\n` +
      `*Store Dispatch:* +${storeWhatsApp}`;

    const cleanCustPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');

    res.json({
      success: true,
      data: {
        customerUrl: cleanCustPhone ? `https://wa.me/${cleanCustPhone}?text=${encodeURIComponent(customerMsg)}` : null,
        riderUrl: `https://wa.me/${storeWhatsApp}?text=${encodeURIComponent(riderMsg)}`,
        customerText: customerMsg,
        riderText: riderMsg
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
