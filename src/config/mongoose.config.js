import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config();
const url=process.env.DB_URL;

export const connectUsingMongoose = async()=>{
    try {
        await mongoose
         .connect(url,{useNewUrlParser:true,UseUnifiedTopology:true});
        console.log("MongoDB using mongoose is connected")
        addCategories()
        } catch (err) {
        console.group(err);
    }
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