const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/analytics - dashboard summary & metrics
router.get('/', (req, res) => {
  try {
    const stats = store.getAnalytics();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
