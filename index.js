import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import usersRoute from "./routes/users.js";
import env from "./config/env.js";

const app = express();
app.use(
  express.json({
    limit: "30mb",
    extended: true,
  })
);

app.use(
  express.urlencoded({
    limit: "30mb",
    extended: true,
  })
);

app.use(cors());

mongoose
  .connect(env.mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(env.port, () => {
      console.log(`[Server] Sucessfully connected to database.`);
      console.log(`[Server] Running on port: ${env.port}`);
    })
  )
  .catch((error) => {
    console.log(error.message);
  });

// Routes
app.use("/users", usersRoute);
