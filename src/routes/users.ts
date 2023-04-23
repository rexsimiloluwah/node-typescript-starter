import { Router } from 'express'
import UserController from '../controllers/user.controller'
import validateSchema from '../middlewares/validateSchema'
import { getUserByIDSchema } from '../schema/user.schema'

const router = Router()

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *
 *     summary: Return all users
 *     description: Return all the registered and active users
 *
 *     responses:
 *       200:
 *         description: Successfully returned all users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
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
router.get('/', UserController.getUsers)

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *
 *     summary: Return a user by ID
 *     description: Return the user that matches the specified ID
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
 *         description: Successfully fetched user
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
 *       404:
 *         description: User not found
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
router.get('/:id', validateSchema(getUserByIDSchema), UserController.getUserProfile)

export default router
