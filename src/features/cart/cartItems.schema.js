import mongoose from "mongoose";

export const cartItems=new mongoose.Schema({
    productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    quantity:Number
});