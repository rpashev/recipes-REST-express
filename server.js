import "dotenv/config";
import mongoose from "mongoose";

import app from "./app.js";

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() =>
    app.listen(
      process.env.PORT || 5000,
      console.log(`listening on port ${port}....`)
    )
  )
  .catch((err) => console.log(err));
