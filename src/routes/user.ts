import { Router } from 'express'
import AuthMiddleware from '../middlewares/auth'
import UserController from '../controllers/user.controller'
import validateSchema from '../middlewares/validateSchema'
import { updateUserSchema } from '../schema/user.schema'

const router = Router()

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - User
 *
 *     summary: Get the authenticated user
 *     description: Returns the authenticated user
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Successfully fetched user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterUserResponse'
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
router.get('/', AuthMiddleware.requireSignIn, UserController.getAuthUser)

/**
 * @openapi
 * /user:
 *   put:
 *     tags:
 *       - User
 *
 *     summary: Update user
 *     description: Update the authenticated user's account information
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *
 *     responses:
 *       200:
 *         description: Successfully updated user account
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
router.put(
  '/',
  AuthMiddleware.requireSignIn,
  validateSchema(updateUserSchema),
  UserController.updateUserProfile,
)

/**
 * @openapi
 * /user:
 *   delete:
 *     tags:
 *       - User
 *
 *     summary: Delete the authenticated user
 *     description: Delete the authenticated user's account from the database
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Successfully deleted user account
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
router.delete('/', AuthMiddleware.requireSignIn, UserController.deleteUser)

export default router
