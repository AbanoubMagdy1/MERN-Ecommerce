import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc   Create new order
// @api    POST api/orders/
// @access Private

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (orderItems.length === 0) {
    res.status(400);
    throw new Error("You don't have any products");
  }
  const order = await Order.create({
    orderItems,
    shippingAddress,
    paymentMethod,
    user: req.user._id,
  });
  for (let item of order.orderItems) {
    const product = await Product.findById(item.id);
    item.image = product.image;
    item.price = product.price;
    item.name = product.name;
  }
  order.itemsPrice = Number(
    order.orderItems
      .reduce((acc, cur) => acc + cur.price * cur.qty, 0)
      .toFixed(2)
  );
  order.shippingPrice = order.itemsPrice > 100 ? 0 : 10;
  order.taxPrice = Number((order.itemsPrice * 0.15).toFixed(2));
  order.totalPrice = order.itemsPrice + order.shippingPrice + order.taxPrice;
  await order.save();
  res.json(order._id);
});

// @desc   Get order by id
// @api    GET api/orders/:id
// @access Private

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  console.log(typeof req.user._id, typeof order.user._id);
  if (order && order.user._id.equals(req.user._id)) {
    res.json(order);
  } else if (!order) {
    res.status(404);
    throw new Error('Order not found');
  } else {
    res.status(401);
    throw new Error('You are not the owner of this order');
  }
});
