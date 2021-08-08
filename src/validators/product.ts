import Joi from 'joi';
import {ProductDocument, ProductCategory} from '../models/Product';

export function productValidator(data:ProductDocument){
    const schema = Joi.object({
        name: Joi.string().required().messages({
            "any.required": "Product name is required."
        }),
        description: Joi.string().required().max(400).messages({
            "any.required": "Product description is required.",
            "string.max": "Product description cannot contain more than 400 characters."
        }),
        category: Joi.string().required().valid(...Object.values(ProductCategory)).messages({
            "any.required": "Product category is required.",
            "string.valid": "Product category is invalid."
        }),
        price: Joi.number().required().messages({
            "any.required": "Product price is required."
        }),
        quantity: Joi.number().required().messages({
            "any.required": "Product quantity is required."
        }),
        image: Joi.string(),
        in_stock: Joi.boolean(),
        tags: Joi.array()
    })

    return schema.validate(data);
}