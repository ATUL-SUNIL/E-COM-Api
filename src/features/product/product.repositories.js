import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
class ProductRepository{

    constructor(){
        this.colection="products";
    }
    async add(newProduct){
        try {
            const db=getDB();

            const collections =db.collection(this.colection);

            await collections.insertOne(newProduct);
            console.log(newProduct);
            return newProduct;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }
    }

    async getAll(){
        try {
            const db=getDB();
            const collection=db.collection(this.colection);
            const products= await collection.find().toArray();
            
            return products;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }
    }

    async get(id){
        try {
            const db=getDB();
            const collection=db.collection(this.colection);
            return await collection.findOne({_id: new ObjectId(id)});
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }
    }

    async filter(minPrice,maxPrice,category){
        try {
            const db=getDB();
            const collection=db.collection(this.colection);
            let filterExpression={};
            if(minPrice){
                filterExpression.price={$gte:parseFloat(minPrice)}
            }
            if(maxPrice){
                filterExpression.price={...filterExpression.price,$lte:parseFloat(maxPrice)}
            }
            if(category){
                
                filterExpression.category=category;
            }
            return collection.find(filterExpression).toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }

    rate(userId,productId,rating){
        try {
            const db=getDB();
            const collection=db.collection(this.colection);
            collection.updateOne({
                _id:new ObjectId(productId)
            },{
                $push:{ratings:{userId:new ObjectId(userId),
                    rating}}
            })            
        } catch (err) {
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }

}

export default ProductRepository;