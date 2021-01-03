import express from 'express';
import {
  createOrder,
  getOrder,
  getAllOrders,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivred,
} from '../controllers/orderControllers.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder);

router.route('/all/:page').get(protect, admin, getAllOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrder);

router.route('/pay/:id').put(protect, updateOrderToPaid);

router.route('/deliver/:id').put(protect, admin, updateOrderToDelivred);

export default router;
