import { Router } from 'express'
import AuthController from '../controllers/auth.controller'
import {
  loginUserSchema,
  registerUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendEmailVerificationSchema,
  verifyEmailSchema,
} from '../schema/auth.schema'
import validateSchema from '../middlewares/validateSchema'

const router = Router()

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *
 *     summary: Register User
 *     description: Register a new user
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserInput'
 *
 *     responses:
 *       201:
 *         description: User Registered Successfully
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
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', validateSchema(registerUserSchema), AuthController.registerUser)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *
 *     summary: Login User
 *     description: Login an existing user
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
router.post('/login', validateSchema(loginUserSchema), AuthController.loginUser)

/**
 * @openapi
 * /email/verify:
 *   post:
 *     tags:
 *       - Auth
 *
 *     summary: Verify Email
 *     description: Verify a user's email address
 *
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Email verification token
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Email verification successful
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
router.post('/email/verify', validateSchema(verifyEmailSchema), AuthController.verifyEmail)

/**
 * @openapi
 * /email/resend:
 *   post:
 *     tags:
 *       - Auth
 *
 *     summary: Resend Email Verification Token
 *     description: Resend Email Verification Token
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/ResendEmailVerificationInput'
 *
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Email verification token
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Email Verification Link Re-sent Successfully
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
 *
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/email/resend',
  validateSchema(resendEmailVerificationSchema),
  AuthController.resendEmailVerificationLink,
)

/**
 * @openapi
 * /email/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *
 *     summary: Forgot Password
 *     description: Send Password Reset Link
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *
 *     responses:
 *       200:
 *         description: Reset Password Link Sent Successfully
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
router.post('/forgot-password', validateSchema(forgotPasswordSchema), AuthController.forgotPassword)

/**
 * @openapi
 * /email/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *
 *     summary: Reset Password
 *     description: Reset User's Password
 *
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Reset password token
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/ResetPasswordInput'
 *
 *     responses:
 *       200:
 *         description: Password reset successful
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
router.post('/reset-password', validateSchema(resetPasswordSchema), AuthController.resetPassword)

/**
 * @openapi
 * /refresh-token:
 *   get:
 *     tags:
 *       - Auth
 *
 *     summary: Refresh Token
 *     description: Refresh access token
 *
 *     parameters:
 *       - in: query
 *         name: refreshToken
 *         required: true
 *         description: Refresh token
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Token Refreshed Successfully
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
router.get('/refresh-token', AuthController.refreshToken)

export default router
