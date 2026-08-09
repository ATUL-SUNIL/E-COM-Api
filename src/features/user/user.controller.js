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
 // Compared against when no user is found, so sign-in takes the same time whether
 // or not the account exists (defeats the timing side-channel).
 const DUMMY_HASH = bcrypt.hashSync("invalid-placeholder-password", 12);
 export default class UserController{

    constructor(){
        this.userRepository=new UserRepository;
    }
    async signUp(req,res,next){
        try{
        // input already validated by the route's Zod schema (name/email/password/type)
        const{name,email,password,type}=req.body;
        const hashedPassword=await bcrypt.hash(password,12);
        const user=new UserModel(name,email,hashedPassword,type);
        
        await this.userRepository.signup(user);
        // never return the password (even hashed)
        res.status(201).send({name:user.name,email:user.email,type:user.type});
        }catch(err){
            next(err);
            console.log(err);
            // throw new ApplicationError("something went wrong",500)
        }
    }

    async signIn(req,res,next){
        try{
            const user=await this.userRepository.findByEmail(req.body.email)
            // Always run a compare — dummy hash when the user doesn't exist — so
            // both the message AND the timing are identical (no enumeration oracle).
            const hash = user ? user.password : DUMMY_HASH;
            const passwordMatches = await bcrypt.compare(req.body.password, hash);
            if(!user || !passwordMatches){
                return res.status(401).send("invalid email or password");
            }
            const token=jwt.sign(
                {userId:user._id,email:user.email,type:user.type,tv:user.tokenVersion||0},
                process.env.JWT_SECRET,
                {expiresIn:'1h'}
            );
            return res.status(200).send(token);
        }catch(err){
            console.log(err);
            return next(err);
        }
    }

    async resetPassword(req,res,next){
        try {
            // currentPassword + newPassword shapes validated by the route's Zod schema
            const {currentPassword,newPassword}=req.body;
            const userId=req.userId;
            const user=await this.userRepository.findById(userId);
            if(!user){
                return res.status(404).send("user not found");
            }
            // must prove knowledge of the current password before changing it
            const passwordMatches=await bcrypt.compare(currentPassword,user.password);
            if(!passwordMatches){
                return res.status(400).send("current password is incorrect");
            }
            const hashedPassword=await bcrypt.hash(newPassword,12);
            await this.userRepository.resetPassword(userId,hashedPassword);
            res.status(200).send("password is reset");
        } catch (err) {
            console.log(err);
            return next(err);
        }
    }
 }