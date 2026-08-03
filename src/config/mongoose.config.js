import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config();
const url=process.env.DB_URL;

export const connectUsingMongoose = async()=>{
    // No try/catch swallow — if the connection fails, the error must reach the
    // startup code so it can abort instead of pretending the server is healthy.
    await mongoose.connect(url,{useNewUrlParser:true,UseUnifiedTopology:true});
    console.log("MongoDB using mongoose is connected");
    await addCategories();
}

async function addCategories(){
    const categoryModel= mongoose.model('category',categorySchema);
    const categories = await categoryModel.find();
    if(!categories || categories.length==0){
        await categoryModel.insertMany([{name:'books'},
            {name:'electronics'},
            {name:'clothing'}
        ])
        console.log("categories added")
    }
}