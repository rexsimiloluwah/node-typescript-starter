import { Router } from 'express';
import { requireSignIn } from '../middlewares/auth';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireSignIn, createProduct);
router.put('/:id', requireSignIn, updateProduct);
router.delete('/:id', requireSignIn, deleteProduct);

export default router;
