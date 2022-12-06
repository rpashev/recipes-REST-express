import mongoose from "mongoose";
import HttpError from "../models/http-error.js";
import Recipe from "../models/recipe.js";
import User from "../models/user.js";

const getFavorites = async (req, res, next) => {
  const userId = req.userData?.userId;
  console.log(userId);

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }

  const user = await User.findById(userId)?.populate("favorites");
  if (!user) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }

  const favorites = user.favorites;
  res.json(favorites);
};

const addToFavorites = async (req, res, next) => {
  const userId = req.userData?.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }

  const recipeId = req.body.recipeId;
  if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
    const error = new HttpError("Missing valid recipe ID!", 400);
    return next(error);
  }

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    const error = new HttpError("Could not find recipe!", 404);
    return next(error);
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }

  if (user.favorites.includes(recipeId)) {
    const error = new HttpError("Recipe already in favorites!", 400);
    return next(error);
  }

  user.favorites.push(recipeId);
  await user.save();

  res.json(user.favorites);
};

const removeFromFavorites = async (req, res, next) => {
  const userId = req.userData?.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }

  const recipeId = req.params?.recipeId;
  if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
    const error = new HttpError("Missing valid recipe ID!", 400);
    return next(error);
  }

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    const error = new HttpError("Could not find recipe!", 404);
    return next(error);
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }

  if (!user.favorites.includes(recipeId)) {
    const error = new HttpError("No such recipe in favorites!", 400);
    return next(error);
  }

  user.favorites = user.favorites.filter((r) => r != recipeId);
  await user.save();

  res.json(user.favorites);
};

const getAuthored = async (req, res, next) => {
  const userId = req.userData?.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }

  const user = await User.findById(userId)?.populate("authored");
  if (!user) {
    const error = new HttpError("Uanathorized!", 401);
    return next(error);
  }

  const authored = user.authored;
  res.json(authored);
};

export default {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getAuthored,
};
