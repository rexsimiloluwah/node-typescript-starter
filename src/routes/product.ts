import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth'
import ProductMiddleware from '../middlewares/product'
import ProductController from '../controllers/product.controller'
import {
  createProductSchema,
  updateProductSchema,
  getProductByIDSchema,
} from '../schema/product.schema'
import validateSchema from '../middlewares/validateSchema'

const router = Router()

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Product
 *
 *     summary: Fetch Products
 *     description: Fetch all products
 *
 *     responses:
 *       200:
 *         description: Successfully fetched all products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', ProductController.getProducts)

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Product
 *
 *     summary: Get Product By ID
 *     description: Returns a single product that matches the ID
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Product ID
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Successfully fetched product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', validateSchema(getProductByIDSchema), ProductController.getProductById)

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Product
 *
 *     summary: Create product
 *     description: Create a new product
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *
 *     responses:
 *       200:
 *         description: Successfully created a new product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateProductResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  validateSchema(createProductSchema),
  AuthMiddleware.requireSignIn,
  ProductController.createProduct,
)

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - Product
 *
 *     summary: Update Product
 *     description: Update an existing product
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductInput'
 *
 *     responses:
 *       200:
 *         description: Successfully updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProductResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/:id',
  validateSchema(updateProductSchema),
  AuthMiddleware.requireSignIn,
  ProductMiddleware.checkProductOwner,
  ProductController.updateProduct,
)

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Product
 *
 *     summary: Delete Product
 *     description: Delete an existing product from the database
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Successfully deleted product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/:id',
  validateSchema(getProductByIDSchema),
  AuthMiddleware.requireSignIn,
  ProductMiddleware.checkProductOwner,
  ProductController.deleteProduct,
)

export default router
