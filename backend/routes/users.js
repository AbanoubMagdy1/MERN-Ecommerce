import express from 'express';
import {
  login,
  profile,
  register,
  updateProfile,
  resetPasswordEmail,
  resetPasswordConfirm,
} from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/login').post(login);

router.route('/register').post(register);

router.route('/profile').get(protect, profile).put(protect, updateProfile);

router.route('/resetemail').post(resetPasswordEmail);

router.route('/resetconfirm').post(resetPasswordConfirm);

export default router;
