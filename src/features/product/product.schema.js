import mongoose from "mongoose";

export const productSchema=new mongoose.Schema({
    name:String,
    price:Number,
    category:String,
    description :String,
    imageUrl:String,
    inStock:Number,
    sellerId:{type:mongoose.Schema.Types.ObjectId,ref:'user'}, // owner — the seller who created it

    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'review'
        }
    ],
    categories:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    }]
});