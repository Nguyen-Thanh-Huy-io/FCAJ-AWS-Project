require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const pricingRoutes = require('./routes/pricing.routes');
const auditLogRoutes = require('./routes/audit-log.routes');
const searchRoutes = require('./routes/search.routes');
const livestreamRoutes = require('./routes/livestream.routes');
const postRoutes = require('./routes/post.routes');
const mediaLibraryRoutes = require('./routes/media-library.routes');
const teamRoutes = require('./routes/team.routes');
const inboxRoutes = require('./routes/inbox.routes');
const notificationRoutes = require('./routes/notification.routes');
const revenueRoutes = require('./routes/revenue.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/admin/pricing', pricingRoutes);
app.use('/api/admin/audit-logs', auditLogRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/livestreams', livestreamRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/media', mediaLibraryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/revenue', revenueRoutes);
app.use('/api/admin/products', productRoutes);

app.get('/', (req, res) => {
  res.send('PubliCast API is running');
});

module.exports = app;
