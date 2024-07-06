import OrderRepository from "./order.repositories.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
export default class OrderController{
    constructor(){
        this.orderRepository=new OrderRepository();
    }

    async placeOrder(req,res,next){
        try {
            const userId=req.userId;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("order is created")
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong",500 )        
        }
    }
}