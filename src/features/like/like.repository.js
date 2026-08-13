import mongoose from "mongoose"
import { likeSchema } from "./like.schema.js"
import { ObjectId } from "mongodb"
import UserModel from '../user/user.schema.js';
import { ApplicationError } from "../../error-handler/applicationEror.js";

const LikeModel=mongoose.model('Like',likeSchema)
export class LikeRepository{
    // Idempotent: liking the same item twice returns the existing like instead of
    // creating a duplicate (works with the unique {user,likeable} index).
    async #like(userId, likeableId, types){
        try {
            const filter={ user:new ObjectId(userId), likeable:new ObjectId(likeableId), types };
            return await LikeModel.findOneAndUpdate(
                filter,
                { $setOnInsert: filter },
                { upsert:true, new:true, setDefaultsOnInsert:true }
            );
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }
    }

    likeProduct(userId,productId){ return this.#like(userId,productId,'product'); }
    likeCategory(userId,categoryId){ return this.#like(userId,categoryId,'category'); }

    async getLikes(type,id,skip=0,limit=20){
        try {
            return await LikeModel.find({
                likeable:new ObjectId(id),
                types:type
            }).skip(skip).limit(limit).populate({path:'likeable',model:type})
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }
    }
}