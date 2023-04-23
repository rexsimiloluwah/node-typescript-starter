import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth'
import AdminController from '../controllers/admin.controller'
import { getUserByIDSchema } from '../schema/user.schema'
import validateSchema from '../middlewares/validateSchema'

const router = Router()

/**
 * @openapi
 * /admin/login:
 *   post:
 *     tags:
 *      - Admin
 *
 *     summary: Login Admin
 *     description: Login an Admin
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserResponse'
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
router.post('/login', AdminController.loginAdmin)

/**
 * @openapi
 * /admin/ban-user/{id}:
 *   post:
 *     tags:
 *       - Admin
 *
 *     summary: Ban a user
 *     description: Ban a user
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: User Banned Successfully!
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
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/ban-user/:id',
  validateSchema(getUserByIDSchema),
  AuthMiddleware.requireSignIn,
  AuthMiddleware.requireAdmin,
  AdminController.banUser,
)

export default router
