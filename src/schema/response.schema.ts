import { object, number, string, TypeOf, boolean } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Status
 *         message:
 *           type: string
 *           description: Success Message
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Status
 *         error:
 *           type: string
 *           description: Error Message
 */
export const successResponseSchema = object({
  body: object({
    status: boolean(),
    message: string(),
    data: object({}).optional(),
  }),
})

export const errorResponseSchema = object({
  body: object({
    status: boolean(),
    error: string(),
  }),
})
