import mongoose, { Error } from "mongoose";
import { userSchema } from "./user.schema.js";

import { ApplicationError } from "../../error-handler/applicationEror.js";
const userModel=mongoose.model('users',userSchema)

export default class UserRepository{
    
    async signup(user){
        try {
            const newUser= new userModel(user);
            await newUser.save();
            return newUser;
        } 
        catch (err) {

            console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
                throw new ApplicationError("something went wrong with database",500)
            }
        }
    }

    async signin(email,password){
        try {
            userModel.findOne({email,password});
        } 
        catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }
    }
    async findByEmail(email){
        try{
            
            return await userModel.findOne({email});
            
    
            }catch(err){
                console.log(err);
                throw new ApplicationError("something went wrong with database",500)
            }

        
        }

    async resetPassword(userId,newPassword){
        try {
            let user=await userModel.findById(userId);
            if(user){
                user.password=newPassword;
                user.save();
            }else{
                throw new Error("user not found");l
            }
        } catch (err) {
            console.log(err);
                throw new ApplicationError("something went wrong with database",500)
        }
    }

    
}