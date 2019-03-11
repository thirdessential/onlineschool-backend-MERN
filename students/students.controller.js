const db = require("_helpers/db");
const User = db.User;
const Student = db.Student;
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
var key = "abcdefghijklmnopqrstuvwxyztgbhgf"; //  should be of 32 digits
let iv = "1234567891234567";
const cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
const decipher = crypto.createDecipheriv(algorithm, new Buffer.from(key), iv);

//Function to get Students
function getStudent(req, res) {
  User.find({ email: req.body.email, role: "parent" })
    .populate("students")
    .exec(function(err, user) {
      if (user) {
        res.json({ status: true, students: user });
      } else {
        res.json({ status: false, error: "User not found" });
      }
    });
}

//Function to edit students
async function editStudent(req, res) {
  // validate the input
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email does not appear to be valid").isEmail();
  req.checkBody("password", "Password is required").notEmpty();

  // check the validation object for errors
  let errors = req.validationErrors();

  if (errors) {
    res.json({ status: false, messages: errors });
  } else {
    if (await Student.findOne({ email: req.body.email2 })) {
      res
        .status(200)
        .json({
          status: false,
          error: "Email " + req.body.email2 + " is already taken"
        });
    } else {
      let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
      var encrypted =
        cipher.update(req.body.password, "utf8", "hex") + cipher.final("hex");
      Student.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: { email: req.body.newemail, password: encrypted }
        },
        {
          new: true
        }
      )
        .then(student => res.json({ status: true, student: student }))
        .catch(err => res.json({ status: false, error: err }));
    }
  }
}

//Function to create students
async function createStudent(req, res) {
  // validate
  if (
    (await Student.findOne({ email: req.body.email })) ||
    (await User.findOne({ email: req.body.email }))
  ) {
    res
      .status(200)
      .json({
        status: false,
        error: "Email " + req.body.email + " is already taken"
      });
  } else {
    let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
    var encrypted =
      cipher.update(req.body.password, "utf8", "hex") + cipher.final("hex");

    User.findOne({ email: req.body.parentname }).then(user => check(user));

    function check(user) {
      let student = new Student({
        email: req.body.email,
        password: encrypted,
        parents: user.id
      });

      User.findOneAndUpdate(
        { email: req.body.parentname },
        { $push: { students: student._id } },
        { new: true }
      )
        .then(user => res.json({ status: true, user: user }))
        .catch(err => res.json({ status: false, error: err }));

      student.save();
    }
  }
}

//Function for changing the student plan
function changePlan(req, res) {
  Student.findOneAndUpdate(
    { email: req.body.email },
    {
      $set: { package: req.body.plan }
    },
    { new: true }
  )
    .then(stud => res.json({ status: true, students: stud }))
    .catch(err => res.json({ status: false, error: err }));
}

//Function to view students credentials
function viewStudent(req, res) {
  Student.findOne({ email: req.body.email })
    .then(users => res.json({ status: true, user: showStudent(users) }))
    .catch(err => res.json({ status: false, error: err }));
  //Function to show it
  function showStudent(users) {
    let password = users.password;
    let decipher = crypto.createDecipheriv(algorithm, new Buffer.from(key), iv);
    let decrypted =
      decipher.update(password, "hex", "utf8") + decipher.final("utf8");
    return decrypted;
  }
}

// function editStudent(req, res) {
// 	Student.findOneAndUpdate({ email: req.body.email }, { $set: { firstName: req.body.firstname } })
// 		.then((user) => res.json({ status: true, user: user }))
// 		.catch((err) => res.json({ status: false, error: err }));
// }

//Exporting all the functions
module.exports = {
  getStudent,
  createStudent,
  changePlan,
  viewStudent,
  editStudent
};
