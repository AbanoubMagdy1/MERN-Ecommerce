import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import confifDB from './services/db.js';
import colors from 'colors';
import { notFound, errorHandler } from './middleware/errorHandling.js';
import productsRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';

confifDB();

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use('/api/products', productsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.json(process.env.PAYPAL_CLIENT_API)
);

app.use(notFound);
app.use(errorHandler);

app.listen(port, console.log(`Server is running at ${port}`.green.bold));
