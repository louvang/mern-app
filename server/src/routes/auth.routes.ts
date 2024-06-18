import express from 'express';
import {
  registerUser,
  login,
  logout,
  getCurrentUser,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/logout', logout);
router.get('/current-user', getCurrentUser);

export default router;
