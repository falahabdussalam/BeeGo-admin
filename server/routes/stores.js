const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/stores - List all stores with item counts
router.get('/', (req, res) => {
  try {
    const stores = store.getStores();
    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/stores/:id - Get single store by ID
router.get('/:id', (req, res) => {
  try {
    const s = store.getStoreById(req.params.id);
    if (!s) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.json({ success: true, data: s });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/stores - Create new partner store/outlet
router.post('/', (req, res) => {
  try {
    const { name, category, phone, address, deliveryTime, minOrder, image, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Store name is required' });
    }

    const created = store.createStore({
      name: name.trim(),
      category,
      phone,
      address,
      deliveryTime,
      minOrder,
      image,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Partner store created successfully',
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/stores/:id - Update store details
router.put('/:id', (req, res) => {
  try {
    const updated = store.updateStore(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.json({
      success: true,
      message: 'Store updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/stores/:id - Remove store
router.delete('/:id', (req, res) => {
  try {
    const deleted = store.deleteStore(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
