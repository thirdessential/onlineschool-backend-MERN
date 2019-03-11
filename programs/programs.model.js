const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema model
const schema = new Schema({
  title: { type: String, required: true },
  discipline: { type: String },
  author: { type: String, required: true },
  reviewer: { type: String },
  type: { type: String, default: "hidden" },
  createdOn: { type: Date, default: Date.now() },
  reviewedOn: { type: Date },
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }]
});

//Exporting them
module.exports = mongoose.model("Programs", schema);
