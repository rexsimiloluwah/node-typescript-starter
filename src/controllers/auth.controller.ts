import bcrypt from 'bcryptjs'
import HttpError from '../errors/HttpError'
import { User } from '../models/User'
import { Request, Response, NextFunction } from 'express'
import Mailer from '../service/mailer'
import { basicDetails } from '../utils/basicDetails'
import {
  generateJwtToken,
  generateRefreshToken,
  getRefreshToken,
  setTokenCookie,
} from '../utils/token'
import jwt from 'jsonwebtoken'
import { Role } from '../constants'
import { saveUser, findUser } from '../service/user'
import { saveToken } from '../service/token'
import { TokenInput } from '../models/Token'
import { UserJwtPayload } from '../middlewares/auth'
import {sendEmailVerificationLink,sendPasswordResetLink} from '../queues/email.queue'

class AuthController {
  /**
   * @desc : Register a new user
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async registerUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { email, password } = req.body

    // check for an existing user
    const existingUser = await findUser({ email: email })

    if (existingUser) {
      return next(new HttpError('A user with this email already exists.', 400))
    }

    req.body.password = bcrypt.hashSync(`${password}`)

    try {
      const user = await saveUser(req.body)

      // send an email verification link if the user is not an admin
      try {
        if (user.role === Role.USER) {
          await sendEmailVerificationLink(user)
        }
      } catch (error) {
        return next(new HttpError(error.error, 500))
      }

      return res.status(201).json({
        status: true,
        message: 'New user successfully registered.',
        data: {
          user: { ...basicDetails(user) },
        },
      })
    } catch (error) {
      console.log(error)
      return next(new HttpError(error.message, 500))
    }
  }

  /**
   * @desc : Login a user
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async loginUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { email, password } = req.body

    try {
      const user = await findUser({ email: email })

      if (!user) {
        return next(new HttpError('An account with this email does not exist.', 400))
      }

      const passwordMatch = bcrypt.compareSync(`${password}`, `${user.password}`)
      if (!passwordMatch) {
        return next(new HttpError('Incorrect Email or Password.', 400))
      }

      if (user.isBanned) {
        return next(new HttpError('User is already banned !', 400))
      }

      const accessToken = generateJwtToken(user)
      const refreshToken = generateRefreshToken(user)
      refreshToken.accessToken = accessToken
      setTokenCookie(res, refreshToken.refreshToken)

      // save the token
      await saveToken(refreshToken as TokenInput)

      return res.status(200).json({
        status: true,
        message: 'Login successful.',
        data: {
          user: { ...basicDetails(user) },
          accessToken: accessToken,
          refreshToken: refreshToken.refreshToken,
        },
      })
    } catch (error) {
      console.log('error caught in the catch context: ', error)
      return next(new HttpError(error.message, 500))
    }
  }

  public async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<any> {
    jwt.verify(
      req.query.token as string,
      process.env.JWT_EMAIL_VERIFICATION,
      async (err, decoded) => {
        if (err) {
          return next(new HttpError('Email verification failed, Invalid/Expired token.', 401))
        }

        const { email } = decoded as UserJwtPayload
        const user = await User.findOne({ email })
        if (!user) {
          return next(new HttpError('User does not exist.', 401))
        }

        if (user.isEmailVerified) {
          return res.status(200).json({
            status: true,
            message: 'This email is already verified.',
          })
        }

        user.isEmailVerified = true
        await user.save()
        return res.status(200).json({
          status: true,
          message: 'Email verification successful.',
        })
      },
    )
  }

  public async resendEmailVerificationLink(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return next(new HttpError('User does not exist.', 400))
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        status: true,
        message: 'This user is already verified.',
      })
    }

    try {
      await Mailer.sendEmailVerificationLink(user)
    } catch (error) {
      return next(new HttpError(error.error, 500))
    }

    return res.status(200).json({
      status: true,
      message: 'Email verification link successfully re-sent.',
    })
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { email } = req.body
    const user = await User.findOne({ email })

    try {
      await sendPasswordResetLink(user)
    } catch (error) {
      console.log(error)
      return next(new HttpError(error.error, 500))
    }

    return res.status(200).json({
      status: true,
      message: 'A reset password link has been successfully sent to your mail.',
    })
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { newPassword } = req.body
    jwt.verify(req.query.token as string, process.env.JWT_RESET_PASSWORD, async (err, decoded) => {
      if (err) {
        return next(new HttpError('Invalid/Expired token.', 422))
      }

      const { email } = decoded as UserJwtPayload
      const user = await User.findOne({ email })
      if (!user) {
        return next(new HttpError('Reset password failed, User does not exist.', 400))
      }
      /* Reset password */
      user.password = bcrypt.hashSync(`${newPassword}`)
      await user.save()
      return res.status(200).json({
        status: true,
        message: 'Password reset successful.',
      })
    })
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<any> {
    const token = req.cookies.refreshToken || req.query.token

    if (!token) {
      return next(new HttpError('Refresh token is required.', 400))
    }
    const refreshToken = await getRefreshToken(token, next)
    if (refreshToken.revoked) {
      return next(new HttpError('Token has been revoked.', 400))
    }
    if (refreshToken === 'Invalid') {
      return next(new HttpError('Invalid or Expired token.', 400))
    }
    const { user } = refreshToken
    const newRefreshToken = generateRefreshToken(user)
    refreshToken.revoked = true
    await refreshToken.save()
    await newRefreshToken.save()

    // Generate new JWT access token
    const accessToken = generateJwtToken(user)
    setTokenCookie(res, newRefreshToken.refreshToken)
    res.status(200).json({
      status: true,
      message: 'Successfully refreshed token.',
      data: {
        user: basicDetails(user),
        accessToken,
        refreshToken: newRefreshToken.refreshToken,
      },
    })
  }
}

export default new AuthController()
