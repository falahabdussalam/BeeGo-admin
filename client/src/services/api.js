const BASE_URL = '/api';

async function fetchJson(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
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
