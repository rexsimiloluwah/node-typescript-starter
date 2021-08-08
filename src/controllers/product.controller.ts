import HttpError from '../errors/HttpError';
import { productValidator } from '../validators/product';
import { Product, ProductDocument } from '../models/Product';
import { Request, Response, NextFunction } from 'express';
import checkMongoId from '../utils/checkMongoId';
import { basicDetails } from '../utils/basicDetails';

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    Product.find()
        .populate('user')
        .then((products: Array<ProductDocument>) => {
            if (!products.length) {
                return next(new HttpError('No products found.', 404));
            }

            return res.status(200).json({
                status: true,
                message: `${products.length} Product(s) fetched successfully.`,
                data: {
                    products: products,
                },
            });
        })
        .catch((error) => {
            return next(new HttpError(error.message, 500));
        });
}

export async function getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const productId = req.params.id;
    if (!productId) {
        return next(new HttpError('Product ID is required.', 400));
    }
    if (!checkMongoId(productId)) {
        return next(new HttpError('Product ID is invalid.', 422));
    }

    Product.findOne({ _id: productId })
        .populate('user')
        .then((product: ProductDocument | null) => {
            if (!product) {
                return next(new HttpError('Product not found.', 404));
            }

            return res.status(200).json({
                status: true,
                message: 'Product fetched successfully.',
                data: {
                    product: product,
                },
            });
        })
        .catch((error) => {
            return next(new HttpError(error.message, 500));
        });
}

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { error } = productValidator(req.body);
    const user = req.user;
    if (error) {
        return next(new HttpError(error.details[0].message, 400));
    }

    const newProduct = new Product(req.body);
    newProduct.user = user._id;
    newProduct
        .save()
        .then((product: ProductDocument) => {
            console.log(product);
            return res.status(201).json({
                status: true,
                message: 'New product created successfully.',
                data: {
                    product: product,
                },
            });
        })
        .catch((error) => {
            return next(new HttpError(error.message, 500));
        });
}

export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    const productId = req.params.id;
    if (!productId) {
        return next(new HttpError('Product ID is required.', 400));
    }
    if (!checkMongoId(productId)) {
        return next(new HttpError('Product ID is Invalid.', 422));
    }

    const existingProduct = await Product.findOne({ _id: productId });
    if (!existingProduct) {
        return next(new HttpError('Product not found.', 404));
    }

    Product.updateOne({ _id: productId }, req.body)
        .then(async (product) => {
            console.log(product);
            return res.status(200).json({
                status: true,
                message: `Product ${productId} updated successfully.`,
                data: {
                    product: await Product.findOne({ _id: productId }),
                },
            });
        })
        .catch((error) => {
            return next(new HttpError(error.message, 500));
        });
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    const productId = req.params.id;
    if (!productId) {
        return next(new HttpError('Product ID is required.', 400));
    }
    if (!checkMongoId(productId)) {
        return next(new HttpError('Product ID is Invalid.', 422));
    }

    const existingProduct = await Product.findOne({ _id: productId });
    if (!existingProduct) {
        return next(new HttpError('Product not found.', 404));
    }

    Product.remove({ _id: productId })
        .then((product: ProductDocument | null) => {
            console.log(product);
            return res.status(200).json({
                status: true,
                message: `Product ${productId} successfully deleted.`,
                data: {
                    product: product,
                },
            });
        })
        .catch((error) => {
            return next(new HttpError(error.message, 500));
        });
}
