import express from "express";
import { LikeController } from "./like.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { likeSchema, getLikesSchema } from "./like.validation.js";
const LikeRouter=express.Router();

const likeController=new LikeController();

LikeRouter.post('/',validate(likeSchema),(req,res,next)=>likeController.likeItem(req,res,next));
LikeRouter.get('/',validate(getLikesSchema),(req,res,next)=>likeController.getLikes(req,res,next));

export default LikeRouter;