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
            if(type!='product' && type!='catrgory'){
                return res.status(400).send('Invalid type')
            }
            if(type=='product'){
                const like=await this.likeRepository.likeProduct(userId,id)
                return res.status(200).send(like);
            }
            if(type=='category'){
                const like=await this.likeRepository.likeCategory(userId,id)
                return res.status(200).send(like);
            }
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong",500)
            
            
        }
    }

    async getLikes(req,res,next){
        try {
            const {id,type}=req.query;
            const likes=await this.likeRepository.getLikes(type,id)
            return res.status(200).send(likes)
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong",500)
            
            
        }
    }
}