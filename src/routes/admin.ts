import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import AdminController from '../controllers/admin.controller';

const router = Router();

router.post('/login', AdminController.loginAdmin);
router.post('/ban-user/:id', AuthMiddleware.requireSignIn, AuthMiddleware.requireAdmin, AdminController.banUser);

export default router;
