import mongoose from "mongoose";


export const likeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'types'
    },
    types:{
        type:String,
        enum:['product','category']
    }
});

// one like per user per item — prevents duplicate likes / inflated counts
likeSchema.index({ user: 1, likeable: 1 }, { unique: true });