import { User } from '../models/User';
import HttpError from '../errors/HttpError';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

class AuthMiddleware {
    /**
     * @desc : Require User Sign-in to access resource(s) middleware
     * @param {any} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async requireSignIn(req: any, res: Response, next: NextFunction): Promise<any> {
        const token: string = req.headers['authorization'] as string;
        if (!token) {
            return next(new HttpError('Authorization token is required.', 401));
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err, decoded) => {
            if (err) {
                return next(new HttpError('Invalid Token, Authorization failed.', 401));
            }

            const user = await User.findById({ _id: decoded.id });
            if (!user) {
                return next(new HttpError('Account does not exist.', 403));
            }

            req.user = user;
            next();
        });
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
                return next(new HttpError('User account does not exist.', 401));
            }
            if (user.role != 'admin') {
                return next(new HttpError('Admin access is required.', 403));
            }

            next();
        });
    }
}

export default new AuthMiddleware();
