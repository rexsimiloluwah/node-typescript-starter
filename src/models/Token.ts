import { model, Document, Model, Schema } from 'mongoose'

export interface TokenInput {
  user: string
  refreshToken: string
  accessToken: string
  expiresAt: Date
}

export interface TokenDocument extends Document, TokenInput {
  isActive: boolean
  isExpired: boolean
  revoked: boolean
  createdAt: Date
  updatedAt: Date
}

const TokenSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String },
    accessToken: { type: String },
    expiresAt: { type: Date },
    revoked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

TokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires_at
})

TokenSchema.virtual('isActive').get(function () {
  return !this.is_expired && !this.revoked
})

export const Token: Model<TokenDocument> = model<TokenDocument>('Token', TokenSchema)
