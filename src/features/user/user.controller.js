//              for basic authentication
//  import UserModel from "./user.model.js";
//  export default class UserController{
//     signUp(req,res){
//         const{name,email,password,type}=req.body;
//         const user=UserModel.signUp(name,email,password,type);
//         res.status(201).send(user);
//     }

//     signIn(req,res){
        
//         const result=UserModel.signIn(req.body.email,req.body.password);
//         if(!result){
//             return res.status(400).send("invalid crentials")
//         }
//         else{
//             return res.status(200).send('login successful');
//         }
//     }
//  }


//                  for jwt
 import UserModel from "./user.model.js";
 import jwt from 'jsonwebtoken';
 import UserRepository from "./user.repository.js";
 import { ApplicationError } from "../../error-handler/applicationEror.js";
 import bcrypt from 'bcrypt'
 export default class UserController{

    constructor(){
        this.userRepository=new UserRepository;
    }
    async signUp(req,res,next){
        try{
        const{name,email,password,type}=req.body;
        const hashedPassword=await bcrypt.hash(password,12);
        const user=new UserModel(name,email,hashedPassword,type);
        
        await this.userRepository.signup(user);
        res.status(201).send(user);
        }catch(err){
            next(err);
            console.log(err);
            // throw new ApplicationError("something went wrong",500)
        }
    }

    async signIn(req,res,next){
        try{
            const user=await this.userRepository.findByEmail(req.body.email)
            if(!user){
                return res.status(400).send("email not found")
            }
            else{
                //compare password with hashed password
                const result=await bcrypt.compare(req.body.password,user.password)
                if(result){
                    //1. create token
                    const token=jwt.sign({userId:user._id,email:user.email},
                    process.env.JWT_SECRET,
                    {expiresIn:'1h'})
            //2. send token
                    return res.status(200).send(token);
                }
                else{
                    return res.status(400).send("incorrect password")
                }
            }
        }catch(err){
        console.log(err);
        // next(err);
        throw new ApplicationError("something went wrong",500)
    }
    }

    async resetPassword(req,res,next){
        const {newPassword}=req.body;
        const userId=req.userId;
        const hashedPassword=await bcrypt.hash(newPassword,12);
        try {
            await this.userRepository.resetPassword(userId,hashedPassword);
            res.status(200).send("password is reset")
        } catch (err) {
            console.log(err);
            throw new ApplicationError("something went wrong",500)
        }
    }
 }