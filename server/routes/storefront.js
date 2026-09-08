const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/storefront/catalog - Complete catalog optimized for bee-go storefront
router.get('/catalog', (req, res) => {
  try {
    const settings = store.getSettings();
    const categories = store.getCategories().filter(c => c.isActive !== false);
    const rawProducts = store.getProducts();
    const coupons = store.getCoupons().filter(c => c.isActive !== false);
    const zones = store.getZones().filter(z => z.isActive !== false);

    const products = rawProducts.map(p => {
      const origPrice = Number(p.originalPrice) || Number(p.price) || 0;
      const currPrice = Number(p.price) || 0;
      let discountPercentage = p.discountPercentage;
      if (discountPercentage === undefined && origPrice > currPrice && origPrice > 0) {
        discountPercentage = Math.round(((origPrice - currPrice) / origPrice) * 100);
      }

      return {
        ...p,
        deliveryTime: p.deliveryTime || p.prepTime || '15-20 mins',
        prepTime: p.prepTime || p.deliveryTime || '15-20 mins',
        stockCount: p.stock !== undefined ? Number(p.stock) : (p.stockCount !== undefined ? Number(p.stockCount) : 10),
        stock: p.stock !== undefined ? Number(p.stock) : (p.stockCount !== undefined ? Number(p.stockCount) : 10),
        inStock: p.inStock !== false && (p.stock === undefined || Number(p.stock) > 0),
        isVeg: p.isVeg !== undefined ? Boolean(p.isVeg) : true,
        discountPercentage: discountPercentage || 0,
        rating: Number(p.rating) || 4.8,
        reviewCount: Number(p.reviewCount) || 1,
        storeName: p.storeName || settings.storeName || 'BeeGo Store'
      };
    });

    res.json({
      success: true,
      store: {
        name: settings.storeName,
        tagline: settings.storeTagline,
        isOpen: settings.isOpen !== false,
        notice: settings.emergencyNotice || '',
        whatsapp: settings.whatsappNumber || '',
        cleanWhatsapp: settings.cleanWhatsapp || '',
        currency: settings.currency || '₹',
        defaultDeliveryFee: settings.defaultDeliveryFee || 20,
        freeDeliveryThreshold: settings.freeDeliveryThreshold || 199,
        avgDeliveryMinutes: settings.avgDeliveryMinutes || 30
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
      success: true,
      isOpen: settings.isOpen !== false,
      notice: settings.emergencyNotice || '',
      whatsapp: settings.whatsappNumber || '',
      storeName: settings.storeName
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/storefront/order - Submit order from storefront
router.post('/order', (req, res) => {
  try {
    const {
      items,
      customerName,
      customerPhone,
      address,
      deliveryAddress,
      grandTotal,
      itemTotal,
      deliveryFee,
      discount,
      paymentMethod,
      notes,
      deliveryInstructions,
      couponApplied,
      couponCode
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    // Normalize customer address
    const finalAddress = deliveryAddress || address || {
      fullAddress: 'Customer Delivery Address',
      city: 'Local Area',
      zipCode: ''
    };

    // Normalize items: support both CartItem structure ({ product, quantity }) and flat item
    const normalizedItems = items.map(item => {
      if (item.product) {
        return {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price) || 0,
          quantity: Number(item.quantity) || 1,
          unit: item.product.unit || '1 Unit',
          image: item.product.image || ''
        };
      }
      return {
        id: item.id || item.productId || 'item-' + Date.now(),
        name: item.name || 'Order Item',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        unit: item.unit || '1 Unit',
        image: item.image || ''
      };
    });

    const calculatedItemTotal = itemTotal !== undefined
      ? Number(itemTotal)
      : normalizedItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    const calculatedGrandTotal = grandTotal !== undefined
      ? Number(grandTotal)
      : Math.max(0, calculatedItemTotal + (Number(deliveryFee) || 0) - (Number(discount) || 0));

    const finalPhone = customerPhone || finalAddress.phone || '';
    const finalName = customerName || finalAddress.title || (finalPhone ? `Customer (${finalPhone.slice(-4)})` : 'Online Customer');

    const created = store.createOrder({
      customerName: finalName,
      customerPhone: finalPhone,
      address: finalAddress,
      items: normalizedItems,
      itemTotal: calculatedItemTotal,
      deliveryFee: Number(deliveryFee) || 0,
      discount: Number(discount) || 0,
      couponCode: couponCode || couponApplied || '',
      grandTotal: calculatedGrandTotal,
      paymentMethod: (paymentMethod || 'COD').toUpperCase(),
      paymentStatus: 'pending',
      orderStatus: 'pending',
      notes: notes || deliveryInstructions || ''
    });

    res.status(201).json({
      success: true,
      message: 'Order received successfully',
      orderNumber: created.orderNumber,
      order: created
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
