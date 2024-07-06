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
            return collection.find(filterExpression)
            //.project({name:1,price:1}) only send name and proce attributes for exclusion give 0
            //$slice for limiting number 
            .toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }

    // async rate(userId,productId,rating){
    //     try {
    //         const db=getDB();
    //         const collection=db.collection(this.colection);

    //         //find product
    //         const product=await collection.findOne({_id:new ObjectId(productId)});
    //         //find rating
    //         const userRating=product?.ratings.find(r=>r.userId==userId)
            
    //         if (userRating) {
    //             //update rating
    //             await collection.updateOne({
    //                 _id:new ObjectId(productId),
    //                 "ratings.userId":new ObjectId(userId)
    //             },
    //             {
    //                 $set:{
    //                     "ratings.$.rating":rating
    //                 }
    //             } )
    //         } else {
    //             await collection.updateOne({
    //                 _id:new ObjectId(productId)
    //             },{
    //                 $push:{ratings:{userId:new ObjectId(userId),
    //                     rating}}
    //             })    
    //         }
                    
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError
    //             ("something went wrong with database",500)
    //     }
    // }
//another approach to avoid race condition
    async rate(userId,productId,rating){
        try {
            const db=getDB();
            const collection=db.collection(this.colection);
            //1.remove existing entry
            await collection.updateOne({
                _id:new ObjectId(productId)
            },{
                $pull:{ratings:{userId:new ObjectId(userId)}}
            })    
            //2. add new entry
            await collection.updateOne({
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

    async averageProductPricePerCategory(){
        try {
        const db=getDB();
        const collection =db.collection(this.colection);
        return await collection.aggregate([{
            //stage 1 get avg price per category
            $group:{
                _id:"$category",
                averagePrice:{
                    $avg:"$price"
                }
            }
        }]).toArray();

        } catch (err) {
            console.log(err);
            throw new ApplicationError
                ("something went wrong with database",500)
        }
    }

}

export default ProductRepository;