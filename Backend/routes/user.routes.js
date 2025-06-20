import { Router } from "express";
import { getAllUsers , getUserById ,createUser , updateUser , deleteUser , getCurrentUser } from "../controllers/user.controller.js";
import authorize from "../middleware/authorize.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const userRouter = Router();


userRouter.use(authMiddleware); // Apply authentication middleware to all user routes

userRouter.get('/' , authorize("superadmin"),getAllUsers);
userRouter.get('/me', getCurrentUser); 
userRouter.get('/:id' , getUserById)
userRouter.post('/' ,authorize("superadmin" ,"admin") ,createUser);
userRouter.put('/:id',authorize("civillian","superadmin", "admin") , updateUser);
userRouter.delete('/:id',authorize("superadmin" ,"admin"),deleteUser);

export default userRouter