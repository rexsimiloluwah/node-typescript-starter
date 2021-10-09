import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/User';
import { Token, TokenDocument } from '../models/Token';
import { NextFunction,Response } from 'express';
import HttpError from '../errors/HttpError';

export function generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export function generateJwtToken(user: UserDocument): string {
    return jwt.sign({ id: user._id, email: user.email}, process.env.JWT_SECRET_KEY as string, {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
}

export function generateRefreshToken(user: UserDocument): TokenDocument {
    return new Token({
        user: user._id,
        refreshToken: generateRandomToken(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
}

export function generateResetPasswordToken(user: UserDocument):string {
    return jwt.sign({ id: user._id, email: user.email}, process.env.JWT_RESET_PASSWORD as string, {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
}

export function generateEmailVerificationToken(user: UserDocument):string {
    /* Email verification token. Expires in 24 hours */
    const {id, email} = user;
    return jwt.sign({ id:id, email:email }, process.env.JWT_EMAIL_VERIFICATION as string, {
        expiresIn: '24h',
    });
}

export async function getRefreshToken(token:string, next:NextFunction):Promise<any> {
    const refreshToken = await Token.findOne({ refreshToken : token}).populate('user');
    if(!refreshToken){
        return next(new HttpError("Token is Invalid.", 400));
    }
    if(!refreshToken || !refreshToken.isActive || refreshToken.isExpired){
        return next(new HttpError("Token is expired or inactive.", 400));
    }

    return refreshToken;
}

export function setTokenCookie(res: Response, token: string): void {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    res.cookie('refreshToken', token, cookieOptions);
}
