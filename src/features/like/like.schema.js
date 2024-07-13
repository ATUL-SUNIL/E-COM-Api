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
}).pre('save',(next)=>{
    console.log("new like coming in");
    next();
}).post('save',(doc)=>{
    console.log("like is saved")
    console.log(doc)
}).pre('find',(next)=>{
    console.log("retrieving likes");
    next();
}).post('find',(doc)=>{
    console.log("find is completed")
    console.log(doc)
})