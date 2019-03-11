const messageController = require("../message/message.controller");
const express = require("express");
const router = express.Router();

// Calendar routes

// get messages
router.post("/get", messageController.fetchMessage);
console.log("here");

// exporting them
module.exports = router;
