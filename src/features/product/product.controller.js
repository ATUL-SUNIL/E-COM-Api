import UserModel from "../user/user.model.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repositories.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
import { paginate } from "../../utils/pagination.js";
export default class ProductController{

    constructor(){
        this.productRepository=new ProductRepository();
    }
    async getAllProducts(req,res,next){
        try{
        const {skip,limit}=paginate(req.query);
        const products =await this.productRepository.getAll(skip,limit);
        res.status(200).send(products);
        }catch (err) {
            console.log(err);
            return next(err);
    }
    }

    async addProduct(req, res, next){
        try {
        const {name,price,sizes,categories,description} = req.body;

        const newProduct = new ProductModel
        (name,
        description,
        parseFloat(price),
        req?.file?.filename,
        categories,
        sizes?.split(','));
        newProduct.sellerId = req.userId; // record the owning seller
        newProduct.inStock = req.body.inStock; // starting inventory (validated; defaults to 100)

        const createdRecord=await this.productRepository.add(newProduct);
        res.status(201).send(createdRecord);
        } catch (err) {
            console.log(err);
            return next(err);
    }
}

    async rateProduct(req,res,next){
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
            // don't leak internal error text to the client — route through the handler
            console.log(err);
            return next(err);
        }
    }

    async getOneProduct(req,res,next){

        try{
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if (!product) {
                return res.status(404).send("Product not found");
            }
            res.status(200).send(product);
            }
        catch (err) {
            console.log(err);
            return next(err);
        }


    }

    async filterProducts(req, res, next) {
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
            return next(err);
        }

    }

    async averagePrice(req,res,next){
        try {
            const result=await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);

        } catch (err) {
            console.log(err);
            return next(err);
        }
    }

}
