import express from 'express';
import {
  login,
  profile,
  register,
  updateProfile,
} from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/login').post(login);

router.route('/register').post(register);

router.route('/profile').get(protect, profile).put(protect, updateProfile);

export default router;
