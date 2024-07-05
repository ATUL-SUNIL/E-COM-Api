import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";
export default class CartItemsRepositories{
    constructor(){
        this.collection="cartItems";
    }

    async add(productId,userId,quantity){
        try {
            const db=getDB();
        const collection=db.collection(this.collection)
        const id=await this.getNextCounter(db);
        await collection.updateOne(
            {productId:new ObjectId(productId),userId:new ObjectId(userId)},
            {
            $setOnInsert:{_id:id},
            $inc :{
                quantity:quantity
            }},
            {upsert:true}
        )
        } catch (err) {
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }

    async get(userId){
        try {
            const db=getDB();
            const collection=db.collection(this.collection)
            const cart=await collection.find({userId:new ObjectId(userId)}).toArray();
            return cart;

        } catch (err) {
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }
    
    async delete(userId,cartItemsId){
        try {
            const db=getDB();
            const collection=db.collection(this.collection)
            const result=await collection.deleteOne({_id:new ObjectId(cartItemsId),userId:new ObjectId(userId)})
            return result.deletedCount>0;
        } catch (err) {
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }

    async getNextCounter(db){
        // const counter = await db.collection("counters").findOneAndUpdate(
        //     {_id:'cartItemId'},
        // {$inc:{value:1}},
        // {returnDocument:'after'})
        const counter = await db.collection("counters").findOneAndUpdate(
            { _id: 'cartItemId' },
            { $inc: { value: 1 } },
            { returnDocument: 'after' }
        );
    
    return counter.value;
    }
}