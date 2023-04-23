import HttpError from '../errors/HttpError'
import { Product, ProductDocument } from '../models/Product'
import { Request, Response, NextFunction } from 'express'

class ProductMiddleware {
  public async checkProductOwner(req: any, res: Response, next: NextFunction): Promise<any> {
    const user = req.user
    const productId = req.params.id

    Product.findOne({ _id: productId })
      .populate('user')
      .then((product: ProductDocument | null) => {
        const {
          user: { _id: productOwnerId },
        } = product

        if (user.id != productOwnerId) {
          return next(new HttpError('User cannot modify this product.', 403))
        }

        next()
      })
      .catch((error) => {
        return next(new HttpError(error.message, 500))
      })
  }
}

export default new ProductMiddleware()
