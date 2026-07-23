import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.use(authMiddleware);

notificationRouter.get("/", getMyNotifications);
notificationRouter.patch("/read-all", markAllNotificationsRead);
notificationRouter.patch("/:id/read", markNotificationRead);

export default notificationRouter;
