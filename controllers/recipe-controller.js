import mongoose from "mongoose";
import HttpError from "../models/http-error.js";
import Recipe from "../models/recipe.js";
import User from "../models/user.js";

const getAllRecipes = async (req, res, next) => {
  const recipes = await Recipe.find();
  if (!recipes || recipes.length == 0) {
    const error = new HttpError("Could not find any recipes!", 404);
    return next(error);
  }

  res.json(recipes);
};

const createRecipe = async (req, res, next) => {
  const {
    title,
    tags,
    ingredients,
    imageUrl,
    prepTime,
    cookTime,
    servings,
    summary,
    directions,
  } = req.body;

  if (
    !title?.trim() ||
    !tags ||
    tags?.length == 0 ||
    !ingredients ||
    ingredients?.length == 0 ||
    !imageUrl?.trim() ||
    !prepTime ||
    prepTime < 0 ||
    !cookTime ||
    cookTime < 0 ||
    !servings ||
    servings <= 0 ||
    !summary?.trim() ||
    !directions?.trim()
  ) {
    const error = new HttpError("Invalid user input!", 400);

    return next(error);
  }

  const userId = req.userData?.userId;

  if (!userId) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }
  const newRecipe = new Recipe({ ...req.body, author: userId });
  const user = await User.findById(userId);

  try {
    user.authored.push(newRecipe.id);
    await newRecipe.save();
    await user.save();
  } catch (err) {
    const error = new HttpError("Could not create recipe!", 500);
    return next(error);
  }

  res.status(201).json(newRecipe);
};

const getSingleRecipe = async (req, res, next) => {
  const { recipeId } = req.params;
  if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
    const error = new HttpError("Missing valid recipe ID!", 400);
    return next(error);
  }

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    const error = new HttpError("Could not find recipe!", 404);
    return next(error);
  }
  recipe.ingredients = recipe.ingredients.filter((ing) => ing !== "");

  res.json(recipe);
};

const updateRecipe = async (req, res, next) => {
  const { recipeId } = req.params;
  if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
    const error = new HttpError("Missing valid recipe ID!", 400);
    return next(error);
  }

  const userId = req.userData?.userId;

  if (!userId) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    const error = new HttpError("Could not find recipe!", 404);
    return next(error);
  }

  if (userId.toString() !== recipe.author.toString()) {
    const error = new HttpError("Unauthorized!", 401);
    return next(error);
  }

  const {
    title,
    tags,
    ingredients,
    imageUrl,
    prepTime,
    cookTime,
    servings,
    summary,
    directions,
  } = req.body;

  if (
    !title?.trim() ||
    !tags ||
    tags?.length == 0 ||
    !ingredients ||
    ingredients?.length == 0 ||
    !imageUrl?.trim() ||
    !prepTime ||
    prepTime < 0 ||
    !cookTime ||
    cookTime < 0 ||
    !servings ||
    servings <= 0 ||
    !summary?.trim() ||
    !directions?.trim()
  ) {
    const error = new HttpError("Invalid user input!", 400);

    return next(error);
  }

  recipe.title = title;
  recipe.tags = tags;
  recipe.ingredients = ingredients;
  recipe.imageUrl = imageUrl;
  recipe.prepTime = prepTime;
  recipe.cookTime = cookTime;
  recipe.servings = servings;
  recipe.summary = summary;
  recipe.directions = directions;

  try {
    await recipe.save();
  } catch (err) {
    const error = new HttpError("Could not update recipe!", 500);
    return next(error);
  }

  res.json(recipe);
};

const deleteRecipe = async (req, res, next) => {
  const { recipeId } = req.params;

  if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
    const error = new HttpError("Missing valid recipe ID!", 400);
    return next(error);
  }

  const userId = req.userData?.userId;

  const user = await User.findById(userId);
  if (!user) {
    const error = new HttpError("User does not exist", 404);
    return next(error);
  }

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    const error = new HttpError("Could not find recipe!", 404);
    return next(error);
  }

  if (user._id.toString() !== recipe.author.toString()) {
    const error = new HttpError("Unauthorized!", 401);
    return next(error);
  }
  try {
    await Recipe.deleteOne({ _id: recipeId });
    console.log("3");

    user.authored = user.authored.filter(
      (recipe) => recipe._id.toString() != recipeId.toString()
    );
    await user.save();
  } catch {
    const error = new HttpError("Could not delete recipe!", 500);
    return next(error);
  }

  return res.json(null);
};

export default {
  getAllRecipes,
  createRecipe,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
};
