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
 import UserRepository from "./user.repositories.js";
 import { ApplicationError } from "../../error-handler/applicationEror.js";
 export default class UserController{

    constructor(){
        this.userRepository=new UserRepository;
    }
    async signUp(req,res){
        try{
        const{name,email,password,type}=req.body;
        const user=new UserModel(name,email,password,type);
        
        await this.userRepository.signUp(user);
        res.status(201).send(user);
        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong",500)
        }
    }

    async signIn(req,res,next){
        try{
        const result=await this.userRepository.signIn(
            req.body.email,req.body.password);
            // console.log(result);
        if(!result){
            return res.status(400).send("incorrect crentials")
        }
        else{
            //1. create token
            const token=jwt.sign({userId:result.id,email:result.email},
                'LAssfftijYn8kAHktJp0gHcx0CHU4tsn',
                {expiresIn:'1h'})
            //2. send token
            return res.status(200).send(token);
        }
    }catch(err){
        console.log(err);
        // next(err);
        throw new ApplicationError("something went wrong",500)
    }
    }
 }