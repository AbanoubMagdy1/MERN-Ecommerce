import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find({}).select(
    '_id name rating numReviews price image'
  );
  res.send(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.send(product);
});

export default router;
