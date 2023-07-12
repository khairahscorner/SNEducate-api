const express = require("express");
const router = express.Router();
const { login, createNewUser, deleteUser, changePassword, getAllUsers } = require("../app/controllers/userController");
const { createSchool, updateSchool, getSchoolDetails, getAllSchools, deleteSchool } = require("../app/controllers/schoolController");
const { createNewAdmin, getSingleAdmin, getAdminDetails, getAllAdmins, deleteAdmin, updateAdmin } = require("../app/controllers/adminController");
const { verifyToken, doesEmailExists, isUserActivated } = require('../app/middleware/auth');
const { isUserTypeDev, isUserTypeAdmin, isUserTypeStaff, isUserTypeDevOrAdmin, isUserTypeAdminOrStaff } = require('../app/middleware/userTypes');
const { createNewStaff, getStaffDetails, getAllSchoolStaff, getAllStaff, deleteStaff, updateStaff } = require("../app/controllers/staffController");
const { createNewStudent, assignStudentToStaff, deleteStudent, getAllSchoolStudents, getAllStaffStudents, updateStudentDetails, getStudentDetails, getAllStudents } = require("../app/controllers/studentController");
const { createNewCurriculum, getCurriculumDetails, getAllStudentCurriculum, deleteCurriculum, updateCurriculum } = require("../app/controllers/curriculumController");
const { updateGoal, getGoalCurriculumCount, deleteGoal, createNewGoal, addGoalToCurriculum, getGoal, getCurriculumGoals, addGoalsToCurriculum, createNewGoals } = require("../app/controllers/goalController");
const { createNewTarget, updateTarget, getTargetDetails, deleteTarget, getGoalTargets } = require("../app/controllers/targetController");

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
router.put("/admin/:adminId", [verifyToken, isUserTypeDevOrAdmin], updateAdmin);
router.delete("/admin/:adminId", [verifyToken, isUserTypeDev], deleteAdmin);
router.get("/admin", [verifyToken, isUserTypeAdmin, isUserActivated], getAdminDetails);
router.get("/admins", [verifyToken, isUserTypeDev], getAllAdmins);
// router.post("/mail", sendMail);

router.post("/staff/new", [verifyToken, isUserTypeAdmin, doesEmailExists], createNewStaff);
router.put("/staff/:staffId", [verifyToken, isUserTypeAdminOrStaff], updateStaff);
router.delete("/staff/:staffId", [verifyToken, isUserTypeAdmin], deleteStaff);
router.get("/staff", [verifyToken, isUserTypeStaff, isUserActivated], getStaffDetails);
router.get("/staffs/:schoolId", [verifyToken, isUserTypeDevOrAdmin], getAllSchoolStaff);
router.get("/staffs", [verifyToken, isUserTypeDev], getAllStaff);

router.post("/student/new", [verifyToken, isUserTypeAdminOrStaff], createNewStudent);
router.post("/student/assign/:studentId", [verifyToken, isUserTypeAdminOrStaff], assignStudentToStaff);
router.delete("/student/:studentId", [verifyToken, isUserTypeAdmin], deleteStudent);
router.get("/student/:studentId", [verifyToken, isUserTypeAdminOrStaff], getStudentDetails);
router.put("/student/:studentId", [verifyToken, isUserTypeAdminOrStaff], updateStudentDetails);
router.get("/students/:schoolId", [verifyToken, isUserTypeAdmin], getAllSchoolStudents);
router.get("/students/:schoolId/:staffId", [verifyToken, isUserTypeAdminOrStaff], getAllStaffStudents);
router.get("/students", [verifyToken, isUserTypeDev], getAllStudents);

router.post("/curriculum/new", [verifyToken, isUserTypeStaff], createNewCurriculum);
router.get("/curriculum/:curriculumId", [verifyToken, isUserTypeStaff], getCurriculumDetails);
router.put("/curriculum/:curriculumId", [verifyToken, isUserTypeStaff], updateCurriculum);
router.get("/curriculums/:studentId", [verifyToken, isUserTypeStaff], getAllStudentCurriculum);
router.delete("/curriculum/:curriculumId", [verifyToken, isUserTypeStaff], deleteCurriculum);

router.post("/goal/new", [verifyToken, isUserTypeStaff], createNewGoal);
router.get("/goal/:goalId", [verifyToken, isUserTypeStaff], getGoal);
router.put("/goal/:goalId", [verifyToken, isUserTypeStaff], updateGoal);
router.delete("/goal/:goalId", [verifyToken, isUserTypeStaff], deleteGoal);
router.get("/goal/count/:goalId", [verifyToken, isUserTypeStaff], getGoalCurriculumCount);
router.post("/goals/new", [verifyToken, isUserTypeStaff], createNewGoals);
router.get("/goals/:curriculumId", [verifyToken, isUserTypeStaff], getCurriculumGoals);
router.post("/goal", [verifyToken, isUserTypeStaff], addGoalToCurriculum);
router.post("/goals", [verifyToken, isUserTypeStaff], addGoalsToCurriculum);

router.post("/target/new", [verifyToken, isUserTypeStaff], createNewTarget);
router.get("/target/:targetId", [verifyToken, isUserTypeStaff], getTargetDetails);
router.put("/target/:targetId", [verifyToken, isUserTypeStaff], updateTarget);
router.delete("/target/:targetId", [verifyToken, isUserTypeStaff], deleteTarget);
router.get("/targets/:goalId", [verifyToken, isUserTypeStaff], getGoalTargets);

// authRouter.get("/users", () => { createAdmin() });

module.exports = router;