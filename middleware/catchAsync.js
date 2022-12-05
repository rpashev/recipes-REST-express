import HttpError from "../models/http-error.js";

export default (foo) => {
  return (req, res, next) => {
    foo(req, res, next).catch((err) => {
      // console.log("hi from catch async");
      return next(new HttpError("Something went wrong", 500));
    });
  };
};
