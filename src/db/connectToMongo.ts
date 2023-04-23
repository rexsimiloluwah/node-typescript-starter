import mongoose from 'mongoose'
import logger from '../utils/logger'

const connectToMongo = async (MONGODB_URI: string): Promise<void> => {
  logger.debug(MONGODB_URI)
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      authSource: 'admin',
      user: process.env.MONGO_AUTH_USER,
      pass: process.env.MONGO_AUTH_PASSWORD,
    })
    logger.info(`MongoDB database successfully connected at ${conn.connection.host}`)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

export default connectToMongo
