import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import ProductController from '../controllers/product.controller';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', AuthMiddleware.requireSignIn, ProductController.createProduct);
router.put('/:id', AuthMiddleware.requireSignIn, ProductController.updateProduct);
router.delete('/:id', AuthMiddleware.requireSignIn, ProductController.deleteProduct);

export default router;
