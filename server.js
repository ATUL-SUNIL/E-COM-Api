//import evironment config
import "./env.js";
// 1. Import express
import express from 'express';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cors from 'cors'
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cart/cartItems.routes.js';
import orderRouter from "./src/features/order/order.router.js";

import swagger from 'swagger-ui-express';
import apiDocs from './swagger.json' assert {type:'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationEror.js';
import {connectToMongoDB} from './src/config/mongodb.js';
// 2. Create Server
const server = express();

//load all environment variables in applications

server.use(express.json());

        //*CORS policy configuration without library*
// server.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*');
//     //* gives acces to all if u want specific give the address
//     res.header('Access-Control-Allow-Headers','*')//for headers
//     res.header('Access-Control-Allow-Methods','*')//for methods ..get,post...
//     //return ok for preflight request
//     if(req.method=="OPTIONS"){
//         return res.sendStatus(200)
//     }
//     next();
    
// })


        //*CORS policy configuration with library*
    server.use(cors());//all headers all origins 

    
//                  using basic auth
// server.use("/api/products",basicAuthorizer,productRouter);
//                  using jwt

server.use("/api-docs",swagger.serve,swagger.setup(apiDocs))

server.use(loggerMiddleware);

server.use("/api/users",userRouter)
server.use("/api/cartItems",jwtAuth,cartRouter);
server.use("/api/products",jwtAuth,productRouter);
server.use("/api/orders",jwtAuth,orderRouter)


// 3. Default request handler
server.get('/', (req, res)=>{
    res.send("Welcome to Ecommerce APIs");
});
//Error handler middleware
server.use((err,req,res,next)=>{
    console.log(err);
    if(err instanceof ApplicationError){
    res.status(err.code).send(err.message)
    }
    else{
        res.status(500).send('something went wrong,please try again later')

    }
})
//4.middleware to handle 404
server.use((req,res)=>{
    res.status(404).send("API NOT FOUND.Please check our documentation for more info at localhost:3200/api-docs");
})

// 5. Specify port.
server.listen(3200,()=>{
    console.log("Server is running at 3200");
    connectToMongoDB();
});

