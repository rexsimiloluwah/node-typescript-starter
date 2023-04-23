import Joi from 'joi'
import { ProductCategory } from '../constants'
import { ProductDocument } from '../models/Product'

export function productValidator(data: ProductDocument): Joi.ValidationResult {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Product name is required.',
    }),
    description: Joi.string().required().max(400).messages({
      'any.required': 'Product description is required.',
      'string.max': 'Product description cannot contain more than 400 characters.',
    }),
    category: Joi.string()
      .required()
      .valid(...Object.values(ProductCategory))
      .messages({
        'any.required': 'Product category is required.',
        'string.valid': 'Product category is invalid.',
      }),
    price: Joi.number().required().messages({
      'any.required': 'Product price is required.',
    }),
    quantity: Joi.number().required().messages({
      'any.required': 'Product quantity is required.',
    }),
    image: Joi.array(),
    inStock: Joi.boolean(),
    tags: Joi.array(),
  })

  return schema.validate(data)
}
