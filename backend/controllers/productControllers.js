import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc   get all prodcuts
// @api    GET api/products
// @access Public

export const getProducts = asyncHandler(async (req, res) => {
  const page = +req.query.page;
  const perPage = +req.query.perpage;
  const products = await Product.find({})
    .skip((page - 1) * perPage)
    .limit(perPage);
  const numOfProducts = await Product.countDocuments();
  res.json({ products, numOfPages: Math.ceil(numOfProducts / perPage) });
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
