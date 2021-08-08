import bcrypt from 'bcryptjs';
import HttpError from '../errors/HttpError';
import { User, UserDocument } from '../models/User';
import { NativeError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { userRegisterValidator, userLoginValidator } from '../validators/user';
import { basicDetails } from '../utils/basicDetails';
import { generateJwtToken, generateRefreshToken } from '../utils/token';

export async function registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { error } = userRegisterValidator(req.body);
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
                return res.status(200).json({
                    status: true,
                    message: 'New user successfully registered.',
                    data: {
                        user: {...basicDetails(user)}
                    }
                });
            })
            .catch((error: NativeError) => {
                console.log(error);
                return next(new HttpError(error.message, 500));
            });
    });
}

export async function loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { error } = userLoginValidator(req.body);
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

        const accessToken = generateJwtToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshToken.access_token = accessToken;
        await refreshToken.save();

        return res.status(200).json({
            status: true,
            message: "Login successful.",
            data: {
                user: {...basicDetails(user)},
                access_token: accessToken,
                refresh_token: refreshToken.refresh_token
            },
        });
    });
}

export default {
    registerUser,
    loginUser,
};
