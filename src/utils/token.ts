import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {UserDocument} from '../models/User';
import {Token, TokenDocument} from '../models/Token';
import { Response } from 'express';

export function generateRandomToken():string {
    return crypto.randomBytes(32).toString('hex');
}

export function generateJwtToken(user:UserDocument):string {
    return jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET_KEY as string,
        {expiresIn: process.env.JWT_EXPIRES_IN as string}
    )
}

export function generateRefreshToken(user:UserDocument):TokenDocument {
    return new Token({
        user: user._id,
        refresh_token: generateRandomToken(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
}

export function setTokenCookie(res:Response, token:string):void {
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    res.cookie('refreshToken', token, cookieOptions);
}




