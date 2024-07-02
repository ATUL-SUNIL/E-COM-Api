import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationEror.js";
class UserRepository{

    async signUp(newUser){
        try{
        //1.get db
        const db=getDB();
         //2. get the collection
        const collection=db.collection("users");
        //3. insert document
        await collection.insertOne(newUser);
        return newUser;

        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong with database",500)
        }

    }

    // async signIn(email,password){
    //     try{
    //         //1.get db
    //         const db=getDB();
    //          //2. get the collection
    //         const collection=db.collection("users");
    //         //3. find document
    //         return await collection.findOne({email,password});
            
    
    //         }catch(err){
    //             console.log(err);
    //             throw new ApplicationError("something went wrong with database",500)
    //         }

        
    //     }

        async findByEmail(email){
            try{
                //1.get db
                const db=getDB();
                 //2. get the collection
                const collection=db.collection("users");
                //3. find document
                return await collection.findOne({email});
                
        
                }catch(err){
                    console.log(err);
                    throw new ApplicationError("something went wrong with database",500)
                }
    
            
            }
}

export default UserRepository;