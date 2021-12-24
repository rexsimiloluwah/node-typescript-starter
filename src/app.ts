import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import HttpError from './errors/HttpError';
import { AuthRouter, ProductRouter, UserRouter, AdminRouter } from './routes';
import connectToMongo from './db/connectToMongo';
import express, { Request, Response, NextFunction } from 'express';
dotenv.config();

class App {
    public app: express.Express;

    constructor(public port: number = Number(process.env.PORT) || 5000) {
        this.app = express();
    }

    connectToDB(): void {
        // connect to MongoDB
        let MONGODB_URI: string;
        const NODE_ENV = process.env.NODE_ENV;
        switch (NODE_ENV) {
            case 'development':
                MONGODB_URI = process.env.MONGO_URI_DEV as string;
                break;
            case 'production':
                MONGODB_URI = process.env.MONGO_URI_PROD as string;
                break;
            default:
                MONGODB_URI = process.env.MONGO_URI as string;
                break;
        }
        connectToMongo(MONGODB_URI);
    }

    logs(): void {
        console.log(`Server is successfully running on PORT ${this.port} 🚀..`);
    }

    loadMiddlewares(): void {
        // middlewares
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    loadRoutes(): void {
        // Routes
        this.app.use('/api/v1/auth/', AuthRouter);
        this.app.use('/api/v1/products/', ProductRouter);
        this.app.use('/api/v1/users/', UserRouter);
        this.app.use('/api/v1/admin/', AdminRouter);

        // Error handling routes
        this.app.use(() => {
            const error = new HttpError('Could not find specified route.', 404);
            throw error;
        });

        this.app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
            if (res.headersSent) {
                return next(error);
            }

            return res.status(error.code || 500).json({
                status: false,
                error: error.message || 'An unknown error occurred.',
            });
        });
    }

    run(): void {
        // Run the app server
        this.loadMiddlewares();
        this.loadRoutes();
        this.connectToDB();
        this.app.listen(this.port);
        this.logs();
    }
}

export default new App();
