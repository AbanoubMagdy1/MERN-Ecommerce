import express from 'express';
import {
  login,
  profile,
  register,
  updateProfile,
  getUsers,
  deleteUser,
  makeUserAdmin,
  resetPasswordEmail,
  resetPasswordConfirm,
} from '../controllers/userControllers.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/login').post(login);

router.route('/register').post(register);

router.route('/profile').get(protect, profile).put(protect, updateProfile);

router.route('/resetemail').post(resetPasswordEmail);

router.route('/resetconfirm').post(resetPasswordConfirm);

router
  .route('/:id')
  .put(protect, admin, makeUserAdmin)
  .delete(protect, admin, deleteUser);

router.route('/:page').get(protect, admin, getUsers);

export default router;
