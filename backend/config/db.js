import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        // URI -- uniform resource identifier
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error){
        console.error(`Error connecting to MongoD: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;