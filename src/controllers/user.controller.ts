import HttpError from '../errors/HttpError';
import { User, UserDocument } from '../models/User';
import { Product, ProductDocument } from '../models/Product';
import { Request, Response, NextFunction } from 'express';
import checkMongoId from '../utils/checkMongoId';
import { basicDetails } from '../utils/basicDetails';
import { AnyKeys } from 'mongoose';

class UserController {
    /**
     * @desc : Update user profile
     * @param {any} req
     * @param {Response} res
     * @param {NextFunction} next
     * @route
     */
    public async updateUserProfile(req: any, res: Response, next: NextFunction): Promise<any> {
        const user = req.user;
        if (!user) {
            return next(new HttpError('User not found.', 400));
        }

        User.updateOne({ _id: user._id }, req.body)
            .then(async (updatedUser) => {
                return res.status(200).json({
                    status: true,
                    message: `Successfully updated user ${user._id}`,
                    data: {
                        user: await User.find({ _id: user._id }),
                    },
                });
            })
            .catch((error) => {
                return next(new HttpError(error.message, 500));
            });
    }

    /**
     * @desc : Get all users
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async getUsers(req: Request, res: Response, next: NextFunction): Promise<any> {
        User.find()
            .then((users: Array<UserDocument>) => {
                console.log(users);
                return res.status(200).json({
                    status: true,
                    message: `Successfully fetched ${users.length} users`,
                    data: {
                        users: users,
                    },
                });
            })
            .catch((error) => {
                return next(new HttpError(error.message, 500));
            });
    }

    /**
     * @desc : Get user profile with products by ID
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async getUserProfile(req: Request, res: Response, next: NextFunction): Promise<any> {
        const userId = req.params.id;
        if (!userId) {
            return next(new HttpError('User ID is required.', 400));
        }
        if (!checkMongoId(userId)) {
            return next(new HttpError('User ID is invalid.', 422));
        }

        User.findOne({ _id: userId })
            .then(async (user) => {
                console.log(user);
                if (!user) {
                    return next(new HttpError('User not found.', 404));
                }
                const userProducts = await Product.find({ user: userId });
                return res.status(200).json({
                    status: true,
                    message: 'Successfully fetched user profile.',
                    data: {
                        user: { ...basicDetails(user) },
                        products: userProducts,
                    },
                });
            })
            .catch((error) => {
                return next(new HttpError(error.message, 500));
            });
    }

    /**
     * @desc : Get user basic details by ID
     * @param {any} req
     * @param {Response} res
     * @param {NextFunction} next
     * @route
     */
    public async getUser(req: any, res: Response, next: NextFunction): Promise<any> {
        const user = req.user;
        if (!user) {
            return next(new HttpError('User not found.', 404));
        }
        User.findOne({ _id: user._id }).then(async (users) => {
            console.log(users);
            const products = await Product.find({ user: user._id });
            return res.status(200).json({
                status: true,
                message: `Successfully fetched user.`,
                data: {
                    products: products,
                    user: { ...basicDetails(user) },
                },
            });
        });
    }

    /**
     * @desc : Delete a user account
     * @param {any} req
     * @param {Response} res
     * @param {NextFunction} next
     * @route
     */
    public async deleteUser(req: any, res: Response, next: NextFunction): Promise<any> {
        const user = req.user;
        if (!user) {
            return next(new HttpError('User not found.', 404));
        }
        User.findByIdAndRemove({ _id: user._id })
            .then((user) => {
                return res.status(200).json({
                    status: true,
                    message: 'User successfully deleted.',
                    data: user,
                });
            })
            .catch((error) => {
                return next(new HttpError(error.message, 500));
            });
    }
}

export default new UserController();
