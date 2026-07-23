import { Router } from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadPhoto } from "../controllers/upload.controller.js";

const uploadRouter = Router();

// public so anonymous ticket reporters (no account) can still attach a photo
uploadRouter.post("/", upload.single("photo"), uploadPhoto);

export default uploadRouter;
