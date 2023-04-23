import { model, Model, Schema, Document } from 'mongoose'
import { ProductCategory } from '../constants'
import { UserDocument } from './User'

export interface ProductInput {
  name: string
  category: ProductCategory
  description: string
  price: number
  quantity: number
  image?: Array<string>
  inStock?: boolean
  tags?: Array<string>
  user?: UserDocument['_id']
}

export interface ProductDocument extends ProductInput, Document {
  createdAt: Date
  updatedAt: Date
}

export const ProductSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, trim: true, required: true },
    category: { type: String, trim: true, required: true, enum: Object.values(ProductCategory) },
    description: { type: String, trim: true, required: false, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: [{ type: String, required: false }],
    inStock: { type: Boolean, default: true },
    tags: { type: Array, required: false },
  },
  {
    timestamps: true,
  },
)

// ProductSchema.pre('find',(next) => {
//  console.log("running find middleware")
//  next()
// });

export const Product: Model<ProductDocument> = model<ProductDocument>('Product', ProductSchema)
