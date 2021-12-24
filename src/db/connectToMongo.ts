import mongoose from 'mongoose';

const connectToMongo = async (MONGODB_URI: string): Promise<void> => {
    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB database successfully connected at ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectToMongo;
