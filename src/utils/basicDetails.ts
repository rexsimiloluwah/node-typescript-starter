import { UserDocument } from '../models/User'
export function basicDetails(user: Partial<UserDocument>): Partial<UserDocument> {
  const {
    _id,
    name,
    email,
    phoneNumber,
    profile,
    role,
    isEmailVerified,
    isBanned,
    isActive,
    products,
  } = user
  return {
    _id,
    name,
    email,
    phoneNumber,
    profile,
    role,
    isEmailVerified,
    isBanned,
    isActive,
    products,
  }
}
