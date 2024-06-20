import express from 'express';
import {
  registerUser,
  sendConfirmationEmail,
  confirmUserEmail,
  login,
  logout,
  getCurrentUser,
} from '../controllers/auth.controller';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', login);
router.get('/logout', logout);
router.get('/current-user', getCurrentUser);

// Email confirmation routes
router.post('/send-confirmation', sendConfirmationEmail);
router.get('/confirm/:token', confirmUserEmail);

export default router;
