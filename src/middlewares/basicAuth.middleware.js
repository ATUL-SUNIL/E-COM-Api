// import UserModel from "../features/user/user.model.js";

// const basicAuthorizer =(req,res,next)=>{
//     //1- check if authorization header is empty

//     const authHeader = req.headers["authorization"];
//     if(!authHeader){
//         res.status(401).send("no authorization details found");
//     }

//     //2- extract credentials

//     const base64credentials =authHeader.replace('Basic','');
//     console.log(base64credentials);

//     //3- decoding credentials

//     const decodedCreds = Buffer.from(base64credentials,'base64').toString('utf-8')
//     console.log(decodedCreds);
//     const creds = decodedCreds.split(':');
//     const user=UserModel.getAll().find((u)=>u.email==creds[0] && u.password==creds[1]);
//     if(user){
//         next();
//     }
//     else{
//         return res.status(401).send("incorrect credentials");
//     }
// }   

// export default basicAuthorizer;