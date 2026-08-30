const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/products - list all products with optional filters
router.get('/', (req, res) => {
  try {
    const { category, inStock, search } = req.query;
    const products = store.getProducts({ category, inStock, search });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id - single product
router.get('/:id', (req, res) => {
  try {
    const product = store.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products - create new product
router.post('/', (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }
    const created = store.createProduct(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully', data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id - update existing product
router.put('/:id', (req, res) => {
  try {
    const updated = store.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/products/:id/stock - quick toggle in-stock / stock count
router.patch('/:id/stock', (req, res) => {
  try {
    const { inStock, stock } = req.body;
    const updates = {};
    if (inStock !== undefined) updates.inStock = Boolean(inStock);
    if (stock !== undefined) updates.stock = Number(stock);

    const updated = store.updateProduct(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Stock status updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id - delete product
router.delete('/:id', (req, res) => {
  try {
    const deleted = store.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
