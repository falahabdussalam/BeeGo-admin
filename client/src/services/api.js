// Robust API Client with auto-retry, direct backend fallback, and offline localStorage persistence

const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food & Kitchen', icon: '🍔', itemCount: 0, isActive: true },
  { id: 'groceries', name: 'Groceries', icon: '🛒', itemCount: 0, isActive: true },
  { id: 'medicines', name: 'Medicines & Health', icon: '💊', itemCount: 0, isActive: true },
  { id: 'fruits-vegetables', name: 'Fruits & Veggies', icon: '🥦', itemCount: 0, isActive: true },
  { id: 'coorg-specials', name: 'Coorg Specials', icon: '☕', itemCount: 0, isActive: true },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', itemCount: 0, isActive: true },
  { id: 'bakery', name: 'Bakery & Snacks', icon: '🥐', itemCount: 0, isActive: true },
  { id: 'beverages', name: 'Beverages & Drinks', icon: '🧃', itemCount: 0, isActive: true },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴', itemCount: 0, isActive: true },
  { id: 'household', name: 'Household Needs', icon: '🧹', itemCount: 0, isActive: true }
];

const DEFAULT_SETTINGS = {
  storeName: 'BeeGo Store',
  storeTagline: 'Fast & Reliable Online Ordering',
  isOpen: true,
  emergencyNotice: '',
  whatsappNumber: '',
  cleanWhatsapp: '',
  contactEmail: 'admin@beego.com',
  address: '',
  currency: '₹',
  defaultDeliveryFee: 20,
  freeDeliveryThreshold: 199,
  avgDeliveryMinutes: 30,
  maxDeliveryRadiusKm: 10,
  operatingHours: '08:00 AM - 10:00 PM',
  allowCod: true,
  allowUpi: true,
  enableSoundAlerts: true,
  autoConfirmOrders: false
};

// LocalStorage Offline Storage Fallback
const offline = {
  get(key, fallback = []) {
    try {
      const val = localStorage.getItem(`beego_admin_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(`beego_admin_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }
};

function getPrimaryBaseUrl() {
  if (typeof window !== 'undefined') {
    if (import.meta.env?.VITE_API_URL) {
      return `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`;
    }
    if (window.location.protocol === 'file:') {
      return 'http://localhost:5000/api';
    }
  }
  return '/api';
}

async function fetchJson(path, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const primaryUrl = `${getPrimaryBaseUrl()}${path}`;
  const directUrl = `http://localhost:5000/api${path}`;

  let response;
  let networkError = null;

  // 1. Try primary URL (usually /api with Vite proxy or custom VITE_API_URL)
  try {
    response = await fetch(primaryUrl, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers }
    });
  } catch (err) {
    networkError = err;
  }

  // 2. If primary failed or returned proxy error (502/504), try direct localhost:5000 fallback
  if ((!response || response.status === 502 || response.status === 504) && primaryUrl !== directUrl) {
    try {
      response = await fetch(directUrl, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers }
      });
      networkError = null;
    } catch (err) {
      networkError = err;
    }
  }

  // 3. If response was received
  if (response) {
    let data;
    try {
      data = await response.json();
    } catch {
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status} (${response.statusText}). Please check that the backend server is running on port 5000.`);
      }
      throw new Error('Received non-JSON response from server');
    }

    if (!response.ok) {
      throw new Error(data?.message || `Request failed with status ${response.status}`);
    }

    return data;
  }

  // 4. Server completely unreachable -> Handle seamlessly via offline storage
  console.warn(`[BeeGo API] Server offline (${networkError?.message || 'Connection refused'}). Operating in offline persistence mode.`);
  return handleOfflineFallback(path, options);
}

// Seamless offline fallback handler
function handleOfflineFallback(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // --- Products ---
  if (path.startsWith('/products')) {
    let prods = offline.get('products', []);
    if (method === 'GET') {
      return { success: true, count: prods.length, data: prods };
    }
    if (method === 'POST') {
      const newProd = {
        ...body,
        id: body.id || 'prod-' + Date.now(),
        createdAt: new Date().toISOString()
      };
      prods = [newProd, ...prods];
      offline.set('products', prods);
      return { success: true, message: 'Product saved locally (Offline mode)', data: newProd };
    }
    if (method === 'PUT' || method === 'PATCH') {
      const id = path.split('/')[2];
      const idx = prods.findIndex(p => p.id === id);
      if (idx !== -1) {
        prods[idx] = { ...prods[idx], ...body, updatedAt: new Date().toISOString() };
        offline.set('products', prods);
        return { success: true, message: 'Product updated locally', data: prods[idx] };
      }
      return { success: false, message: 'Product not found' };
    }
    if (method === 'DELETE') {
      const id = path.split('/')[2];
      prods = prods.filter(p => p.id !== id);
      offline.set('products', prods);
      return { success: true, message: 'Product removed locally' };
    }
  }

  // --- Categories ---
  if (path.startsWith('/categories')) {
    let cats = offline.get('categories', DEFAULT_CATEGORIES);
    if (method === 'GET') {
      return { success: true, count: cats.length, data: cats };
    }
    if (method === 'POST') {
      const newCat = {
        ...body,
        id: body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        isActive: true
      };
      cats = [...cats, newCat];
      offline.set('categories', cats);
      return { success: true, message: 'Category saved locally', data: newCat };
    }
    if (method === 'PUT') {
      const id = path.split('/')[2];
      cats = cats.map(c => c.id === id ? { ...c, ...body } : c);
      offline.set('categories', cats);
      return { success: true, message: 'Category updated locally', data: cats.find(c => c.id === id) };
    }
    if (method === 'DELETE') {
      const id = path.split('/')[2];
      cats = cats.filter(c => c.id !== id);
      offline.set('categories', cats);
      return { success: true, message: 'Category removed locally' };
    }
  }

  // --- Settings ---
  if (path.startsWith('/settings')) {
    let sett = offline.get('settings', DEFAULT_SETTINGS);
    if (method === 'GET') {
      return { success: true, data: sett };
    }
    if (method === 'PUT') {
      sett = { ...sett, ...body };
      offline.set('settings', sett);
      return { success: true, message: 'Settings saved locally', data: sett };
    }
    if (path.includes('/clear')) {
      offline.set('products', []);
      offline.set('orders', []);
      offline.set('coupons', []);
      offline.set('zones', []);
      offline.set('riders', []);
      return { success: true, message: 'Local store data cleared' };
    }
    if (path.includes('/reset')) {
      offline.set('settings', DEFAULT_SETTINGS);
      offline.set('categories', DEFAULT_CATEGORIES);
      return { success: true, message: 'Reset to defaults' };
    }
  }

  // --- Orders ---
  if (path.startsWith('/orders')) {
    let ords = offline.get('orders', []);
    if (method === 'GET') {
      return { success: true, count: ords.length, data: ords };
    }
    if (method === 'POST') {
      const newOrd = {
        ...body,
        id: `ord-${Date.now()}`,
        orderNumber: `VP-${Math.floor(1000 + Math.random() * 9000)}`,
        orderStatus: 'pending',
        orderTime: new Date().toISOString()
      };
      ords = [newOrd, ...ords];
      offline.set('orders', ords);
      return { success: true, orderNumber: newOrd.orderNumber, data: newOrd };
    }
    if (method === 'PATCH' || method === 'PUT') {
      const id = path.split('/')[2];
      ords = ords.map(o => (o.id === id || o.orderNumber === id) ? { ...o, ...body } : o);
      offline.set('orders', ords);
      return { success: true, message: 'Order status updated locally' };
    }
  }

  // --- Coupons ---
  if (path.startsWith('/coupons')) {
    let cpn = offline.get('coupons', []);
    if (method === 'GET') {
      return { success: true, count: cpn.length, data: cpn };
    }
    if (method === 'POST') {
      const newCpn = { ...body, id: `cp-${Date.now()}`, isActive: true };
      cpn = [newCpn, ...cpn];
      offline.set('coupons', cpn);
      return { success: true, message: 'Coupon saved locally', data: newCpn };
    }
    if (method === 'DELETE') {
      const id = path.split('/')[2];
      cpn = cpn.filter(c => c.id !== id);
      offline.set('coupons', cpn);
      return { success: true, message: 'Coupon removed' };
    }
  }

  // --- Zones & Riders ---
  if (path.startsWith('/zones')) {
    let zones = offline.get('zones', []);
    let riders = offline.get('riders', []);
    if (path.includes('riders')) {
      if (method === 'GET') return { success: true, data: riders };
      if (method === 'POST') {
        const newRider = { ...body, id: `rdr-${Date.now()}` };
        riders = [...riders, newRider];
        offline.set('riders', riders);
        return { success: true, message: 'Rider added locally', data: newRider };
      }
      if (method === 'DELETE') {
        const id = path.split('/').pop();
        riders = riders.filter(r => r.id !== id);
        offline.set('riders', riders);
        return { success: true, message: 'Rider removed' };
      }
    }
    if (method === 'GET') return { success: true, data: zones };
    if (method === 'POST') {
      const newZone = { ...body, id: `zone-${Date.now()}`, isActive: true };
      zones = [...zones, newZone];
      offline.set('zones', zones);
      return { success: true, message: 'Zone added locally', data: newZone };
    }
    if (method === 'DELETE') {
      const id = path.split('/').pop();
      zones = zones.filter(z => z.id !== id);
      offline.set('zones', zones);
      return { success: true, message: 'Zone removed' };
    }
  }

  // --- Analytics ---
  if (path.startsWith('/analytics')) {
    const prods = offline.get('products', []);
    const ords = offline.get('orders', []);
    const totalRev = ords.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);
    return {
      success: true,
      data: {
        totalRevenue: totalRev,
        totalOrders: ords.length,
        totalProducts: prods.length,
        averageOrderValue: ords.length ? Math.round(totalRev / ords.length) : 0,
        recentOrders: ords.slice(0, 5),
        revenueTrend: []
      }
    };
  }

  // --- Storefront Catalog ---
  if (path.startsWith('/storefront/catalog')) {
    const prods = offline.get('products', []);
    const cats = offline.get('categories', DEFAULT_CATEGORIES);
    const sett = offline.get('settings', DEFAULT_SETTINGS);
    const cpn = offline.get('coupons', []);
    const zones = offline.get('zones', []);
    return {
      success: true,
      store: sett,
      categories: cats,
      products: prods,
      coupons: cpn,
      zones
    };
  }

  return { success: true, message: 'Operation completed in offline mode' };
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => fetchJson(`/products/${id}`),
  createProduct: (product) => fetchJson('/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProduct: (id, product) => fetchJson(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
  updateProductStock: (id, stockData) => fetchJson(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify(stockData) }),
  deleteProduct: (id) => fetchJson(`/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => fetchJson('/categories'),
  getCategory: (id) => fetchJson(`/categories/${id}`),
  createCategory: (cat) => fetchJson('/categories', { method: 'POST', body: JSON.stringify(cat) }),
  updateCategory: (id, cat) => fetchJson(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(cat) }),
  deleteCategory: (id) => fetchJson(`/categories/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/orders${query ? `?${query}` : ''}`);
  },
  getOrder: (id) => fetchJson(`/orders/${id}`),
  createOrder: (order) => fetchJson('/orders', { method: 'POST', body: JSON.stringify(order) }),
  updateOrderStatus: (id, status, extra = {}) => fetchJson(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, ...extra })
  }),
  getOrderWhatsAppLinks: (id) => fetchJson(`/orders/${id}/whatsapp-links`),

  // Coupons
  getCoupons: () => fetchJson('/coupons'),
  createCoupon: (coupon) => fetchJson('/coupons', { method: 'POST', body: JSON.stringify(coupon) }),
  updateCoupon: (id, coupon) => fetchJson(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(coupon) }),
  deleteCoupon: (id) => fetchJson(`/coupons/${id}`, { method: 'DELETE' }),

  // Zones & Riders
  getZones: () => fetchJson('/zones'),
  createZone: (zone) => fetchJson('/zones', { method: 'POST', body: JSON.stringify(zone) }),
  updateZone: (id, zone) => fetchJson(`/zones/${id}`, { method: 'PUT', body: JSON.stringify(zone) }),
  deleteZone: (id) => fetchJson(`/zones/${id}`, { method: 'DELETE' }),
  getRiders: () => fetchJson('/zones/riders/list'),
  createRider: (rider) => fetchJson('/zones/riders', { method: 'POST', body: JSON.stringify(rider) }),
  updateRider: (id, rider) => fetchJson(`/zones/riders/${id}`, { method: 'PUT', body: JSON.stringify(rider) }),
  deleteRider: (id) => fetchJson(`/zones/riders/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => fetchJson('/settings'),
  updateSettings: (settings) => fetchJson('/settings', { method: 'PUT', body: JSON.stringify(settings) }),
  restoreBackup: (backupData) => fetchJson('/settings/backup/restore', { method: 'POST', body: JSON.stringify(backupData) }),
  clearStore: () => fetchJson('/settings/clear', { method: 'POST' }),
  resetStore: () => fetchJson('/settings/reset', { method: 'POST' }),

  // Analytics
  getAnalytics: () => fetchJson('/analytics'),

  // Storefront Integration
  getStorefrontCatalog: () => fetchJson('/storefront/catalog')
};
