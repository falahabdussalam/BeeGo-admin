const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'beego-api-key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Import API routes
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const couponsRouter = require('./routes/coupons');
const zonesRouter = require('./routes/zones');
const settingsRouter = require('./routes/settings');
const analyticsRouter = require('./routes/analytics');
const storefrontRouter = require('./routes/storefront');

// Register API routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/zones', zonesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/storefront', storefrontRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'BeeGo Virajpete Admin & Backend API',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

// Serve frontend in production if built
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api/')) return next();
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send(`
        <html>
          <head><title>BeeGo Admin API</title><style>body{font-family:sans-serif;padding:40px;background:#0d1117;color:#fff;text-align:center;}</style></head>
          <body>
            <h1>🐝 BeeGo Admin API is Running on Port ${PORT}</h1>
            <p>API Root: <a style="color:#eab308" href="/api/health">/api/health</a></p>
            <p>Storefront Catalog: <a style="color:#eab308" href="/api/storefront/catalog">/api/storefront/catalog</a></p>
          </body>
        </html>
      `);
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  ======================================================
  🐝  BEEGO ADMIN & BACKEND SERVER RUNNING
  ======================================================
  📡  API Base URL:       http://localhost:${PORT}/api
  🌐  Storefront Catalog: http://localhost:${PORT}/api/storefront/catalog
  📊  Health Check:       http://localhost:${PORT}/api/health
  ======================================================
  `);
});
