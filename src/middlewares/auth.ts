import { User } from '../models/User';
import HttpError from '../errors/HttpError';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export async function requireSignIn(req: Request, res: Response, next: NextFunction) {
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
            return next(new HttpError('Invalid Authorization toke, Account does not exist.', 403));
        }

        req.user = user;
        next();
    });
}
