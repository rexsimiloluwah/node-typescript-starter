import { FilterQuery, QueryOptions, UpdateQuery, UpdateWriteOpResult } from 'mongoose'
import { Token, TokenInput, TokenDocument } from '../models/Token'

export async function saveToken(input: TokenInput) {
  return Token.create(input)
}

export async function findTokens(
  query?: FilterQuery<TokenDocument>,
  options: QueryOptions = { lean: true },
): Promise<TokenDocument[]> {
  const tokens = await Token.find(query, {}, options)
  return tokens
}

export async function findToken(
  query: FilterQuery<TokenDocument>,
  options: QueryOptions = { lean: true },
): Promise<TokenDocument> {
  const token = await Token.findOne(query, {}, options)
  return token
}

export async function updateSingleToken(
  query: FilterQuery<TokenDocument>,
  update: UpdateQuery<TokenDocument>,
  options: QueryOptions = { lean: true },
): Promise<UpdateWriteOpResult> {
  return Token.updateOne(query, update, options)
}

export async function updateTokens(
  query: FilterQuery<TokenDocument>,
  update: UpdateQuery<TokenDocument>,
  options: QueryOptions = { lean: true },
): Promise<UpdateWriteOpResult> {
  return Token.updateMany(query, update, options)
}

export async function deleteSingleToken(
  query: FilterQuery<TokenDocument>,
): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
  return Token.deleteOne(query)
}

export async function deleteTokens(
  query: FilterQuery<TokenDocument>,
): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
  return Token.deleteMany(query)
}
