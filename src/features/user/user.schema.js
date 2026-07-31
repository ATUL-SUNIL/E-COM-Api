import mongoose from "mongoose";

export const userSchema=new mongoose.Schema({
    name:String,
    email:{type:String,unique:true,
            match:[/.+\@.+\../,"please enter a valid email"]},
    password:String,
    type:{type:String,enum:['customer','seller']}
})


const UserModel = mongoose.model('User', userSchema);
export default UserModel;