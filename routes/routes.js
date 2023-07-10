const express = require("express");
const router = express.Router();
const { login, createNewUser, deleteUser, changePassword, getAllUsers } = require("../app/controllers/userController");
const { createSchool, updateSchool, getSchoolDetails, getAllSchools, deleteSchool } = require("../app/controllers/schoolController");
const { createNewAdmin, getSingleAdmin, getAdminDetails, getAllAdmins, deleteAdmin } = require("../app/controllers/adminController");
const { verifyToken, doesEmailExists, isUserActivated } = require('../app/middleware/auth');
const { isUserTypeDev, isUserTypeAdmin, isUserTypeStaff, isUserTypeDevOrAdmin, isUserTypeAdminOrStaff } = require('../app/middleware/userTypes');
const { createNewStaff, getStaffDetails, getAllSchoolStaff, getAllStaff, deleteStaff } = require("../app/controllers/staffController");
const { createNewStudent, assignStudentToStaff, deleteStudent, getAllSchoolStudents, getAllStaffStudents, updateStudentDetails, getStudentDetails } = require("../app/controllers/studentController");

router.post("/login", login);
router.post("/change-password", [verifyToken], changePassword);
router.post("/user/signup", doesEmailExists, createNewUser);
router.delete("/user/delete/:id", deleteUser);
router.get("/users", [verifyToken, isUserTypeDev], getAllUsers);

router.post("/school/new", [verifyToken, isUserTypeDev], createSchool);
router.put("/school/:schoolId", [verifyToken, isUserTypeDevOrAdmin], updateSchool);
router.get("/school/:schoolId", [verifyToken, isUserTypeDevOrAdmin], getSchoolDetails);
router.delete("/school/:schoolId", [verifyToken, isUserTypeDev], deleteSchool);
router.get("/schools", [verifyToken, isUserTypeDev], getAllSchools);

router.post("/admin/new", [verifyToken, isUserTypeDev, doesEmailExists], createNewAdmin);
router.get("/admin/:id", [verifyToken, isUserTypeDev], getSingleAdmin);
router.get("/admin", [verifyToken, isUserTypeAdmin, isUserActivated], getAdminDetails);
router.delete("/admin/:adminId", [verifyToken, isUserTypeDev], deleteAdmin);
router.get("/admins", [verifyToken, isUserTypeDev], getAllAdmins);
// router.post("/mail", sendMail);

router.post("/staff/new", [verifyToken, isUserTypeAdmin, doesEmailExists], createNewStaff);
router.get("/staff", [verifyToken, isUserTypeStaff, isUserActivated], getStaffDetails);
router.delete("/staff/:staffId", [verifyToken, isUserTypeAdmin], deleteStaff);
router.get("/staffs/:schoolId", [verifyToken, isUserTypeDevOrAdmin], getAllSchoolStaff);
router.get("/staffs", [verifyToken, isUserTypeDev], getAllStaff);

router.post("/student/new", [verifyToken, isUserTypeAdminOrStaff], createNewStudent);
router.post("/student/assign/:studentId", [verifyToken, isUserTypeAdminOrStaff], assignStudentToStaff);
router.delete("/student/:studentId", [verifyToken, isUserTypeAdmin], deleteStudent);
router.get("/students", [verifyToken, isUserTypeAdmin], getAllSchoolStudents);
router.get("/students/:schoolId/:staffId", [verifyToken, isUserTypeAdminOrStaff], getAllStaffStudents);
router.get("/student/:studentId", [verifyToken, isUserTypeAdminOrStaff], getStudentDetails);
router.put("/student/:studentId", [verifyToken, isUserTypeAdminOrStaff], updateStudentDetails);


// authRouter.post("/route", [middlewares, validators], controller function);

// authRouter.get("/users", () => { createAdmin() });

module.exports = router;