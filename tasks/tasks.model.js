const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema model
const schema = new Schema({
  title: { type: String },
  author: { type: String },
  content: [{type: Schema.Types.ObjectId, ref: 'Questions'}],
  correctanswer: { type: String }
});

//Exporting the Schema
module.exports = mongoose.model("Tasks", schema);
