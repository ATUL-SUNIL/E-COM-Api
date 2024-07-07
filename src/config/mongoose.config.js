import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url=process.env.DB_URL;

export const connectUsingMongoose = async()=>{
    try {
        await mongoose
         .connect(url,{useNewUrlParser:true,UseUnifiedTopology:true});
        console.log("MongoDB using mongoose is connected")
        } catch (err) {
        console.group(err);
    }
}