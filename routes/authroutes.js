const express = require("express");
const authRouter = express.Router();

authRouter.get("/login", (request, response) => {
    response.send("Sample");
});

// authRouter.post("/route", [middlewares, validators], controller function);

authRouter.get("/:userId", (request, response) => {
    response.send("You are accessing information about the user " + request.params.userId);
});

module.exports = authRouter;