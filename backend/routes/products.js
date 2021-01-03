import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from '../controllers/productControllers.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProductById)
  .delete(protect, admin, deleteProductById);
export default router;
