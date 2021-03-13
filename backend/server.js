import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import confifDB from './services/db.js';
import morgan from 'morgan';
import path from 'path';
import colors from 'colors';
import { notFound, errorHandler } from './middleware/errorHandling.js';
import productsRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import uploadRoutes from './routes/upload.js';

confifDB();

const app = express();
const port = process.env.PORT;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.json(process.env.PAYPAL_CLIENT_API)
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, console.log(`Server is running at ${port}`.green.bold));
