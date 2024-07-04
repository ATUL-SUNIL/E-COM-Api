import UserModel from "../user/user.model.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
export default class ProductModel{
    constructor(name, desc, price, imageUrl, category, sizes,id){
        this._id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.sizes = sizes;
    }
    
    // static add(product){
    //   product.id = products.length + 1;
    //   products.push(product);
    //   return product;
    // }

    // static get(id){
    //   const product = products.find((i)=>i.id ==id);
    //   return product;

    // }

    // static getAll(){
    //     return products;
    // }

    static filter(minPrice, maxPrice, category){
      const result = products.filter((product)=>{
        return(
        (!minPrice || 
          product.price >= minPrice) &&
        (!maxPrice || 
          product.price <= maxPrice) &&
        (!category || 
          product.category == category)
        );
      });
      return result;
    }


    static rateProduct(userId, productId, rating) {
      // 1. Validate user and product
      const user = UserModel.getAll().find((u) => u.id == userId);
      if (!user) {
        //user defined error
          throw new ApplicationError('User not found',400);
      }
  
      const product = products.find((p) => p.id == productId);
      if (!product) {
          throw new ApplicationError('Product not found',400);
      }
  
      // 2. Check for ratings; if not, then add ratings array
      if (!product.ratings) {
          product.ratings = [];  // Corrected this line to initialize the product's ratings array
      }
  
      // 3. Check if user has already given a rating
      const existingRatingIndex = product.ratings.findIndex((r) => r.userId == userId);
  
      if (existingRatingIndex >= 0) {
          // Update the existing rating
          product.ratings[existingRatingIndex] = {
              userId: userId,
              rating: rating,
          };
      } else {
          // If no existing rating, add a new rating
          product.ratings.push({
              userId: userId,
              rating: rating,
          });
      }
  
      // Optional: Save the updated product if needed, e.g., this.save(product);
  
      return null;  // No error
  }
  
    

} 

var products = [
    new ProductModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
      'Cateogory1'
    ),
    new ProductModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
      'Cateogory2',
      ['M', 'XL']
    ),
    new ProductModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
      'Cateogory3',
      ['M', 'XL','S']
    )];