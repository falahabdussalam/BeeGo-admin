const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/categories - list all categories
router.get('/', (req, res) => {
  try {
    const categories = store.getCategories();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/categories/:id - single category
router.get('/:id', (req, res) => {
  try {
    const cat = store.getCategoryById(req.params.id);
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/categories - create category
router.post('/', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const created = store.createCategory(req.body);
    res.status(201).json({ success: true, message: 'Category created', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/categories/:id - update category
router.put('/:id', (req, res) => {
  try {
    const updated = store.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/categories/:id - delete category
router.delete('/:id', (req, res) => {
  try {
    const deleted = store.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
