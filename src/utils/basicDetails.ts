import {UserDocument} from '../models/User';
export function basicDetails(user:UserDocument){
    const {_id, name, email, phone_number, country, city} = user;
    return {_id, name, email, phone_number, country, city};
}