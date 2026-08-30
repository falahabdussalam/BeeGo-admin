const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/zones - list zones
router.get('/', (req, res) => {
  try {
    const zones = store.getZones();
    res.json({ success: true, count: zones.length, data: zones });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/zones/:id - update zone
router.put('/:id', (req, res) => {
  try {
    const updated = store.updateZone(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }
    res.json({ success: true, message: 'Zone updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/zones/riders - list riders
router.get('/riders/list', (req, res) => {
  try {
    const riders = store.getRiders();
    res.json({ success: true, count: riders.length, data: riders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/zones/riders - create rider
router.post('/riders', (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }
    const created = store.createRider(req.body);
    res.status(201).json({ success: true, message: 'Rider added', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/zones/riders/:id - update rider
router.put('/riders/:id', (req, res) => {
  try {
    const updated = store.updateRider(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }
    res.json({ success: true, message: 'Rider updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
