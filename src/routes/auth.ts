import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/email/verify', AuthController.verifyEmail);
router.post('/email/resend', AuthController.resendEmailVerificationLink);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/refresh-token', AuthController.refreshToken);

export default router;