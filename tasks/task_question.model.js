const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema model
const schema = new Schema({
    question: { type: String},
    options: {type: Array},
    correctanswer: { type: String }
});

//Exporting the Schema
module.exports = mongoose.model("Questions", schema);
