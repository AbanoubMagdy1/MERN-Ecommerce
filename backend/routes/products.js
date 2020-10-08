import express from 'express';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({}).select(
      '_id name rating numReviews price image'
    );
    res.send(products);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

export default router;
