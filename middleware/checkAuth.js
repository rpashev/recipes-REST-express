import jwt from "jsonwebtoken";
import HttpError from "../models/http-error.js";

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpError("Authentication failed! Access denied!", 401);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    //check if user still exists or has changed his password?

    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed! Access denied!", 401);
    return next(error);
  }
};
