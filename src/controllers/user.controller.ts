import HttpError from '../errors/HttpError'
import { Request, Response, NextFunction } from 'express'
import checkMongoId from '../utils/checkMongoId'
import { basicDetails } from '../utils/basicDetails'
import { RequestWithUser } from '../middlewares/auth'
import { deleteSingleUser, findUser, findUsers, updateSingleUser } from '../service/user'
import { findProducts } from '../service/product'

class UserController {
  /**
   * @desc : Update user profile
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @route
   */
  public async updateUserProfile(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const user = req.user
    if (!user) {
      return next(new HttpError('User not found.', 400))
    }

    try {
      const result = await updateSingleUser({ _id: user.id }, req.body)
      return res.status(200).json({
        status: true,
        message: `Successfully updated user ${user._id}`,
        data: {
          result,
        },
      })
    } catch (error) {
      return next(new HttpError(error.message, 500))
    }
  }

  /**
   * @desc : Get all users
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getUsers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const users = await findUsers()
      return res.status(200).json({
        status: true,
        message: `Successfully fetched ${users.length} users`,
        data: {
          users: users.map((user) => basicDetails(user)),
        },
      })
    } catch (error) {
      return next(new HttpError(error.message, 500))
    }
  }

  /**
   * @desc : Get user profile with products by ID
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getUserProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
    const userId = req.params.id
    if (!userId) {
      return next(new HttpError('User ID is required.', 400))
    }
    if (!checkMongoId(userId)) {
      return next(new HttpError('User ID is invalid.', 422))
    }

    try {
      const user = await findUser({ _id: userId })
      if (!user) {
        return next(new HttpError('User not found.', 404))
      }
      const userProducts = await findProducts({ user: userId })
      return res.status(200).json({
        status: true,
        message: 'Successfully fetched user profile.',
        data: {
          user: { ...basicDetails(user) },
          products: userProducts,
        },
      })
    } catch (error) {
      return next(new HttpError(error.message, 500))
    }
  }

  /**
   * @desc : Get authenticated user
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @route
   */
  public async getAuthUser(req: RequestWithUser, res: Response, next: NextFunction): Promise<any> {
    const user = req.user
    console.log('auth user: ', user)
    if (!user) {
      return next(new HttpError('User not found.', 404))
    }

    try {
      const products = await findProducts({ user: user.id })
      return res.status(200).json({
        status: true,
        message: `Successfully fetched user.`,
        data: {
          products: products,
          user: { ...basicDetails(user) },
        },
      })
    } catch (error) {
      return next(new HttpError(error.message, 500))
    }
  }

  /**
   * @desc : Delete a user account
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @route
   */
  public async deleteUser(req: RequestWithUser, res: Response, next: NextFunction): Promise<any> {
    const user = req.user
    if (!user) {
      return next(new HttpError('User not found.', 404))
    }

    try {
      const result = await deleteSingleUser({ _id: user.id })
      return res.status(200).json({
        status: true,
        message: 'User successfully deleted.',
        data: result,
      })
    } catch (error) {
      return next(new HttpError(error.message, 500))
    }
  }
}

export default new UserController()
