const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/coupons - list coupons
router.get('/', (req, res) => {
  try {
    const coupons = store.getCoupons();
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/coupons - create coupon
router.post('/', (req, res) => {
  try {
    const { code, discountValue } = req.body;
    if (!code || discountValue === undefined) {
      return res.status(400).json({ success: false, message: 'Code and discountValue are required' });
    }
    const created = store.createCoupon(req.body);
    res.status(201).json({ success: true, message: 'Coupon created', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/coupons/:id - update coupon
router.put('/:id', (req, res) => {
  try {
    const updated = store.updateCoupon(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/coupons/:id - delete coupon
router.delete('/:id', (req, res) => {
  try {
    const deleted = store.deleteCoupon(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
