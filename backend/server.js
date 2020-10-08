import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import confifDB from './services/db.js';
import colors from 'colors';
import { notFound, errorHandler } from './middleware/errorHandling.js';
import productsRoutes from './routes/products.js';

confifDB();

const app = express();
const port = process.env.PORT;

app.use('/api/products', productsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, console.log(`Server is running at ${port}`.green.bold));
