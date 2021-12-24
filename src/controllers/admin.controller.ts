import bcrypt from 'bcryptjs';
import HttpError from '../errors/HttpError';
import checkMongoId from '../utils/checkMongoId';
import { User, UserDocument } from '../models/User';
import { Request, Response, NextFunction } from 'express';
import { NativeError } from 'mongoose';
import { basicDetails } from '../utils/basicDetails';
import UserValidator from '../validators/user';
import { generateJwtToken, generateRefreshToken, getRefreshToken, setTokenCookie } from '../utils/token';

class AdminController {
    public async loginAdmin(req: Request, res: Response, next: NextFunction) {
        const { error } = UserValidator.userLoginValidator(req.body);
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
            if (user.role !== 'admin') {
                return next(new HttpError('This user is not a registered Admin.', 400));
            }
            const passwordMatch = bcrypt.compareSync(`${password}`, `${user.password}`);
            if (!passwordMatch) {
                return next(new HttpError('Incorrect Email or Password.', 401));
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

    public async banUser(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        if (!checkMongoId(userId)) {
            return next(new HttpError('User ID is invalid!', 422));
        }
        const user = await User.findOne({ _id: userId });
        console.log(user);

        if (!user) {
            return next(new HttpError('Unable to ban, User not found !', 400));
        }

        if (user.role === 'admin') {
            return next(new HttpError('Cannot ban an admin !', 400));
        }

        if (user.isBanned) {
            return next(new HttpError('User is already banned !', 400));
        }

        user.isBanned = true;
        await user.save();

        return res.status(200).json({
            message: 'User banned successfully!',
            data: req.body,
        });
    }
}

export default new AdminController();
