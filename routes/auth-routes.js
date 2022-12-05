import express from "express";

import catchAsync from "../middleware/catchAsync.js";
import authController from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/register", catchAsync(authController.register));
router.post("/login", catchAsync(authController.login));

export default router;
