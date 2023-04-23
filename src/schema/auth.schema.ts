import { object, string, TypeOf } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterUserInput:
 *       type: object
 *       required:
 *        - email
 *        - name
 *        - password
 *        - phoneNumber
 *       properties:
 *         name:
 *           type: string
 *           description: User's Name
 *           example: John Doe
 *         email:
 *           type: string
 *           description: User's Email Address
 *           example: test-user@gmail.com
 *         password:
 *           type: string
 *           description: User's Password
 *           example: secret123
 *         phoneNumber:
 *           type: string
 *           description: User's Phone Number
 *           example: +2347085140175
 *         profile:
 *           type: object
 *           properties:
 *             picture:
 *               type: string
 *               description: User's Profile Picture URL
 *             country:
 *               type: string
 *               description: User's Country
 *               example: Nigeria
 *             facebook:
 *               type: string
 *               description: User's Facebook URL
 *             city:
 *               type: string
 *               description: User's City
 *               example: Lagos
 *             website:
 *               type: string
 *               description: User's Website URL
 *             twitter:
 *               type: string
 *               description: User's Twitter URL
 *             instagram:
 *               type: string
 *               description: User's Instagram URL
 *
 *     BaseUserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *           description: User Name
 *           example: John Doe
 *         email:
 *           type: string
 *           description: User Email Address
 *           example: test-user@gmail.com
 *         phoneNumber:
 *           type: string
 *           description: User Phone Number
 *           example: +2347085140175
 *         isEmailVerified:
 *           type: boolean
 *           description: User Email Verification Status
 *         role:
 *           type: string
 *           description: User Role
 *           enum: [user,admin]
 *         profile:
 *           type: object
 *           properties:
 *             picture:
 *               type: string
 *               description: User Profile Picture URL
 *             country:
 *               type: string
 *               description: User Country
 *               example: Nigeria
 *             facebook:
 *               type: string
 *               description: User Facebook URL
 *             city:
 *               type: string
 *               description: User City
 *               example: Lagos
 *             website:
 *               type: string
 *               description: User Website URL
 *             twitter:
 *               type: string
 *               description: User Twitter URL
 *             instagram:
 *               type: string
 *               description: User Instagram URL
 *
 *     RegisterUserResponse:
 *      allOf:
 *        - $ref: '#/components/schemas/SuccessResponse'
 *        - type: object
 *          properties:
 *            data:
 *              $ref: '#/components/schemas/BaseUserResponse'
 */
export const registerUserSchema = object({
  body: object({
    name: string({
      required_error: 'name is required',
      invalid_type_error: 'name must be a string',
    }),
    email: string({
      required_error: 'email is required',
      invalid_type_error: 'email must be a valid email address',
    }).email(),
    phoneNumber: string({
      required_error: 'phoneNumber is required',
      invalid_type_error: 'phoneNumber must be a valid',
    }).min(8, 'phoneNumber must have at least 8 digits'),
    password: string({
      required_error: 'password is required',
    }).min(8, 'password must contain at least 8 characters'),
    profile: object({
      country: string().optional(),
      city: string().optional(),
      picture: string().optional(),
      website: string().optional(),
      facebook: string().optional(),
      instagram: string().optional(),
      twitter: string().optional(),
      rating: string().optional(),
    }).optional(),
  }),
  params: object({}),
})

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginUserInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: User's Email address
 *           example: test-user@gmail.com
 *         password:
 *           type: string
 *           description: User's Password
 *           example: secret123
 *
 *     LoginUserResponse:
 *      allOf:
 *        - $ref: '#/components/schemas/SuccessResponse'
 *        - type: object
 *          properties:
 *            data:
 *              $ref: '#/components/schemas/BaseUserResponse'
 *            accessToken:
 *              type: string
 *              description: User's Access Token
 *            refreshToken:
 *              type: string
 *              description: User's Refresh Token
 */
export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: 'email is required',
    }).email(),
    password: string({
      required_error: 'password is required',
    }).min(8, 'password must contain at least 8 characters'),
  }),
  params: object({}),
})

export const verifyEmailSchema = object({
  query: object({
    token: string({
      required_error: 'email verification token is required',
    }),
  }),
})

/**
 * @openapi
 * components:
 *   schemas:
 *     ResendEmailVerificationInput:
 *       type: object
 *       required:
 *        - email
 *       properties:
 *         email:
 *           type: string
 */
export const resendEmailVerificationSchema = object({
  body: object({
    email: string({
      required_error: 'email is required',
    }).email(),
  }),
})

/**
 * @openapi
 * components:
 *   schemas:
 *     ForgotPasswordInput:
 *       type: object
 *       required:
 *        - email
 *       properties:
 *         email:
 *           type: string
 */
export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'email is required',
    }).email(),
  }),
})

/**
 * @openapi
 * components:
 *   schemas:
 *     ResetPasswordInput:
 *       type: object
 *       required:
 *        - newPassword
 *       properties:
 *         newPassword:
 *           type: string
 */
export const resetPasswordSchema = object({
  body: object({
    newPassword: string({
      required_error: 'newPassword is required',
    }).min(8, 'newPassword must contain at least 8 characters'),
  }),
  query: object({
    token: string({
      required_error: 'reset password token is required',
    }),
  }),
})

export type LoginUserInput = TypeOf<typeof loginUserSchema>
export type RegisterUserInput = TypeOf<typeof registerUserSchema>
export type VerifyEmailInput = TypeOf<typeof verifyEmailSchema>
export type ResendEmailVerificationInput = TypeOf<typeof resendEmailVerificationSchema>
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>
