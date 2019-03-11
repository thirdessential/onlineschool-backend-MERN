const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Students Schema
const schema = new Schema({
  password: { type: String },
  firstName: { type: String, default: " " },
  lastName: { type: String, default: " " },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, default: " " },
  discipline: [],
  parents: [{ type: Schema.Types.ObjectId, ref: "User" }],
  role: { type: String, default: "Student" },
  package: { type: String, default: "Free Plan" },
  parentName: { type: String, default: "null" },
  createdDate: { type: Date, default: Date.now }
});

//Exporting the Schema
module.exports = mongoose.model("Students", schema);
