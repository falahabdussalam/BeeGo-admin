const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/settings - fetch all settings
router.get('/', (req, res) => {
  try {
    const settings = store.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings - update settings
router.put('/', (req, res) => {
  try {
    const updated = store.updateSettings(req.body);
    res.json({ success: true, message: 'Settings saved', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/settings/backup - download full backup JSON
router.get('/backup/export', (req, res) => {
  try {
    const backup = store.getBackup();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="beego-backup-${Date.now()}.json"`);
    res.send(JSON.stringify(backup, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/settings/backup/restore - restore from payload
router.post('/backup/restore', (req, res) => {
  try {
    const backupData = req.body;
    store.restoreBackup(backupData);
    res.json({ success: true, message: 'Database successfully restored from backup' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/settings/clear - clear all saved data
router.post('/clear', (req, res) => {
  try {
    store.clearAllData();
    res.json({ success: true, message: 'All store data cleared successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/settings/reset - reset to clean defaults
router.post('/reset', (req, res) => {
  try {
    store.resetToDefault();
    res.json({ success: true, message: 'Store reset to clean defaults' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
