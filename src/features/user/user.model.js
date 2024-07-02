import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
export default class UserModel{
    constructor(name,email,password,type){
        this.name=name;
        this.email=email;
        this.password=password;
        this.type=type;
    }
    // static async signUp(name,email,password,type){
    //     try{
    //     //1.get db
    //     const db=getDB();
    //      //2. get the collection
    //     const collection=db.collection("users");
    //     const newUser=new UserModel(name,email,password,type);

    //     //3. insert document
    //     await collection.insertOne(newUser);
    //     return newUser;

    //     }catch(err){
    //         throw new ApplicationError("something went wrong",500)
    //     }
    //                 //not needed when using mongoDB
    //                 // const newUser=new UserModel(name,email,password,type);
    //                 // users.push(newUser);
    // }


        static getAll(){
            return users;
        }
}


//for before mongoDB
// let users=[{
//     name:"Seller User",
//     email:"seller@ecom.com",
//     password:"password1",
//     type:"seller",
// },
// {
//     name:"Customer User",
//     email:"seller@ecom.com",
//     password:"password2",
//     type:"custom er",
// },
// ];