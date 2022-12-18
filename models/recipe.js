import mongoose from "mongoose";

const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [150, "Title can't be more than 150 characters"],
    },
    tags: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: [String],
      required: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    prepTime: {
      type: Number,
      required: [true, "Prep time is required"],
    },
    cookTime: {
      type: Number,
      required: [true, "Cook time is required"],
    },
    servings: {
      type: Number,
      required: [true, "Servings is a required field"],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      maxlength: [500, "Summary can't be more than 500 characters"],
    },
    directions: {
      type: String,
      required: [true, "Directions are required!"],
      maxlength: [2000, "Directions can't be more than 2000 characters"],
    },
    nutrition: {
      type: [{ String: String }],
      required: false,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("User", recipeSchema);
export default mongoose.model("Recipe", recipeSchema);
