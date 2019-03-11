const userController = require("../users/users.controller");
const studentController = require("../students/students.controller");
const express = require("express");
const router = express.Router();

// get all teachers route
router.get("/getallteachers", userController.getAllTeachers);
// get all admins route
router.get("/getalladmins", userController.getAllAdmins);
// get all parents route
router.get("/getallparents", userController.getAllParents);
// check session route
router.get("/check", userController.checkSession);
// verify token route
router.get("/setpassword/:token", userController.verifytoken);
// login route
router.get("/logout", userController.logout);
// login route
router.post("/login", userController.authenticate);
// Set register route
router.post("/register", userController.register);
// set token route
router.post("/token", userController.assignToken);
// set password route
router.post("/setpassword/:token", userController.setPassword);
// for setting permissons to user
router.post("/permissions/:reply", userController.assignReply);
// for showing users credentials
router.post("/view", userController.viewUser);
// for editing users email
router.post("/edit/:type", userController.editUser);
//for changing roles
router.post("/edit/role/:newrole", userController.editRole);
// get student route
router.post("/getstudents", studentController.getStudent);
// create students route
router.post("/createstudent", studentController.createStudent);
// change plan of students
router.post("/students/changeplan", studentController.changePlan);
// view student credentials
router.post("/student/view", studentController.viewStudent);
// edit students credentials
router.post("/students/edit", studentController.editStudent);
// route for setting token for reset password link
router.post("/forgotpassword/token", userController.Token);
// exporting them
module.exports = router;
