import express from 'express';
import {
  getProducts,
  getTopProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  createReview,
} from '../controllers/productControllers.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);

router.route('/top').get(getTopProducts);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProductById)
  .delete(protect, admin, deleteProductById);

router.route('/:id/review').post(protect, createReview);

export default router;
