// Manage routes/paths to UserController

// 1. Import express.
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { signupSchema, signinSchema, resetPasswordSchema } from './user.validation.js';
// 2. Initialize Express router.
const userRouter = express.Router();
const userController = new UserController();

// All the paths to the controller methods.
// localhost/api/user
userRouter.post(
    '/signup',
    validate(signupSchema),
    (req,res,next)=>userController.signUp(req,res,next)
);

userRouter.post(
    '/signin',
    validate(signinSchema),
    (req,res,next)=>userController.signIn(req,res,next)
);

userRouter.put(
    '/resetPassword',jwtAuth,
    validate(resetPasswordSchema),
    (req,res,next)=>userController.resetPassword(req,res,next)
);

export default userRouter;
