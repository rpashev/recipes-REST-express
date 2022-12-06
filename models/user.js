import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLenght: [6, "Password must be at least 6 characters"],
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe", default: [] }],
    authored: [{ type: Schema.Types.ObjectId, ref: "Recipe", default: [] }],
  },
  { timestamps: true }
);

// module.exports = mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);
