const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema model
const schema = new Schema({
  programName: { type: String, required: true },
  programId: { type: Schema.Types.ObjectId, ref: "Programs" },
  title: { type: String, required: true },
  language: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  reviewer: { type: String },
  type: { type: String, default: "hidden" },
  tag: [],
  teacher: { type: String, required: true },
  discipline: [],
  img: { type: String },
  imgdesc: { type: String },
  created: { type: Date, default: Date.now() }
});

// Exporting it
module.exports = mongoose.model("Lesson", schema);
