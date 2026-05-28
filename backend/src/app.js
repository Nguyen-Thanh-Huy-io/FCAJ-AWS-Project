require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routes - Auth Domain
const authRoutes = require('./routes/auth/auth.routes');
const profileRoutes = require('./routes/auth/profile.routes');

// Routes - Admin Domain
const pricingRoutes = require('./routes/admin/pricing.routes');
const auditLogRoutes = require('./routes/admin/audit-log.routes');
const revenueRoutes = require('./routes/admin/revenue.routes');
const productRoutes = require('./routes/admin/product.routes');

// Routes - Social Domain
const socialRoutes = require('./routes/social/social.routes');
const inboxRoutes = require('./routes/social/inbox.routes');

// Routes - Workspace Domain
const livestreamRoutes = require('./routes/workspace/livestream.routes');
const postRoutes = require('./routes/workspace/post.routes');
const mediaLibraryRoutes = require('./routes/workspace/media-library.routes');
const mediaFolderRoutes = require('./routes/workspace/media-folder.routes');
const teamRoutes = require('./routes/workspace/team.routes');
const brandRoutes = require('./routes/workspace/brand.routes');
const autoListRoutes = require('./routes/workspace/auto-list.routes');

// Routes - Core Domain
const searchRoutes = require('./routes/core/search.routes');
const notificationRoutes = require('./routes/core/notification.routes');

// BullMQ Dashboard
const queueDashboard = require('./queues/dashboard');

const app = express();

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CORS config - Allow local development origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Initialize Event Subscribers
require('./events/subscribers/post.subscriber')();
require('./events/subscribers/user.subscriber')();
require('./events/subscribers/autolist.subscriber')();

// Serve static files from uploads directory with CORS headers enabled
app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/admin/pricing', pricingRoutes);
app.use('/api/admin/audit-logs', auditLogRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/livestreams', livestreamRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/media', mediaLibraryRoutes);
app.use('/api/media-folders', mediaFolderRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/revenue', revenueRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/auto-lists', autoListRoutes);

// Mount Job Queue Dashboard (Visual Monitoring)
app.use('/admin/queues', queueDashboard.getRouter());

app.get('/', (req, res) => {
  res.send('PubliCast API is running');
});

// Global Error Handler - Must be last
const errorHandler = require('./middlewares/error-handler.middleware');
app.use(errorHandler);

module.exports = app;
