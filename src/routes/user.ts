import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import UserController from '../controllers/user.controller';

const router = Router();

router.get('/', UserController.getUsers);
router.get('/profile/:id', UserController.getUserProfile);
router.get('/profile', AuthMiddleware.requireSignIn, UserController.getUser);
router.put('/', AuthMiddleware.requireSignIn, UserController.updateUserProfile);
router.delete('/', AuthMiddleware.requireSignIn, UserController.deleteUser);

export default router;
