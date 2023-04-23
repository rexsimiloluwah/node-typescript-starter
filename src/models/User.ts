import { model, Document, Model, Schema } from 'mongoose'
import { Role } from '../constants'
import { Product, ProductDocument } from './Product'
import HttpError from '../errors/HttpError'

export interface UserProfile {
  country?: string
  city?: string
  picture?: string
  website?: string
  facebook?: string
  instagram?: string
  twitter?: string
  rating?: number
}

export interface UserInput {
  name: string
  email: string
  phoneNumber: string
  role?: string
  password: string
  profile?: UserProfile
  isActive?: boolean
  isBanned?: boolean
  isEmailVerified?: boolean
}

export interface UserDocument extends UserInput, Document {
  products?: ProductDocument[]
  createdAt: Date
  updatedAt: Date
}

export const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, default: Role.USER, valid: [...Object.values(Role)] },
    password: { type: String, required: true, trim: true },
    profile: {
      country: { type: String, required: false, default: null },
      city: { type: String, required: false, default: null },
      picture: { type: String, required: false, default: null },
      website: { type: String, required: false, default: null },
      facebook: { type: String, required: false, default: null },
      twitter: { type: String, required: false, default: null },
      instagram: { type: String, required: false, default: null },
      rating: { type: Number, required: false, default: 5 },
    },
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

UserSchema.post('findOneAndDelete', async (res, next) => {
  Product.deleteMany({ user: res.id })
    .then((result) => {
      console.log(result)
      next()
    })
    .catch(() => {
      return next(new HttpError('user products cascade delete error', 500))
    })
})

export const User: Model<UserDocument> = model<UserDocument>('User', UserSchema)
