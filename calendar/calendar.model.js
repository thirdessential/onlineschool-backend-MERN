const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema model
const schema = new Schema({
  _id: { type: Number },
  title: { type: String },
  avatar: { type: String },
  description: { type: String },
  start: { type: Date, default: Date.now },
  end: { type: Date },
  type: { type: String },
  calendar: { type: String },
  discipline: { type: String }
});

//Exporting them
module.exports = mongoose.model("Calendar", schema);
