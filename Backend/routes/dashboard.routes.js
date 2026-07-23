import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import { getAdminDashBoard, getSuperAdminDashBoard, getAnnualReport } from "../controllers/dashboard.controller.js";

const dashBoardRouter = Router();

dashBoardRouter.get("/admin-summary", authMiddleware, authorize("admin"), getAdminDashBoard);
dashBoardRouter.get("/superadmin-summary", authMiddleware, authorize("superadmin"), getSuperAdminDashBoard);
dashBoardRouter.get("/annual-report", authMiddleware, authorize("admin", "superadmin"), getAnnualReport);

export default dashBoardRouter;
