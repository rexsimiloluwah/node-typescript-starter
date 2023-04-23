import { Router, Request, Response } from 'express'

const router = Router()

/**
 * @openapi
 * /healthcheck:
 *   get:
 *    tags:
 *     - Public
 *
 *    summary: Health check
 *    description: Check if the server is healthy!
 *
 *    responses:
 *     200:
 *      description: Server is healthy!
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SuccessResponse'
 *     500:
 *       description: Internal Server Error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/healthcheck', (req: Request, res: Response) => {
  return res.status(200).json({
    status: true,
    message: 'Server is healthy!',
  })
})

export default router
