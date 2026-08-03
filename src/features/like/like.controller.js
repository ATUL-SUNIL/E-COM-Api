import { LikeRepository } from "./like.repository.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
export class LikeController{
    constructor(){
        this.likeRepository= new LikeRepository();
    }

    async likeItem(req,res,next){
        try {
            const {id,type}=req.body;
            const userId=req.userId;
            // A switch with a default guarantees every path sends a response —
            // no value can slip through and leave the connection hanging.
            switch(type){
                case 'product':
                    return res.status(200).send(await this.likeRepository.likeProduct(userId,id));
                case 'category':
                    return res.status(200).send(await this.likeRepository.likeCategory(userId,id));
                default:
                    return res.status(400).send('Invalid type');
            }
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }

    async getLikes(req,res,next){
        try {
            const {id,type}=req.query;
            const likes=await this.likeRepository.getLikes(type,id)
            return res.status(200).send(likes)
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
}