import { Router } from "express";
import { getAllUsers , getUserById ,createUser } from "../controllers/user.controller.js";
import authorize from "../middleware/authorize.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const userRouter = Router();


userRouter.use(authMiddleware); // Apply authentication middleware to all user routes

userRouter.get('/' , authorize("civillian"),getAllUsers);
userRouter.get('/:id' , getUserById)
userRouter.post('/' ,authorize("civillian") ,createUser);
userRouter.put('/:id' , (req,res) => res.json({message : "Update a users"}))
userRouter.delete('/:id' , (req , res) => res.json({message : "Delete user"}))

export default userRouter