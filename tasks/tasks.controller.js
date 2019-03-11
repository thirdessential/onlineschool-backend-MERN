const db = require("../_helpers/db");
const Task = require("../tasks/tasks.model");
const Questions = require("../tasks/task_question.model");
//Function to save lesson to the database
 async function createTask(req, res) {
  //body validations
  // req.checkBody("title", "Title Required").notEmpty();
  // req.checkBody("options", "options Required").notEmpty();
  // req.checkBody("correctanswer", "Correct answer Required").notEmpty();

  // check the validation object for errors
  // let errors = req.validationErrors();

  // if (errors) {
  //   res.json({ status: false, messages: errors });
  // } else {

let num = req.body.content.length - 1;
const question_ids = [];
let rand = [];
for(i=0; i <= num; i++ ){
  // let rand = [];
  let questions = new Questions();
  questions.question = req.body.content[i].question;
  questions.options = req.body.content[i].options;
  questions.correctanswer = req.body.content[i].correctanswer;
  await questions.save().then((questions) => {
    let arr = [];
    console.log(questions);
    rand.push(String(questions._id));
    if(rand.length - 1 == num){
      // //Save task
    let task = new Task();
    task.title = req.body.title;
    task.author = req.body.author;
    task.content = rand

    task
      .save()
      .then(content => res.json({status: true, content: content}))
      .catch(err => res.json({status: false, error: err}));
    }

  });
  
  // function show(products){
  //   console.log(products._id);
  //   let id = String(products._id);
  //   question_ids.push(id);
    
  // }
  // console.log({uu: question_ids});
  }}



//   await function show(questions){
    
//     let current_id = questions._id;
//     ids.push(String(current_id));
//     return ids;
//     console.log(ids);
// }




  // //Save task
  //   let task = new Task();
  //   task.title = req.body.title;
  //   task.author = req.body.author;
  //   task.content = ids;

  //   task
  //     .save()
  //     .then(content => res.json({status: true, content: content}))
  //     .catch(err => res.json({status: false, error: err}));
  


//Function to fetch all the tasks from database
async function fetchAllTasks(req, res) {
  await Task.find({}).populate('content')
    .then(content => res.json({status: true, content: content}))
    .catch(err => res.json({status: false, error: err}));
}

//Function to fetch particlar tasks from database
function fetchTasks(req, res) {
  Task.findOne({ title: req.body.title }).populate("content")
    .exec(function(err, result) {
      if (err) {
        res.json({ status: false, error: err });
      } else {
        res.json({ status: true, user: result });
      }
    });
}

//Exporting all the functions
module.exports = {
  createTask,
  fetchAllTasks,
  fetchTasks
};
