// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import ProductController from './product.controller.js';
import {upload} from '../../middlewares/fileupload.middleware.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { filterSchema, rateSchema, addProductSchema, productIdSchema } from './product.validation.js';

// 2. Initialize Express router.
const productRouter = express.Router();
const productController = new ProductController();

// All the paths to the controller methods.
// localhost/api/products 
// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1


productRouter.get(
    '/filter',
    validate(filterSchema),
    (req,res,next)=>productController.filterProducts(req,res,next)
);

productRouter.post(
    '/rate',
    jwtAuth, // rating requires login (identifies who rated)
    validate(rateSchema),
    (req,res,next)=>productController.rateProduct(req,res,next)
);

productRouter.get(
    '/',
    (req,res,next)=>productController.getAllProducts(req,res,next)
);

productRouter.post(
    '/',
    jwtAuth, // must be logged in…
    requireRole('seller'), // …and a seller (reject before parsing the upload)
    upload.single('imageUrl'),
    validate(addProductSchema),
    (req,res,next)=>productController.addProduct(req,res,next)
);

productRouter.get(
    '/averagePrice',
    (req,res,next)=>productController.averagePrice(req,res,next)
);

productRouter.get(
    '/:id',
    validate(productIdSchema),
    (req,res,next)=>productController.getOneProduct(req,res,next)
);



export default productRouter;