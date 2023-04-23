import HttpError from '../errors/HttpError'
import { Product, ProductDocument } from '../models/Product'
import { Request, Response, NextFunction } from 'express'
import checkMongoId from '../utils/checkMongoId'
import { basicDetails } from '../utils/basicDetails'
import { paginateData } from '../utils/paginate'
import { RequestWithUser } from '../middlewares/auth'
import {
  saveProduct,
  findProduct,
  updateSingleProduct,
  deleteSingleProduct,
} from '../service/product'

class ProductController {
  /**
   * @desc : Fetch all products from the database
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getProducts(req: Request, res: Response, next: NextFunction): Promise<any> {
    // handle filtering
    // build the query object
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    // remove the excluded fields from the query object
    excludedFields.forEach((field) => delete queryObj[field])

    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    let query = Product.find(JSON.parse(queryString))

    // handle sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // execute the query
    query
      .populate('user')
      .then((products: Array<ProductDocument>) => {
        products.forEach((product) => (product.user = basicDetails(product.user)))

        // pagination
        const page = Number(req.query.page) || 0
        const limit = Number(req.query.limit) || 5

        const paginatedResponse = paginateData<ProductDocument>(products, page, limit)

        return res.status(200).json({
          status: true,
          message: `${products.length} product(s) fetched successfully.`,
          ...paginatedResponse,
        })
      })
      .catch((error) => {
        return next(new HttpError(error.message, 500))
      })
  }

  /**
   * @desc : Get products by product ID
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getProductById(req: Request, res: Response, next: NextFunction): Promise<any> {
    const productId = req.params.id

    if (!checkMongoId(productId)) {
      return next(new HttpError('Product ID is invalid.', 422))
    }

    try {
      const product = await findProduct({ _id: productId }, { populate: ['user'] })
      if (!product) {
        return next(new HttpError('Product not found.', 404))
      }

      return res.status(200).json({
        status: true,
        message: 'Product fetched successfully.',
        data: {
          product: product,
        },
      })
    } catch (error) {
      return next(new HttpError(error.message, 500))
    }
  }

  /**
   * @desc : Create a new product
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async createProduct(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    const user = req.user
    const newProduct = new Product(req.body)
    newProduct.user = user._id
    try {
      const product = await saveProduct(newProduct)
      return res.status(201).json({
        status: true,
        message: 'New product created successfully.',
        data: product,
      })
    } catch (error) {
      return next(new HttpError(error.message, 500))
    }
  }

  /**
   * @desc : Update an existing product
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async updateProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
    const productId = req.params.id

    if (!checkMongoId(productId)) {
      return next(new HttpError('Product ID is Invalid.', 422))
    }

    const existingProduct = await findProduct({ _id: productId })
    if (!existingProduct) {
      return next(new HttpError('Product not found.', 404))
    }

    try {
      const result = await updateSingleProduct({ _id: productId }, req.body)
      return res.status(200).json({
        status: true,
        message: `Product ${productId} updated successfully.`,
        data: {
          result,
        },
      })
    } catch (error) {
      return next(new HttpError(error.message, 500))
    }
  }

  /**
   * @desc : Delete an existing product from the database
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
    const productId = req.params.id

    if (!checkMongoId(productId)) {
      return next(new HttpError('Product ID is Invalid.', 422))
    }

    const existingProduct = await findProduct({ _id: productId })
    if (!existingProduct) {
      return next(new HttpError('Product not found.', 404))
    }

    try {
      const result = await deleteSingleProduct({ _id: productId })
      return res.status(200).json({
        status: true,
        message: `Product ${productId} successfully deleted.`,
        data: {
          result,
        },
      })
    } catch (error) {
      return next(new HttpError(error.message, 500))
    }
  }
}

export default new ProductController()
