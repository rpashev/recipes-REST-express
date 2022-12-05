import HttpError from "../models/http-error.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res, next) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();
  const repeatPassword = req.body.repeatPassword?.trim();
  const firstName = req.body.firstName?.trim();
  const lastName = req.body.lastName?.trim();
  if (!firstName) {
    const error = new HttpError("First name is required!", 400);
    return next(error);
  }
  if (!lastName) {
    const error = new HttpError("Last name is required!", 400);
    return next(error);
  }
  if (repeatPassword !== password || password.length < 6) {
    const error = new HttpError(
      "Passwords must match and be at least 6 symbols!",
      400
    );
    return next(error);
  }
  //validate email
  let regex = /\S+@\S+\.\S+/;
  if (regex.test(email) === false || email === "") {
    const error = new HttpError("Invalid email!", 400);
    return next(error);
  }

  let existingUser;
  //check if email is used
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Could not sign up, please try again!", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User with such email already exists! Please login instead!",
      422
    );
    return next(error);
  }

  let hashedPassword;

  hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  await user.save();

  // creating jwt token
  let token;

  token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
    },
    process.env.JWT_SECRET
    // { expiresIn: "10h" }
  );

  res.status(201).json({
    token,
    firstName: user.firstName,
    userId: user.id,
    email: user.email,
    authored: user.authored,
    favorites: user.favorites,
  });
};

const login = async (req, res, next) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  let regex = /\S+@\S+\.\S+/;
  if (regex.test(email) === false || email === "") {
    const error = new HttpError("Invalid email!", 400);
    return next(error);
  }

  let existingUser;

  existingUser = await User.findOne({ email: email });

  if (!existingUser) {
    const error = new HttpError("Invalid credentials, could not log in!", 401);
    return next(error);
  }

  let validPassword = false;

  validPassword = await bcrypt.compare(password, existingUser.password);

  if (!validPassword) {
    const error = new HttpError("Invalid password!", 401);
    return next(error);
  }

  let token; //maybe export creating the token

  token = jwt.sign(
    {
      userId: existingUser.id,
      email: existingUser.email,
      firstName: existingUser.firstName,
    },
    process.env.JWT_SECRET
  );

  res.status(201).json({
    token,
    userId: existingUser.id,
    email: existingUser.email,
    firstName: existingUser.firstName,
    authored: existingUser.authored,
    favorites: existingUser.favorites,
  });
};

export default { register, login };
