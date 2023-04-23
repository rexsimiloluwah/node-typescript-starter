import { z } from 'zod'
import { ProductCategory } from '../constants'

const productCategoryProps = Object.values(ProductCategory).map((value) => ({
  value: value,
  label: value,
}))
type ProductCategoryProperty = (typeof productCategoryProps)[number]['value']
// z.enum expects a non-empty array so to work around that
// we pull the first value out explicitly
const PRODUCT_CATEGORY_VALUES: [ProductCategoryProperty, ...ProductCategoryProperty[]] = [
  productCategoryProps[0].value,
  // And then merge in the remaining values from `properties`
  ...productCategoryProps.slice(1).map((p) => p.value),
]

const productCategoryEnum: z.ZodType<ProductCategory> = z.enum(PRODUCT_CATEGORY_VALUES)

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProductInput:
 *       type: object
 *       required:
 *        - name
 *        - category
 *        - price
 *        - quantity
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *           example: an-awesome-product
 *         description:
 *           type: string
 *           description: Product description
 *           example: this is an awesome product
 *         category:
 *           type: string
 *           description: Product category
 *           example: electronics
 *         price:
 *           type: number
 *           description: Product price
 *         quantity:
 *           type: number
 *           description: Product quantity
 *         inStock:
 *           type: boolean
 *           description: Product's inventory status
 *         image:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *
 *     BaseProductResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateProductInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *             user:
 *               $ref: '#/components/schemas/BaseUserResponse'
 *
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         hasNextPage:
 *           type: boolean
 *         currentPage:
 *           type: number
 *         totalPages:
 *           type: number
 *         totalCount:
 *           type: number
 *
 *     ProductsResponse:
 *       allOf:
 *        - $ref: '#/components/schemas/SuccessResponse'
 *        -  $ref: '#/components/schemas/PaginatedResponse'
 *        - type: object
 *          properties:
 *            data:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/BaseProductResponse'
 *
 *     ProductResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/SuccessResponse'
 *         - type: object
 *           properties:
 *              data:
 *                $ref: '#/components/schemas/BaseProductResponse'
 *
 *     CreateProductResponse:
 *      allOf:
 *        - $ref: '#/components/schemas/SuccessResponse'
 *        - type: object
 *          properties:
 *            data:
 *              allOf:
 *                - $ref: '#/components/schemas/CreateProductInput'
 *                - type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                    createdAt:
 *                      type: string
 *                    updatedAt:
 *                      type: string
 */
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'name is required',
        invalid_type_error: 'name must be a string',
      })
      .min(3, 'product name must contain at least 3 characters')
      .max(140, 'product name cannot be more than 140 characters'),
    category: productCategoryEnum,
    description: z
      .string({
        invalid_type_error: 'description must be a string',
      })
      .min(3, 'product description must contain at least 3 characters')
      .optional(),
    price: z.number({
      required_error: 'price is required',
    }),
    quantity: z.number({
      required_error: 'quantity is required',
    }),
    image: z.array(z.string({})).optional(),
    inStock: z.boolean({}).optional(),
    tags: z.array(z.string({})).optional(),
  }),
})

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *           example: an-awesome-product
 *         description:
 *           type: string
 *           description: Product description
 *           example: this is an awesome product
 *         category:
 *           type: string
 *           description: Product category
 *           example: electronics
 *         price:
 *           type: number
 *           description: Product price
 *         quantity:
 *           type: number
 *           description: Product quantity
 *         inStock:
 *           type: boolean
 *           description: Product's inventory status
 *         image:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *
 *     UpdateProductResponse:
 *      allOf:
 *        - $ref: '#/components/schemas/SuccessResponse'
 *        - type: object
 *          properties:
 *            data:
 *              $ref: '#/components/schemas/BaseProductResponse'
 */
export const updateProductSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'name must be a string',
      })
      .min(3, 'product name must contain at least 3 characters')
      .max(140, 'product name cannot be more than 140 characters')
      .optional(),
    category: productCategoryEnum.optional(),
    description: z
      .string({
        invalid_type_error: 'description must be a string',
      })
      .min(3, 'product description must contain at least 3 characters')
      .optional(),
    price: z.number({}).optional(),
    quantity: z.number({}).optional(),
    image: z.array(z.string({})).optional(),
    inStock: z.boolean({}).optional(),
    tags: z.array(z.string({})).optional(),
  }),
  params: z.object({
    id: z.string({
      required_error: 'id is required',
      invalid_type_error: 'id must be a string',
    }),
  }),
})

export const getProductByIDSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'id is required',
      invalid_type_error: 'id must be a string',
    }),
  }),
})

export type CreateProductInput = z.TypeOf<typeof createProductSchema>
export type UpdateProductInput = z.TypeOf<typeof updateProductSchema>
;``
