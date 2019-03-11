const calendarController = require("../calendar/calendar.controller");
const express = require("express");
const router = express.Router();

// Calendar routes

// get calender events
router.get("/getcalendar", calendarController.getdata);
// post calender events
router.post("/sendcalendar", calendarController.postcal_data);

// exporting them
module.exports = router;
