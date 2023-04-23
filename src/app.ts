import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import HttpError from './errors/HttpError'
import {
  AuthRouter,
  ProductRouter,
  UserRouter,
  AdminRouter,
  PublicRouter,
  UsersRouter,
} from './routes'
import responseTime from 'response-time'
import connectToMongo from './db/connectToMongo'
import express, { Request, Response, NextFunction } from 'express'
import swaggerDocs from './swagger'
import { sendNewEmail } from './queues/email.queue'
import { startMetricsServer, restResponseTimeHistogram } from './utils/metrics'
import logger from './utils/logger'

dotenv.config()

const cspDefaults = helmet.contentSecurityPolicy.getDefaultDirectives()
delete cspDefaults['upgrade-insecure-requests']

class App {
  public app: express.Express

  constructor(public port: number = Number(process.env.PORT) || 5040) {
    this.app = express()
  }

  connectToDB(): void {
    // connect to MongoDB
    let MONGODB_URI: string
    const NODE_ENV = process.env.NODE_ENV
    switch (NODE_ENV) {
      case 'development':
        MONGODB_URI = `mongodb://${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB_NAME}`
        break
      case 'production':
        MONGODB_URI = process.env.MONGO_URI_PROD as string
        break
      default:
        MONGODB_URI = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}`
        break
    }
    logger.info(MONGODB_URI)
    connectToMongo(MONGODB_URI)
  }

  loadMiddlewares(): void {
    // middlewares
    this.app.use(cors())
    //if(process.env.NODE_ENV==="production"){
      //this.app.use(helmet({ contentSecurityPolicy: { directives: cspDefaults } }))
    //}
    this.app.use(morgan('dev'))
    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(express.static(path.join(__dirname, 'public')))

    // response time middlewares
    this.app.use(
      responseTime((req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
          // observe the necessary information
          restResponseTimeHistogram.observe(
            {
              method: req.method,
              route: req.route.path,
              status_code: res.statusCode,
            },
            time * 1000,
          )
        }
      }),
    )
  }

  loadRoutes(): void {
    // Routes
    this.app.use('/api/v1/', PublicRouter)
    this.app.use('/api/v1/auth/', AuthRouter)
    this.app.use('/api/v1/products/', ProductRouter)
    this.app.use('/api/v1/user/', UserRouter)
    this.app.use('/api/v1/users/', UsersRouter)
    this.app.use('/api/v1/admin/', AdminRouter)
  }

  handleInvalidRoutes(): void {
    // Error handling routes
    this.app.use(() => {
      const error = new HttpError('Could not find specified route.', 404)
      throw error
    })

    this.app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return next(error)
      }

      return res.status(error.code || 500).json({
        status: false,
        error: error.message || 'An unknown error occurred.',
      })
    })
  }

  loadSwaggerDocs() {
    swaggerDocs(this.app, this.port)
  }

  init(): void {
    // Run the app server
    this.loadMiddlewares()
    this.loadRoutes()
    this.loadSwaggerDocs()

    // testing the email sending queue functionality
    this.app.post('/send-email', async (req, res) => {
      await sendNewEmail(req.body)
      res.status(200).json({
        status: true,
        message: 'Email has been added to the queue for processing',
      })
    })

    this.handleInvalidRoutes()
  }

  run(): void {
    // Run the app server
    this.connectToDB()
    this.init()
    this.app.listen(this.port, () => {
      logger.info(`Server is running on port: ${this.port}`)
    })
    startMetricsServer()
  }
}

export default new App()
