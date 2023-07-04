const express = require("express");
const router = express.Router();
const { login, createNewUser, deleteUser } = require("../app/controllers/userController");
const { createSchool } = require("../app/controllers/schoolController");
const { createNewAdmin, sendMail } = require("../app/controllers/adminController");
const { verifyToken, userExists } = require('../app/middleware/auth');
const { isUserTypeDev, isUserTypeAdmin, isUserTypeStaff } = require('../app/middleware/userTypes');

router.post("/login", login);
router.post("/user/signup", userExists, createNewUser);
router.delete("/user/delete/:id", deleteUser);

router.post("/school/new", [verifyToken, isUserTypeDev], createSchool);

router.post("/admin/new", [verifyToken, isUserTypeDev], createNewAdmin);
// router.post("/mail", sendMail);


// authRouter.post("/route", [middlewares, validators], controller function);

// authRouter.get("/users", () => { createAdmin() });

module.exports = router;