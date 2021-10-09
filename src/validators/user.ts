import Joi from 'joi';
import { UserDocument } from '../models/User';

class UserValidator {
    /**
     * @desc : Validation for user registration data
     * @param {UserDocument} data
     */
    public userRegisterValidator(data: UserDocument) {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                'any.required': 'Name is required.',
                'string.min': 'Name must contain at least 3 characters.',
            }),
            email: Joi.string().required().email().messages({
                'any.required': 'Email is required.',
                'string.email': 'Email is invalid.',
            }),
            role: Joi.string(),
            phoneNumber: Joi.string()
                .required()
                .pattern(/^[0-9]+$/)
                .messages({
                    'any.required': 'Phone number is required.',
                }),
            password: Joi.string().required().min(8).messages({
                'any.required': 'Password is required.',
                'string.min': 'Password must contain at least 8 characters.',
            }),
            profile: {
                country: Joi.string(),
                picture: Joi.string(),
                city: Joi.string(),
                website: Joi.string(),
                facebook: Joi.string(),
                twitter: Joi.string(),
                instagram: Joi.string(),
                rating: Joi.number(),
            }
        });

        return schema.validate(data);
    }

    /**
     * @desc : Validate data for user login
     * @param {UserDocument} data
     */
    public userLoginValidator(data: UserDocument) {
        const schema = Joi.object({
            email: Joi.string().required().email().messages({
                'any.required': 'Email is required.',
                'string.email': 'Email is invalid.',
            }),
            password: Joi.string().required().min(8).messages({
                'any.required': 'Password is required.',
                'string.min': 'Password must contain at least 8 characters.',
            }),
        });

        return schema.validate(data);
    }

}

export default new UserValidator();
