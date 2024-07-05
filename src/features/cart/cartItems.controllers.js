import cartItemModel from "./cartItems.model.js";
import CartItemsRepositories from "./cartItems.repositories.js";
export default class cartItemsController{
    constructor(){
        this.cartItemRepository=new CartItemsRepositories();
    }
    async add(req,res){
        try{
        const {productId,quantity}=req.body;
        const userId=req.userId;
        await this.cartItemRepository.add(productId,userId,quantity);
        return res.status(201).send('cart is updated');
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong",500 )
        }
    }
     async get(req,res){
        try {
        const userId=req.userId;
        const cart=await this.cartItemRepository.get(userId);
        return res.status(201).send(cart);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong",500 )
        }
        

     }
     async delete(req,res){
        try {
        const userId=req.userId;
        const cartItemsId=req.params.id;
        const isDeleted=
            await this.cartItemRepository.delete(userId,cartItemsId);
        if(!isDeleted){
            return res.status(404).send("item not fpund");
        }
        else{
            return res.status(200).send("cart item deleted");

        }
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong",500 )
        }
        
     }

}