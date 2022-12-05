import express from "express";

import catchAsync from "../middleware/catchAsync.js";
import authController from "../controllers/recipe-controller.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("", catchAsync(authController.getAllRecipes));
router.post("", checkAuth, catchAsync(authController.createRecipe));
router.get("/:recipeId", catchAsync(authController.getSingleRecipe));
router.put("/:recipeId", checkAuth, catchAsync(authController.updateRecipe));
router.delete("/:recipeId", checkAuth, catchAsync(authController.deleteRecipe));

export default router;
