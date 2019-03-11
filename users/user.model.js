const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema Model
const schema = new Schema({
  password: { type: String },
  firstName: { type: String, default: " " },
  lastName: { type: String, default: " " },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, default: " " },
  discipline: [],
  students: [{ type: Schema.Types.ObjectId, ref: "Students" }],
  role: { type: String, required: true },
  status: { type: String, default: "Declined" },
  passwordtoken: { type: String },
  verified: { type: Boolean },
  passwordexpires: { type: Date },
  parentName: { type: String, default: "null" },
  createdDate: { type: Date, default: Date.now }
});

schema.set("toJSON", { virtuals: true });

//Exporting the schema
module.exports = mongoose.model("User", schema);
