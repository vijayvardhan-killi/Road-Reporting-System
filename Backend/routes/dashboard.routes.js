import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import { getAdminDashBoard } from "../controllers/dashboard.controller.js";


const dashBoardRouter =  Router();



dashBoardRouter.get("admin-summary" ,authMiddleware ,authorize("admin")  ,getAdminDashBoard);





export  default dashBoardRouter;