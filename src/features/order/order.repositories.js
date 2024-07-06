import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
import OrderModel from "./order.model.js";

export default class OrderRepository{
    constructor(){
        this.collection="orders";
    }

    async placeOrder(userId){
        const client=getClient();
            const session = client.startSession()
        try {
            
            const db=getDB();
            session.startTransaction();
            //1. get cartitems and calculate totalamount
            const items=await this.getTotalAmount(userId,session);
            const totalAmount=items.reduce((acc,item)=>acc+item.totalAmount,0);
            console.log(totalAmount);

            //2.create an order record

            const newOrder=new OrderModel
                (new ObjectId(userId),totalAmount,new Date());
            await db.collection(this.collection).insertOne(newOrder,session) ;
            
            //3. reduce the stock

            for(let item of items){
                await db.collection("products").updateOne({
                    _id: item.productId
                },
                {
                    $inc:{stock: -item.quantity}
                },{session}
            )
            }

            //4. clear cart 
            await db.collection("cartItems").deleteMany({
                userId:new ObjectId(userId)
            },{session})
            await session.commitTransaction();
            session.endSession();
            return;

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
           
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }

    async getTotalAmount(userId,session){
        const db=getDB();
        const items=await db.collection("cartItems").aggregate([
            //1. get cart otems from user
            {
                $match:{
                    userId:new ObjectId(userId)
                }
            },
            //2.get products from products collection
            {
                $lookup:{
                    from:"products",
                    localField:"productId",
                    foreignField:"_id",
                    as:"productInfo"
                }
            },
            //3. unwind product info
            {
                $unwind:"$productInfo"
            },
            //4.calculate total amounbt for each cartItem
            {
                $addFields:{
                    "totalAmount":{
                    $multiply:["$productInfo.price","$quantity"]
                    }
                }
            }
        ],{session}).toArray();
        return items;
        
    }
}