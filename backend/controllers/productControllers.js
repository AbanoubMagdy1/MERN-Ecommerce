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
    .limit(perPage)
    .select('name price image rating _id numReviews');
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

// @desc   update one product by id
// @api    PUT api/products/:id
// @access Admin

export const updateProductById = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    await product.save();
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc   delete one product by id
// @api    DELETE api/products/:id
// @access Admin

export const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.send(`${product.name} deleted successfully`);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc   Create new product
// @api    POST api/products/
// @access Admin

export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    description: 'Sample description',
    price: 0,
    countInStock: 0,
    brand: 'Sample brand',
    category: 'Sample category',
    image: '/images/sample.png',
    user: req.user._id,
    rating: 0,
    numReviews: 0,
  });
  const createdProduct = await product.save();
  res.json(createdProduct);
});

// @desc   Create or update a review
// @api    POST api/products/:id/review
// @access Admin

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const myReview = product.reviews.find(r => r.user.equals(req.user._id));
    if (myReview) {
      myReview.rating = rating;
      myReview.comment = comment;
    } else {
      const newReview = {
        user: req.user._id,
        name: req.user.name,
        rating: +rating,
        comment,
      };
      product.reviews.push(newReview);
    }
    product.numReviews = product.reviews.length;
    product.rating = +(
      product.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
      product.reviews.length
    ).toFixed(1);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
