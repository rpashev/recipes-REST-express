import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import compression from "compression";
import HttpError from "./models/http-error.js";

import authRoutes from "./routes/auth-routes.js";
import recipeRoutes from "./routes/recipe-routes.js";
import listRoutes from "./routes/list-routes.js";
import checkAuth from "./middleware/checkAuth.js";

const app = express();

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize()); //data sanitization against NoSQL query injection

app.use(hpp()); //against parameter pollution

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});

app.use(limiter);

app.use(compression());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1/users/", authRoutes);
app.use("/api/v1/recipes/", recipeRoutes);
app.use(checkAuth);
app.use("/api/v1/users/", listRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Uknown error occurred!" });
});

export default app;
