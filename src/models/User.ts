import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import mongoose, { model, Document, Model, Schema } from 'mongoose';
import { Role } from '../types/general';

export interface UserProfile {
    country?: string;
    city?: string;
    picture?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    rating?: number;
}

export interface UserDocument extends Document {
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    password: string;
    profile: UserProfile;
    isActive: boolean;
    isBanned: boolean;
    isEmailVerified: boolean;
}

const UserSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        phoneNumber: { type: String, required: true },
        role: { type: String, default: Role.USER, valid: [...Object.values(Role)] },
        password: { type: String, required: true, trim: true },
        profile: {
            country: { type: String, required: false },
            city: { type: String, required: false },
            picture: { type: String, required: false },
            website: { type: String, required: false },
            facebook: { type: String, required: false },
            twitter: { type: String, required: false },
            instagram: { type: String, required: false },
            rating: { type: Number, required: false, default: 5 },
        },
        isActive: { type: Boolean, default: true },
        isBanned: { type: Boolean, default: false },
        isEmailVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

export const User: Model<UserDocument> = model<UserDocument>('User', UserSchema);
