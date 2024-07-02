import cartItemModel from "./cartItems.model.js";

export default class cartItemsController{
    add(req,res){
        const {productId,quantity}=req.query;
        const userId=req.userId;
        cartItemModel.add(productId,userId,quantity);
        res.status(201).send('cart is updated');
    }
     get(req,res){
        const userId=req.userId;
        const cart=cartItemModel.get(userId);
        return res.status(201).send(cart);

     }
     delete(req,res){
        const userId=req.userId;
        const cartItemId=req.params.id;
        const error=cartItemModel.delete(cartItemId,userId);
        if(error){
            res.status(404).send(error);
        }
        return res.status(200).send("cart item deleted");
     }

}