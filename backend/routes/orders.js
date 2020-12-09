import express from 'express';
import {
  createOrder,
  getOrder,
  getMyOrders,
  updateOrderToPaid,
} from '../controllers/orderControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrder);

router.route('/pay/:id').put(protect, updateOrderToPaid);

export default router;
