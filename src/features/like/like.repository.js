import mongoose from "mongoose"
import { likeSchema } from "./like.schema.js"
import { ObjectId } from "mongodb"
import UserModel from '../user/user.schema.js';

const LikeModel=mongoose.model('Like',likeSchema)
export class LikeRepository{
    async likeProduct(userId,productId){
        try {
            const newLike= new LikeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(productId),
                types:'product'
            })
            const savedLike=await newLike.save();
            return savedLike;
        } catch (err) {
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }

    async likeCategory(userId,categoryId){
        try {
            const newLike= new LikeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(categoryId),
                types:'category'
            })
            const savedLike=await newLike.save();
            
            return savedLike;
        } catch (err) {
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }
    async getLikes(type,id){
        return await LikeModel.find({
            likeable:new ObjectId(id),
            types:type
        }).populate({path:'likeable',model:type})
    }
}