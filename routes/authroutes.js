const express = require("express");
const authRouter = express.Router();
const { login, register, deleteUser } = require("../app/controllers/userController");

authRouter.post("/login", login);
authRouter.post("/signup", register);
authRouter.delete("/delete/:id", deleteUser);

// authRouter.post("/route", [middlewares, validators], controller function);

// authRouter.get("/users", () => { createAdmin() });

module.exports = authRouter;