import express from 'express';
import cartItemsController from './cartItems.controllers.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { addToCartSchema, cartItemIdSchema } from './cartItems.validation.js';

const cartRouter=express.Router();

const cartController=new cartItemsController();
cartRouter.post('/',validate(addToCartSchema),(req,res,next)=>cartController.add(req,res,next));

cartRouter.get('/',(req,res,next)=>cartController.get(req,res,next));

cartRouter.delete('/:id',validate(cartItemIdSchema),(req,res,next)=>cartController.delete(req,res,next));

export default cartRouter;