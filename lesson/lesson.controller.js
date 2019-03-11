const express = require("express");
const db = require("../_helpers/db");
const Lesson = db.Lesson;
const Program = db.Program;

// function to save lesson to the database
async function postLesson(req, res) {
  req.checkBody("title", "Title Required").notEmpty();
  req.checkBody("language", "Language Required").notEmpty();
  req.checkBody("content", "Content Required").notEmpty();
  req.checkBody("author", "Author Required").notEmpty();
  req.checkBody("teacher", "Teacher Required").notEmpty();
  req.checkBody("discipline", "Discipline Required").notEmpty();

  let lesson = new Lesson(req.body);

  Program.findOneAndUpdate(
    { title: req.body.programName },
    { $push: { lessons: lesson._id } }
  ).then(user => res.json({ status: true }));

  // save lesson
  lesson
    .save()
    .then(content => res.json({ status: true, content: content }))
    .catch(err => res.json(err));
}

// function to fetch all the lessons from database
async function fetchLessons(req, res) {
  return await Lesson.find({})
    .then(content => res.json({ status: true, Lessons: content }))
    .catch(err => res.json({ status: false, error: err }));
}

// Function to change lesson type
function changeLessonType(req, res) {
  req.checkbody("type", "Type cannot be empty").notEmpty();
  req.checkbody("title", "Title cannot be empty").notEmpty();
  Lesson.findOneAndUpdate(
    { title: req.body.title },
    { $set: { type: req.body.type } },
    { new: true }
  )
    .then(content => res.json({ status: true, content: content }))
    .catch(err => res.json(err));
}

//Exporting them
module.exports = {
  postLesson,
  fetchLessons,
  changeLessonType
};
