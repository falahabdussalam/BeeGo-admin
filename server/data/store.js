const fs = require('fs');
const path = require('path');
const {
  initialCategories,
  initialProducts,
  initialCoupons,
  initialZones,
  initialRiders,
  initialOrders,
  initialSettings
} = require('./initialSeed');

const DATA_FILE = path.join(__dirname, 'store.json');

class Store {
  constructor() {
    this.data = {
      categories: [],
      products: [],
      coupons: [],
      zones: [],
      riders: [],
      orders: [],
      settings: {},
      activityLogs: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.data = JSON.parse(raw);
        console.log('📦 Loaded database from store.json');
      } else {
        this.resetToDefault();
      }
    } catch (err) {
      console.error('Error loading store.json, resetting to default:', err);
      this.resetToDefault();
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to persist store.json:', err);
    }
  }

  resetToDefault() {
    this.data = {
      categories: [...initialCategories],
      products: [...initialProducts],
      coupons: [...initialCoupons],
      zones: [...initialZones],
      riders: [...initialRiders],
      orders: [...initialOrders],
      settings: { ...initialSettings },
      activityLogs: [
        {
          id: 'log-1',
          action: 'Store Initialized',
          detail: 'Database seeded with Virajpete catalog & initial settings',
          timestamp: new Date().toISOString()
        }
      ]
    };
    this.save();
    console.log('✨ Seeded default store data.');
  }

  logActivity(action, detail) {
    const log = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      action,
      detail,
      timestamp: new Date().toISOString()
    };
    this.data.activityLogs.unshift(log);
    if (this.data.activityLogs.length > 100) {
      this.data.activityLogs.pop();
    }
    this.save();
  }

  // --- Products ---
  getProducts(filters = {}) {
    let list = [...this.data.products];
    if (filters.category && filters.category !== 'all') {
      list = list.filter(p => p.category === filters.category);
    }
    if (filters.inStock !== undefined) {
      const isInStock = filters.inStock === 'true' || filters.inStock === true;
      list = list.filter(p => p.inStock === isInStock);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(productData) {
    const newProduct = {
      id: productData.id || 'prod-' + Date.now(),
      name: productData.name || 'Untitled Item',
      category: productData.category || 'groceries',
      price: Number(productData.price) || 0,
      originalPrice: Number(productData.originalPrice) || Number(productData.price) || 0,
      unit: productData.unit || '1 Unit',
      stock: Number(productData.stock) || 10,
      inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
      isPopular: Boolean(productData.isPopular),
      rating: Number(productData.rating) || 4.8,
      reviewCount: Number(productData.reviewCount) || 1,
      badge: productData.badge || '',
      prepTime: productData.prepTime || '15-20 mins',
      description: productData.description || '',
      image: productData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.updateCategoryItemCount(newProduct.category);
    this.logActivity('Product Added', `Added product: ${newProduct.name}`);
    this.save();
    return newProduct;
  }

  updateProduct(id, updates) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const oldCategory = this.data.products[idx].category;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : this.data.products[idx].price,
      originalPrice: updates.originalPrice !== undefined ? Number(updates.originalPrice) : this.data.products[idx].originalPrice,
      stock: updates.stock !== undefined ? Number(updates.stock) : this.data.products[idx].stock,
      updatedAt: new Date().toISOString()
    };

    if (updates.category && updates.category !== oldCategory) {
      this.updateCategoryItemCount(oldCategory);
      this.updateCategoryItemCount(updates.category);
    }

    this.logActivity('Product Updated', `Updated product: ${this.data.products[idx].name}`);
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const removed = this.data.products.splice(idx, 1)[0];
    this.updateCategoryItemCount(removed.category);
    this.logActivity('Product Deleted', `Deleted product: ${removed.name}`);
    this.save();
    return true;
  }

  updateCategoryItemCount(categoryId) {
    const cat = this.data.categories.find(c => c.id === categoryId);
    if (cat) {
      cat.itemCount = this.data.products.filter(p => p.category === categoryId).length;
    }
  }

  // --- Categories ---
  getCategories() {
    // dynamically sync item counts
    this.data.categories.forEach(c => {
      c.itemCount = this.data.products.filter(p => p.category === c.id).length;
    });
    return this.data.categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  getCategoryById(id) {
    return this.data.categories.find(c => c.id === id);
  }

  createCategory(catData) {
    const id = catData.id || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      id,
      name: catData.name,
      icon: catData.icon || '📦',
      color: catData.color || 'from-emerald-500 to-teal-600',
      itemCount: 0,
      description: catData.description || '',
      bannerImage: catData.bannerImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      isActive: catData.isActive !== undefined ? Boolean(catData.isActive) : true,
      sortOrder: this.data.categories.length + 1
    };
    this.data.categories.push(newCat);
    this.logActivity('Category Created', `Created category: ${newCat.name}`);
    this.save();
    return newCat;
  }

  updateCategory(id, updates) {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = {
      ...this.data.categories[idx],
      ...updates
    };
    this.logActivity('Category Updated', `Updated category: ${this.data.categories[idx].name}`);
    this.save();
    return this.data.categories[idx];
  }

  deleteCategory(id) {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    const removed = this.data.categories.splice(idx, 1)[0];
    this.logActivity('Category Deleted', `Deleted category: ${removed.name}`);
    this.save();
    return true;
  }

  // --- Orders ---
  getOrders(filters = {}) {
    let list = [...this.data.orders];
    if (filters.status && filters.status !== 'all') {
      list = list.filter(o => o.orderStatus === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: orderData.id || `ord-${randomNum}`,
      orderNumber: orderData.orderNumber || `VP-${randomNum}`,
      customerName: orderData.customerName || 'Local Customer',
      customerPhone: orderData.customerPhone || '',
      address: orderData.address || {
        fullAddress: 'Virajpete Town',
        landmark: '',
        city: 'Virajpete',
        pincode: '571218'
      },
      items: orderData.items || [],
      itemTotal: Number(orderData.itemTotal) || 0,
      deliveryFee: Number(orderData.deliveryFee) || 0,
      discount: Number(orderData.discount) || 0,
      couponCode: orderData.couponCode || '',
      grandTotal: Number(orderData.grandTotal) || 0,
      paymentMethod: orderData.paymentMethod || 'COD',
      paymentStatus: orderData.paymentStatus || 'pending',
      orderStatus: orderData.orderStatus || 'pending',
      riderId: orderData.riderId || null,
      riderName: orderData.riderName || null,
      orderTime: new Date().toISOString(),
      notes: orderData.notes || ''
    };

    this.data.orders.unshift(newOrder);
    this.logActivity('New Order Received', `Order ${newOrder.orderNumber} for ₹${newOrder.grandTotal} by ${newOrder.customerName}`);
    this.save();
    return newOrder;
  }

  updateOrderStatus(id, status, extra = {}) {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.orderStatus = status;
    if (extra.riderId) order.riderId = extra.riderId;
    if (extra.riderName) order.riderName = extra.riderName;
    if (extra.paymentStatus) order.paymentStatus = extra.paymentStatus;
    order.updatedAt = new Date().toISOString();

    this.logActivity('Order Status Updated', `Order ${order.orderNumber} status changed to ${status}`);
    this.save();
    return order;
  }

  // --- Coupons ---
  getCoupons() {
    return this.data.coupons;
  }

  createCoupon(cpData) {
    const newCoupon = {
      id: 'cp-' + Date.now(),
      code: cpData.code.toUpperCase().trim(),
      discountType: cpData.discountType || 'percentage',
      discountValue: Number(cpData.discountValue) || 10,
      minOrderValue: Number(cpData.minOrderValue) || 0,
      maxDiscount: Number(cpData.maxDiscount) || 100,
      description: cpData.description || '',
      expiryDate: cpData.expiryDate || '2026-12-31',
      isActive: cpData.isActive !== undefined ? Boolean(cpData.isActive) : true,
      usageCount: 0
    };
    this.data.coupons.push(newCoupon);
    this.logActivity('Coupon Created', `Created coupon: ${newCoupon.code}`);
    this.save();
    return newCoupon;
  }

  updateCoupon(id, updates) {
    const idx = this.data.coupons.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.coupons[idx] = {
      ...this.data.coupons[idx],
      ...updates
    };
    this.logActivity('Coupon Updated', `Updated coupon: ${this.data.coupons[idx].code}`);
    this.save();
    return this.data.coupons[idx];
  }

  deleteCoupon(id) {
    const idx = this.data.coupons.findIndex(c => c.id === id);
    if (idx === -1) return false;
    const removed = this.data.coupons.splice(idx, 1)[0];
    this.logActivity('Coupon Deleted', `Deleted coupon: ${removed.code}`);
    this.save();
    return true;
  }

  // --- Zones & Riders ---
  getZones() {
    return this.data.zones;
  }

  updateZone(id, updates) {
    const idx = this.data.zones.findIndex(z => z.id === id);
    if (idx === -1) return null;
    this.data.zones[idx] = { ...this.data.zones[idx], ...updates };
    this.save();
    return this.data.zones[idx];
  }

  getRiders() {
    return this.data.riders;
  }

  createRider(riderData) {
    const newRider = {
      id: 'rider-' + Date.now(),
      name: riderData.name,
      phone: riderData.phone,
      vehicle: riderData.vehicle || 'Bike',
      status: riderData.status || 'available',
      zone: riderData.zone || 'Virajpete Clock Tower & Main Bazaar',
      rating: 5.0,
      completedOrders: 0
    };
    this.data.riders.push(newRider);
    this.logActivity('Rider Added', `Added delivery rider: ${newRider.name}`);
    this.save();
    return newRider;
  }

  updateRider(id, updates) {
    const idx = this.data.riders.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.riders[idx] = { ...this.data.riders[idx], ...updates };
    this.save();
    return this.data.riders[idx];
  }

  // --- Settings ---
  getSettings() {
    return this.data.settings;
  }

  updateSettings(updates) {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.logActivity('Settings Updated', 'Store configuration & live settings updated');
    this.save();
    return this.data.settings;
  }

  // --- Analytics & Summary ---
  getAnalytics() {
    const orders = this.data.orders;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered');
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.orderStatus)).length;
    const totalProducts = this.data.products.length;
    const outOfStockCount = this.data.products.filter(p => !p.inStock || p.stock <= 0).length;

    // Category distribution
    const categorySales = {};
    orders.forEach(o => {
      o.items?.forEach(item => {
        const prod = this.data.products.find(p => p.id === item.id);
        const cat = prod ? prod.category : 'other';
        categorySales[cat] = (categorySales[cat] || 0) + (item.quantity * item.price);
      });
    });

    // Recent 7 days revenue (mock aggregated with actual)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueByDay = days.map((day, idx) => {
      const dayOrders = orders.filter(o => new Date(o.orderTime).getDay() === idx);
      const dayRev = dayOrders.reduce((sum, o) => sum + o.grandTotal, 0);
      return {
        day,
        revenue: dayRev || Math.floor(1800 + Math.random() * 2400),
        orders: dayOrders.length || Math.floor(5 + Math.random() * 8)
      };
    });

    return {
      totalRevenue,
      totalOrders: orders.length,
      deliveredOrdersCount: deliveredOrders.length,
      pendingOrdersCount: pendingOrders,
      totalProducts,
      outOfStockCount,
      activeCouponsCount: this.data.coupons.filter(c => c.isActive).length,
      averageOrderValue: orders.length ? Math.round(orders.reduce((sum, o) => sum + o.grandTotal, 0) / orders.length) : 0,
      revenueByDay,
      categorySales,
      recentActivity: this.data.activityLogs.slice(0, 10)
    };
  }

  // Full DB backup & restore
  getBackup() {
    return this.data;
  }

  restoreBackup(backupData) {
    if (!backupData || !backupData.products || !backupData.categories) {
      throw new Error('Invalid backup schema');
    }
    this.data = backupData;
    this.save();
    this.logActivity('Database Restored', 'Restored database from uploaded backup');
    return true;
  }
}

const storeInstance = new Store();
module.exports = storeInstance;
