import { object, number, string, TypeOf, boolean } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *           description: User's New Name
 *         email:
 *           type: string
 *           example: test-user@gmail.com
 *           description: User's New Email Address
 *         phoneNumber:
 *           type: string
 *           example: +2347085140175
 *           description: User's New Phone Number
 *
 *     UsersResponse:
 *      allOf:
 *       - $ref: '#/components/schemas/SuccessResponse'
 *       - type: object
 *         properties:
 *           data:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/BaseUserResponse'
 */
export const updateUserSchema = object({
  body: object({
    name: string().optional(),
    email: string().optional(),
    phoneNumber: string().optional(),
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
})

export const getUserByIDSchema = object({
  params: object({
    id: string({
      required_error: 'user ID is required',
    }),
  }),
})

export type UpdateUserInput = TypeOf<typeof updateUserSchema>
export type GetUserByIDInput = TypeOf<typeof getUserByIDSchema>
