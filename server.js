//import evironment config
import "./env.js";
// 1. Import express
import express from 'express';
// route async handlers that throw are forwarded to the error middleware (Express 4)
import 'express-async-errors';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cors from 'cors'
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { globalLimiter, authLimiter } from './src/middlewares/rateLimit.middleware.js';
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cart/cartItems.routes.js';
import orderRouter from "./src/features/order/order.router.js";

import swagger from 'swagger-ui-express';
import apiDocs from './swagger.json' with {type:'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationEror.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import { connectUsingMongoose } from "./src/config/mongoose.config.js";
import mongoose from "mongoose";
import LikeRouter from "./src/features/like/like.routes.js";
// 2. Create Server
const server = express();
server.disable('x-powered-by'); // stop advertising the stack

//load all environment variables in applications

// JSON APIs here are tiny (auth, cart, rate). Cap the body so a huge POST
// cannot sit in memory. Multipart uploads use multer's own 2MB limit.
server.use(express.json({ limit: "16kb" }));

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


    // CORS — only allow the origins we explicitly name (browser cross-origin guard)
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
        .split(",").map((o) => o.trim()).filter(Boolean);
    server.use(cors({
        origin: allowedOrigins.length ? allowedOrigins : false,
        credentials: true,
    }));

// Swagger docs are mounted BEFORE helmet — helmet's strict CSP would block Swagger UI's inline assets.
server.use("/api-docs",swagger.serve,swagger.setup(apiDocs))

// Security headers (CSP, X-Content-Type-Options: nosniff, frameguard, HSTS…) for everything below.
server.use(helmet());

// Strip any $-prefixed / dotted keys from body, query & params so a client can
// never smuggle a MongoDB operator into a query (defense-in-depth for 2.1 / 2.8).
server.use(mongoSanitize());

// Uploaded files come AFTER helmet so they inherit nosniff + CSP (defense-in-depth for the upload XSS).
server.use("/uploads",express.static('uploads'))

server.use(loggerMiddleware);

// General per-IP cap on all API traffic.
server.use(globalLimiter);

// Auth routes get a strict, failure-only limiter on top of the global cap.
server.use("/api/users",authLimiter,userRouter)
server.use("/api/cartItems",jwtAuth,cartRouter);
// products: reads are public (browse without login); writes are guarded inside the router
server.use("/api/products",productRouter);
server.use("/api/orders",jwtAuth,orderRouter)
server.use("/api/likes",jwtAuth,LikeRouter)

// 3. Default request handler
server.get('/', (req, res)=>{
    res.send("Welcome to Ecommerce APIs");
});
//Error handler middleware
server.use((err,req,res,next)=>{
    console.log(err);

    if(err instanceof mongoose.Error.ValidationError){
        // generic — don't leak collection/field/enum names from the raw message
        return res.status(400).send("invalid input");
    }
    if(err && err.code === 11000){
        // duplicate key (e.g. email already registered, like already exists)
        return res.status(409).send("that record already exists");
    }
    if(err instanceof ApplicationError){
        return res.status(err.code).send(err.message);
    }
    if(err && err.name === 'MulterError'){
        // e.g. LIMIT_FILE_SIZE, LIMIT_FILE_COUNT — bad upload = client error
        const msg = err.code === 'LIMIT_FILE_SIZE' ? 'file too large (max 2MB)' : 'invalid file upload';
        return res.status(400).send(msg);
    }
    if(err && (err.type === 'entity.too.large' || err.status === 413)){
        return res.status(413).send("request body too large");
    }
    return res.status(500).send('something went wrong,please try again later');
})
//4.middleware to handle 404
server.use((req,res)=>{
    res.status(404).send("API NOT FOUND.Please check our documentation for more info at localhost:3200/api-docs");
})

// 5. Refuse to boot without a real signing secret. A missing value only
// fails later on sign-in; the .env.example placeholder is a known secret.
const jwtSecret = (process.env.JWT_SECRET || "").trim();
if (!jwtSecret || jwtSecret === "replace-with-a-long-random-secret") {
    console.error("JWT_SECRET is missing or still the example placeholder — server not started.");
    process.exit(1);
}

// 6. Connect to the database FIRST, then start accepting traffic.
async function start(){
    try {
        await connectUsingMongoose();
        await connectToMongoDB();
        server.listen(3200,()=>{
            console.log("Server is running at 3200");
        });
    } catch (err) {
        console.error("Could not connect to the database — server not started.", err);
        process.exit(1); // non-zero so an orchestrator halts the rollout
    }
}
start();

