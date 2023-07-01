const express = require("express");
const authRouter = express.Router();
const { createAdmin } = require("../app/controllers/userController");

authRouter.get("/login", (request, response) => {
    response.send("Sample")
});

// authRouter.post("/route", [middlewares, validators], controller function);

// authRouter.get("/users", () => { createAdmin() });

module.exports = authRouter;