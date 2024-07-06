import UserModel from "../user/user.model.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repositories.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
export default class ProductController{

    constructor(){
        this.productRepository=new ProductRepository();
    }
    async getAllProducts(req,res){
        try{
        const products =await this.productRepository.getAll();
        res.status(200).send(products);
        }catch (err) {
            console.log(err);
                // next(err);
            throw new ApplicationError("something went wrong",500)    
    }
    }

    async addProduct(req, res){
        try {
        const {name,price,sizes} = req.body;

        const newProduct = new ProductModel
        (name,
        null,
        parseFloat(price),     
        req.file.filename,
        null,
        sizes.split(','));

        const createdRecord=await this.productRepository.add(newProduct);
        res.status(201).send(createdRecord);
        } catch (err) {
            console.log(err);
                // next(err);
            throw new ApplicationError("something went wrong",500)
        
        
    }
}

    async rateProduct(req,res){
        
        try {
            const userId=req.userId;
            const productId=req.body.productId;
            const rating=req.body.rating;
            await this.productRepository.rate(
                userId,
                productId,
                rating
            );
            return res.status(200).send("rating had been added");
        } catch (err) {
            return res.status(400).send(err.message);
        }
        
    }

    async getOneProduct(req,res){

        try{
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if (!product) {
                return next(new ApplicationError("Product not found", 404));
            }
            res.status(200).send(product);
            }
        catch (err) {
            console.log(err);
                    // next(err);
            throw new ApplicationError("something went wrong",500 )
        }

        
    }

    async filterProducts(req, res) {
        try {
            const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const category = req.query.category;
        const result = await this.productRepository.filter(
            minPrice,
            maxPrice,
            category
        );
        res.status(200).send(result);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong",500 )
        }
        
    }

    async averagePrice(req,res,next){
        try {
            const result=await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);

        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong",500 )        }
    }

}