import express from "express";

import catchAsync from "../middleware/catchAsync.js";
import listController from "../controllers/list-controller.js";

const router = express.Router();

router.get("/favorites", catchAsync(listController.getFavorites));
router.post("/favorites", catchAsync(listController.addToFavorites));
router.delete(
  "/favorites/:recipeId",
  catchAsync(listController.removeFromFavorites)
);
router.get("/authored", catchAsync(listController.getAuthored));

export default router;
