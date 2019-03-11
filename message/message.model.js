const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema model
const schema = new Schema({
  message: { type: String },
  sender: { type: String },
  reciever: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  room1: { type: String },
  room2: { type: String }
});

//Exporting them
module.exports = mongoose.model("Messages", schema);

// sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// 	reciever: { type: mongoose.Types.Schema.objectId, ref: 'User' },
