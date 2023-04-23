import { FilterQuery, QueryOptions, UpdateQuery, UpdateWriteOpResult } from 'mongoose'
import { User, UserDocument, UserInput } from '../models/User'
import { databaseResponseTimeHistogram } from '../utils/metrics'

export async function saveUser(input: UserInput): Promise<UserDocument | any> {
  const metricsLabels = {
    operation: 'saveUser',
  }
  const timer = databaseResponseTimeHistogram.startTimer()
  try {
    const result = await User.create(input)
    timer({ ...metricsLabels, success: 1 })
    return result
  } catch (error) {
    timer({ ...metricsLabels, success: 0 })
    throw error
  }
}

export async function findUsers(
  query?: FilterQuery<UserDocument>,
  options: QueryOptions = { lean: true },
): Promise<UserDocument[]> {
  const users = await User.find(query, {}, options)
  return users
}

export async function findUser(
  query: FilterQuery<UserDocument>,
  options: QueryOptions = { lean: true },
): Promise<UserDocument> {
  const user = await User.findOne(query, {}, options)
  return user
}

export async function updateSingleUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = { lean: true },
): Promise<UpdateWriteOpResult> {
  return User.updateOne(query, update, options)
}

export async function updateUsers(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = { lean: true },
): Promise<UpdateWriteOpResult> {
  return User.updateMany(query, update, options)
}

export async function deleteSingleUser(
  query: FilterQuery<UserDocument>,
): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
  return User.deleteOne(query)
}

export async function deleteUsers(
  query: FilterQuery<UserDocument>,
): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
  return User.deleteMany(query)
}
