import { model, Model, Schema, Document } from 'mongoose';

export enum ProductCategory {
    books = 'books',
    electronics = 'electronics',
    groceries = 'groceries',
    fashion = 'fashion',
    automobiles = 'automobiles',
    food = 'food',
    gaming = 'gaming',
    health = 'health',
    miscellaneous = 'miscellaneous',
}

export interface ProductDocument extends Document {
    name: string;
    category: ProductCategory;
    description: string;
    price: number;
    quantity: number;
    image?: string[];
    inStock: boolean;
    tags: Array<string>;
    user: string;
}

const ProductSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, trim: true, required: true },
        category: { type: String, trim: true, required: true, enum: Object.values(ProductCategory) },
        description: { type: String, trim: true, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: [{ type: String, required: false }],
        inStock: { type: Boolean, default: true },
        tags: { type: Array, required: false },
    },
    {
        timestamps: true,
    },
);

export const Product: Model<ProductDocument> = model<ProductDocument>('Product', ProductSchema);
