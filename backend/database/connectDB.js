import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(`Error connection to mongoDB: ${error.message}`);
		process.exit(1);
    }
};

export default connectDB;