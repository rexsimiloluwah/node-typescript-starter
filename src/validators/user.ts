import Joi from 'joi';
import { UserDocument } from '../models/User';

export function userRegisterValidator(data:UserDocument){
    const schema = Joi.object({
        name: Joi.string().required().messages({
            "any.required": "Name is required.",
            "string.min": "Name must contain at least 3 characters."
        }),
        email: Joi.string().required().email().messages({
            "any.required": "Email is required.",
            "string.email": "Email is invalid."
        }),
        phone_number: Joi.string().required().pattern(/^[0-9]+$/).messages({
            "any.required":"Phone number is required."
        }),
        password: Joi.string().required().min(8).messages({
            "any.required": "Password is required.",
            "string.min": "Password must contain at least 8 characters."
        }),
        country: Joi.string(),
        city: Joi.string(),
        website: Joi.string(),
        facebook: Joi.string(),
        twitter: Joi.string()
    })

    return schema.validate(data);
}

export function userLoginValidator(data:UserDocument){
    const schema = Joi.object({
        email: Joi.string().required().email().messages({
            "any.required": "Email is required.",
            "string.email": "Email is invalid."
        }),
        password: Joi.string().required().min(8).messages({
            "any.required": "Password is required.",
            "string.min": "Password must contain at least 8 characters."
        })
    })

    return schema.validate(data);
}