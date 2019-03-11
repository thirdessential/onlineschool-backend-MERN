const taskController = require("../tasks/tasks.controller");
const express = require("express");
const router = express.Router();

// Task routes

// post tasks route 
router.post("/create", taskController.createTask);

//fetch all tasks
router.get('/getall', taskController.fetchAllTasks);

//fetch any particular task by title 
router.post("/getbytitle", taskController.fetchTasks);



// exporting them
module.exports = router;
