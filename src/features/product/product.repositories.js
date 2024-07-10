import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./reviews.schema.js";
import { error } from "console";
import { categorySchema } from "./category.schema.js";

const productModel= mongoose.model('product',productSchema)
const reviewModel= mongoose.model('review',reviewSchema)
const categoryModel=mongoose.model('category',categorySchema)
class ProductRepository{

    constructor(){
        this.colection="products";
    }
    async add(productData){
        try {
            
            productData.categories=productData.category.split(',').map(e=>e.trim());;
            console.log(productData)
            const newProduct=new productModel(productData);
            const savedProduct=newProduct.save()
            
            await categoryModel.updateMany({
                _id:{$in:productData.categories}
            },
        {
          $push:  {products: new ObjectId(savedProduct._id)}
        })
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


//another approach to avoid race condition
    async rate(userId,productId,rating){
        try {
            //check if product exists
            const product=await productModel.findById(productId)
            if(!product){
                throw new Error("product not found")
            } 
            
            //get existing review
            const userReview=await reviewModel.findOne({
                product: new ObjectId(productId),user:new ObjectId(userId)
            })
            if(userReview){
                userReview.rating=rating;
                await userReview.save()
            }else{
                const newReview=new reviewModel({
                    product: new ObjectId(productId),
                    user:new ObjectId(userId),
                    rating:rating,
                    
             })
             await newReview.save()
            }
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





//rate funcn before mongoose

// async rate(userId,productId,rating){
//     try {
//         const db=getDB();
//         const collection=db.collection(this.colection);
//         //1.remove existing entry
//         await collection.updateOne({
//             _id:new ObjectId(productId)
//         },{
//             $pull:{ratings:{userId:new ObjectId(userId)}}
//         })    
//         //2. add new entry
//         await collection.updateOne({
//             _id:new ObjectId(productId)
//         },{
//             $push:{ratings:{userId:new ObjectId(userId),
//                 rating}}
//         })    
                
//     } catch (err) {
//         console.log(err);
//         throw new ApplicationError
//             ("something went wrong with database",500)
//     }