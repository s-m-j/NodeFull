import express from "express";
import jwt from "jsonwebtoken";
// так неправильно import config from "dotenv";
import "dotenv/config";
import mongoose from "mongoose";

import { registerValidation } from "./validations/auth.js";
import { postCreateValidationValidation } from "./validations/post.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
  .connect(process.env.DB_CONN)
  .then(() => console.log("DB Ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Me");
});

app.post("/auth/login", UserController.login);

app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/auth/register", registerValidation, UserController.newuser);

// app.get("/posts", PostController.getAll);
// app.get("/posts/:id", checkAuth, PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidationValidation,
  UserController.create
);
// app.delete("/posts", checkAuth, UserController.remove);
// app.patch("/posts", checkAuth, UserController.update);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
