import { User, UserDocument } from '../models/User'
import HttpError from '../errors/HttpError'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { findUser } from '../service/user'

export type RequestWithUser = Request & { user: UserDocument }

export interface UserJwtPayload extends JwtPayload {
  id: string
  email: string
}

class AuthMiddleware {
  /**
   * @desc : Require User Sign-in to access resource(s) middleware
   * @param {any} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async requireSignIn(req: any, res: Response, next: NextFunction): Promise<any> {
    // extract the authorization header
    const authHeader = req.headers['authorization'] as string

    if (!authHeader) {
      return next(new HttpError('Authorization token is required.', 401))
    }

    const tokenSplit = authHeader.split(' ')
    if (tokenSplit.length !== 2 || tokenSplit[0].toLowerCase() !== 'bearer') {
      return next(new HttpError('Invalid authorization token structure', 401))
    }

    const token = tokenSplit[1]
    if (!token) {
      return next(new HttpError('Invalid token', 401))
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err, decoded) => {
      if (err) {
        console.log(err)
        return next(new HttpError('Invalid token', 401))
      }
      const user = await findUser({ _id: (decoded as UserJwtPayload).id })
      if (!user) {
        return next(new HttpError('Account does not exist.', 403))
      }

      req.user = user
      next()
    })
  }

  /**
   * @desc : Require Admin access middleware
   * @param {any} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async requireAdmin(req: any, res: Response, next: NextFunction): Promise<any> {
    User.findById({ _id: req.user.id }).exec((err, user) => {
      if (err || !user) {
        return next(new HttpError('User account does not exist.', 401))
      }
      if (user.role != 'admin') {
        return next(new HttpError('Admin access is required.', 403))
      }

      next()
    })
  }
}

export default new AuthMiddleware()
