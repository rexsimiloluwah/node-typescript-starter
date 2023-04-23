import { FilterQuery, QueryOptions, UpdateQuery, UpdateWriteOpResult } from 'mongoose'
import { Product, ProductDocument, ProductInput } from '../models/Product'

export async function saveProduct(input: ProductInput): Promise<ProductDocument> {
  return Product.create(input)
}

export async function findProducts(
  query?: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true },
): Promise<ProductDocument[]> {
  const products = await Product.find(query, {}, options)
  return products
}

export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true },
): Promise<ProductDocument> {
  const user = await Product.findOne(query, {}, options)
  return user
}

export async function updateSingleProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options?: QueryOptions,
): Promise<UpdateWriteOpResult> {
  return Product.updateOne(query, update, options)
}

export async function updateProducts(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options?: QueryOptions,
): Promise<UpdateWriteOpResult> {
  return Product.updateMany(query, update, options)
}

export async function deleteSingleProduct(
  query: FilterQuery<ProductDocument>,
): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
  return Product.deleteOne(query)
}

export async function deleteProducts(
  query: FilterQuery<ProductDocument>,
): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
  return Product.deleteMany(query)
}
