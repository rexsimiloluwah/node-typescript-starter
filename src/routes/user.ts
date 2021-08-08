import { Router } from 'express';
import { requireSignIn } from '../middlewares/auth';
import { getUsers, getUser, getUserProfile, updateUserProfile, deleteUser } from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers);
router.get('/profile/:id', getUserProfile);
router.get('/profile', requireSignIn, getUser);
router.put('/', requireSignIn, updateUserProfile);
router.delete('/', requireSignIn, deleteUser);

export default router;
