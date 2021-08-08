import cors from 'cors';
import path from 'path';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import HttpError from './errors/HttpError';
import { AuthRouter, ProductRouter, UserRouter } from './routes';
import connectToMongo from './config/connectToMongo';
import express, { Request, Response, NextFunction } from 'express';

// Instantiate the express app
const app = express();

// load environment variables
dotenv.config();

// middlewares
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect to MongoDB
let MONGODB_URI: string;
const NODE_ENV = process.env.NODE_ENV;

switch (NODE_ENV) {
    case 'development':
        MONGODB_URI = 'mongodb://localhost:27017/typescript-starter';
        break;
    case 'production':
        MONGODB_URI = process.env.MONGO_URI_PROD as string;
        break;
    default:
        MONGODB_URI = 'mongodb://localhost:27017/typescript-starter';
        break;
}

connectToMongo(MONGODB_URI);

// Routes
app.use('/api/v1/auth/', AuthRouter);
app.use('/api/v1/products/', ProductRouter);
app.use('/api/v1/users/', UserRouter);

// Error handling routes
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new HttpError('Could not find specified route.', 404);
    throw error;
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(error);
    }

    return res.status(error.code || 500).json({
        status: false,
        error: error.message || 'An unknown error occurred.',
    });
});

export default app;
