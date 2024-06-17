import mongoose from "mongoose";
import { DB_NAME } from "./constants";


const connectDB=async ()=>{

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        
    } catch (error) {
        const err: Error = error as Error;
        
        process.exit(1);
    }
}

export {connectDB}