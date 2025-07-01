import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getAdminDashBoard } from "../controllers/dashboard.controller.js";

const dashBoardRouter =  Router();



dashBoardRouter.get("admin-summary" ,authMiddleware,authMiddleware("admin") ,getAdminDashBoard);





export  default dashBoardRouter;