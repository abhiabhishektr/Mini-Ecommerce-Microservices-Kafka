import mongoose from "mongoose";
import { env } from "./env";


const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}; 

export default connectDB;
