import { UserDocument } from '../models/User';
export function basicDetails(user: UserDocument) {
    const { _id, name, email, phoneNumber, profile, role } = user;
    return { _id, name, email, phoneNumber, profile, role };
}
