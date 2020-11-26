import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc   get all prodcuts
// @api    GET api/products/
// @access Public

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).select(
    '_id name rating numReviews price image'
  );
  res.send(products);
});

// @desc   get one product by id
// @api    GET api/products/:id
// @access Public

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
