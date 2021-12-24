import bcrypt from 'bcryptjs';
import HttpError from '../errors/HttpError';
import { User, UserDocument } from '../models/User';
import { NativeError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import UserValidator from '../validators/user';
import Mailer from '../service/mailer';
import { basicDetails } from '../utils/basicDetails';
import { generateJwtToken, generateRefreshToken, getRefreshToken, setTokenCookie } from '../utils/token';
import jwt from 'jsonwebtoken';

class AuthController {
    /**
     * @desc : Register a new user
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async registerUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { error } = UserValidator.userRegisterValidator(req.body);
        console.log(req.body);
        if (error) {
            return next(new HttpError(error.details[0].message, 400));
        }

        const { email, password } = req.body;
        User.findOne({ email: email }, (err: NativeError, existingUser: UserDocument) => {
            if (err) {
                return next(new HttpError(err.message, 500));
            }
            if (existingUser) {
                return next(new HttpError('A user with this email already exists.', 400));
            }

            req.body.password = bcrypt.hashSync(`${password}`);

            new User(req.body)
                .save()
                .then(async (user: UserDocument) => {
                    try {
                        if (user.role === 'user') {
                            await Mailer.sendEmailVerificationLink(user);
                        }
                    } catch (error) {
                        return next(new HttpError(error.error, 500));
                    }

                    return res.status(200).json({
                        status: true,
                        message: 'New user successfully registered.',
                        data: {
                            user: { ...basicDetails(user) },
                        },
                    });
                })
                .catch((error: NativeError) => {
                    console.log(error);
                    return next(new HttpError(error.message, 500));
                });
        });
    }

    /**
     * @desc : Login a user
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async loginUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { error } = UserValidator.userLoginValidator(req.body);
        console.log(req.body);
        if (error) {
            return next(new HttpError(error.details[0].message, 400));
        }

        const { email, password } = req.body;
        User.findOne({ email: email }, async (err: NativeError, user: UserDocument) => {
            if (err) {
                return next(new HttpError(err.message, 500));
            }
            if (!user) {
                return next(new HttpError('An account with this email does not exist.', 404));
            }

            const passwordMatch = bcrypt.compareSync(`${password}`, `${user.password}`);
            if (!passwordMatch) {
                return next(new HttpError('Incorrect Email or Password.', 401));
            }

            if (user.isBanned) {
                return next(new HttpError('User is already banned !', 400));
            }

            const accessToken = generateJwtToken(user);
            const refreshToken = generateRefreshToken(user);
            refreshToken.accessToken = accessToken;
            setTokenCookie(res, refreshToken.refreshToken);
            await refreshToken.save();
            console.log(refreshToken);

            return res.status(200).json({
                status: true,
                message: 'Login successful.',
                data: {
                    user: { ...basicDetails(user) },
                    accessToken: accessToken,
                    refreshToken: refreshToken.refreshToken,
                },
            });
        });
    }

    public async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<any> {
        if (!req.query.token) {
            return next(new HttpError('Email Verification Token is required!', 422));
        }

        jwt.verify(req.query.token as string, process.env.JWT_EMAIL_VERIFICATION, async (err, decoded) => {
            console.log(err, decoded);
            if (err) {
                return next(new HttpError('Email verification failed, Invalid/Expired token.', 401));
            }

            const { email } = decoded;
            const user = await User.findOne({ email });
            if (!user) {
                return next(new HttpError('User does not exist.', 401));
            }

            if (user.isEmailVerified) {
                return res.status(200).json({
                    status: true,
                    message: 'This email is already verified.',
                });
            }

            user.isEmailVerified = true;
            await user.save();
            return res.status(200).json({
                status: true,
                message: 'Email verification successful.',
            });
        });
    }

    public async resendEmailVerificationLink(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { email } = req.body;
        if (!email) {
            return next(new HttpError('Email is required.', 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new HttpError('User does not exist.', 400));
        }

        if (user.isEmailVerified) {
            return res.status(200).json({
                status: true,
                message: 'This user is already verified.',
            });
        }

        try {
            await Mailer.sendEmailVerificationLink(user);
        } catch (error) {
            return next(new HttpError(error.error, 500));
        }

        return res.status(200).json({
            status: true,
            message: 'Email verification link successfully re-sent.',
        });
    }

    public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { email } = req.body;
        if (!email) {
            return next(new HttpError('Email is required.', 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new HttpError('User does not exist.', 400));
        }

        try {
            await Mailer.sendPasswordResetLink(user);
        } catch (error) {
            console.log(error);
            return next(new HttpError(error.error, 500));
        }

        return res.status(200).json({
            status: true,
            message: 'A reset password link has been successfully sent to your mail.',
        });
    }

    public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<any> {
        if (!req.query.token) {
            return next(new HttpError('Reset password token is required.', 400));
        }
        const { newPassword } = req.body;
        if (!newPassword) {
            return next(new HttpError('New password is required.', 400));
        }

        jwt.verify(req.query.token as string, process.env.JWT_RESET_PASSWORD, async (err, decoded) => {
            if (err) {
                return next(new HttpError('Invalid/Expired token.', 422));
            }

            const { email } = decoded;
            const user = await User.findOne({ email });
            if (!user) {
                return next(new HttpError('Reset password failed, User does not exist.', 400));
            }
            /* Reset password */
            user.password = bcrypt.hashSync(`${newPassword}`);
            await user.save();
            return res.status(200).json({
                status: true,
                message: 'Password reset successful.',
            });
        });
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<any> {
        const token = req.cookies.refreshToken || req.query.token;

        if (!token) {
            return next(new HttpError('Refresh token is required.', 400));
        }
        const refreshToken = await getRefreshToken(token, next);
        if (refreshToken.revoked) {
            return next(new HttpError('Token has been revoked.', 400));
        }
        if (refreshToken === 'Invalid') {
            return next(new HttpError('Invalid or Expired token.', 400));
        }
        const { user } = refreshToken;
        const newRefreshToken = generateRefreshToken(user);
        refreshToken.revoked = true;
        await refreshToken.save();
        await newRefreshToken.save();

        // Generate new JWT access token
        const accessToken = generateJwtToken(user);
        setTokenCookie(res, newRefreshToken.refreshToken);
        res.status(200).json({
            status: true,
            message: 'Successfully refreshed token.',
            data: {
                user: basicDetails(user),
                accessToken,
                refreshToken: newRefreshToken.refreshToken,
            },
        });
    }
}

export default new AuthController();
