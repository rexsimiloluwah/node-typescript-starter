import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import mongoose, {model, Document, Model, Schema} from 'mongoose';

export interface UserDocument extends Document{
    name: string,
    email: string,
    phone_number: string,
    password?: string,
    country?: string,
    city?: string,
    website?: string,
    facebook?: string,
    twitter?: string
}

const UserSchema = new Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true, unique: true},
    phone_number: {type: String, required: true},
    password: {type: String, required: true, trim: true},
    country: {type: String, required: false},
    city: {type: String, required: false},
    website: {type: String, required: false},
    facebook: {type: String, required: false},
    twitter: {type: String, required: false},
    isEmailVerified: {type: Boolean, default: false, required: true}
}, {
    timestamps: true
})

export const User:Model<UserDocument> = model<UserDocument>('User', UserSchema);