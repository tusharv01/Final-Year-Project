import dotenv from 'dotenv';
import express from 'express';

import orderRoutes from './routes/orderRoutes.js';
import orderStatusLogRoutes from './routes/orderStatusLogRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Backend is live!');
});


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-status',orderStatusLogRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

