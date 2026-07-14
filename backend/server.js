import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import storeRoutes from './routes/store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// (Stripe webhook removed)

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/store', storeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'Street Ritual', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🔥 Street Ritual backend running on port ${PORT}`);
});
