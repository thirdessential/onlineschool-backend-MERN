const cookieparser = require("cookie-parser");
const userService = require("./user.service");
const db = require("_helpers/db");
const User = db.User;
const Student = db.Student;
const express = require("express");
const app = express();
const async = require("async");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
var key = "abcdefghijklmnopqrstuvwxyztgbhgf";
let iv = "1234567891234567";

app.use(cookieparser());

// middleware function to check for logged in users
let sessionChecker = (req, res, next) => {
  if (req.cookies.user_sid) {
    res.json({ status: true });
  } else {
    next();
  }
};

// middleware for checking if the cookie information is saved or not
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

//Checking stored user session details
function checkSession(req, res) {
  if (req.cookies.user_sid) {
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
}

// route for user Login
function authenticate(req, res) {
  // validate the input
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email does not appear to be valid").isEmail();
  req.checkBody("password", "Password is required").notEmpty();

  // check the validation object for errors
  let errors = req.validationErrors();

  if (errors) {
    res.json({ status: false, messages: errors });
  } else {
    let email = req.body.email;
    let password = req.body.password;
    let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
    var encrypted =
      cipher.update(password, "utf8", "hex") + cipher.final("hex");
    User.findOne({ email: email }).then(function(user) {
      app.get(sessionChecker, (req, res) => {
        res.json({ status: "session stored" });
      });

      //Checking if user exists or not
      if (user) {
        if (!user) {
        } else if (encrypted != user.password) {
          res.json({ status: false, error: "Password Incorrect" });
        } else if ((user.role == 'teacher' && user.status == 'Declined') || (user.role == 'teacher' && user.status == 'Rejected')) {
          res.json({ status: false, error: "Teacher not yet Approved or Rejected" });
        } else {
          if (user) {
            req.session.user = user;
            req.session.Auth = user;
            res.json({
              status: true,
              user: req.session.Auth
            });
          }
        }
      }

      if (!user) {
        Student.findOne({ email: email }).then(function(student) {
          if (!student) {
            res.json({ status: false, error: "Student not found" });
          } else if (encrypted != student.password) {
            res.json({ status: false, error: "Password Incorrect" });
          } else if (student) {
            req.session.user = student;
            req.session.Auth = student;
            res.json({
              status: true,
              user: req.session.Auth
            });
          }
        });
      }
    });
  }

  // let email = req.body.email;
  // let password = req.body.password;
  // let cipher = crypto.createCipheriv(algorithm, new Buffer.from(key), iv);
  // var encrypted = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
}

//Function for loggging out
function logout(req, res) {
  res.clearCookie("user_sid");
  res.json({
    session: "cleared",
    status: true
  });
  console.log(req);
}

//Function to register
function register(req, res, next) {
  userService.create(req, res, req.body);
}

//Function to get all the teachers
async function getAllTeachers(req, res, next) {
  let teach = {};
  await userService
    .getTeachers_verified()
    .then(users => (teach = users))
    .catch(err => next(err));
  userService
    .getTeachers_Nverified()
    .then(unverified =>
      res.json({ status: true, verified: teach, Unverified: unverified })
    )
    .catch(err => res.json({ status: false, error: err }));
}

//Function to get all the parents
async function getAllParents(req, res, next) {
  let parents = {};
  await userService
    .getParents_verified()
    .then(users => (parents = users))
    .catch(err => next(err));
  userService
    .getParents_Nverified()
    .then(unverified =>
      res.json({ status: true, verified: parents, Unverified: unverified })
    )
    .catch(err => res.json({ status: false, error: err }));
}

//Function to get all the admins
async function getAllAdmins(req, res, next) {
  let admin = {};
  await userService
    .getadmin_verified()
    .then(users => (admin = users))
    .catch(err => next(err));
  userService
    .getadmin_Nverified()
    .then(unverified =>
      res.json({ status: true, verified: admin, Unverified: unverified })
    )
    .catch(err => res.json({ status: false, error: err }));
}

//Function to assign token for resetting password
function Token(req, res, next) {
  userService
    .TokenForgotPassword(req.body.email)
    .then(() => res.json({ success: true }))
    .catch(err => next(err));
}

//Function to assign token to a particular email
function assignToken(req, res, next) {
  console.log("token function from controller executed");
  console.log(req.body.email);
  userService
    .assignToken(req.body.email)
    .then(() => res.json({ success: true }))
    .catch(err => next(err));
}

//function to verify that token in database
async function verifytoken(req, res, next) {
  console.log("verifyToken function executed");
  let token = req.params.token;
  console.log(token);
  async.waterfall(
    User.findOne(
      { passwordtoken: token, passwordexpires: { $gt: Date.now() } },
      function(err, user) {
        if (user) {
          console.log("user found");
          res.status(200).json({ success: true, token: token });
        } else {
          console.log("User not found or token expired");
          res
            .status(404)
            .json({
              success: false,
              message: "No user found or token expired"
            });
          console.log(user);
        }
      }
    )
  );
}

//Function to set password
function setPassword(req, res, next) {
  // Body validations
  req.checkBody("password", "Password is required").notEmpty();
  req.checkBody("password2", "Password2 is required").notEmpty();

  // check the validation object for errors
  let errors = req.validationErrors();

  if (errors) {
    res.json({ status: false, messages: errors });
  } else {
    if (req.body.password !== req.body.password2) {
      res.json({
        success: false,
        message: "Passwords do not match"
      });
    } else {
      userService.setPassword(req.params.token, req.body.password);
      res.status(200).json({ success: true, token: req.params.token });
    }
  }
}

//Function to See user credentials
function viewUser(req, res) {
  User.findOne({ email: req.body.email }).then(data => changepass(data));
  function changepass(data) {
    let password = data.password;
    let decipher = crypto.createDecipheriv(algorithm, new Buffer.from(key), iv);
    let decrypted =
      decipher.update(password, "hex", "utf8") + decipher.final("utf8");
    res.json({ password: decrypted });
  }
}

//Function to edit users credentials
async function editUser(req, res) {
  // validate the input
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email does not appear to be valid").isEmail();
  req.checkBody("newemail", "New Email is required").notEmpty();
  req.checkBody("newemail", "New Email does not appear to be valid").isEmail();
  req.checkBody("password", "Password is required").notEmpty();

  // check the validation object for errors
  let errors = req.validationErrors();
  if (errors) {
    res.json({ status: false, messages: errors });
    return;
  } else {
    await User.findOne({ email: req.body.newemail }).then(user =>
      check_user(user)
    );
    // await Student.findOne({email: req.body.newemail}).then((student) => check_student(student));
    async function check_user(user) {
      
    if( (user) && (user.email == req.body.newemail)){
      let cipher = crypto.createCipheriv(
        algorithm,
        new Buffer.from(key),
        iv
      );
      var encrypted =
        cipher.update(req.body.password, "utf8", "hex") +
        cipher.final("hex");
      User.findOneAndUpdate(
        { email: req.body.email, role: req.params.type },
        {
          $set: { email: req.body.newemail, password: encrypted }
        }
      )
        .then(user => res.json({ status: true, user: user }))
        .catch(err => res.json(err));
    } else { 
      if (user) {
        res
          .status(404)
          .json({
            status: false,
            error: "Email " + req.body.newemail + " is already taken"
          });
      } else {
        await Student.findOne({ email: req.body.newemail }).then(student =>
          check_student(student)
        );
        function check_student(student) {
          if (student) {
            res
              .status(404)
              .json({
                status: false,
                error: "Email " + req.body.newemail + " is already taken"
              });
          } else {
            let cipher = crypto.createCipheriv(
              algorithm,
              new Buffer.from(key),
              iv
            );
            var encrypted =
              cipher.update(req.body.password, "utf8", "hex") +
              cipher.final("hex");
            User.findOneAndUpdate(
              { email: req.body.email, role: req.params.type },
              {
                $set: { email: req.body.newemail, password: encrypted }
              }
            )
              .then(user => res.json({ status: true }))
              .catch(err => res.json(err));
          }
        }
      }
    }}
  }
}

//Function to edit the role of any user
function editRole(req, res) {
  User.findOneAndUpdate(
    { email: req.body.email },
    {
      $set: {
        role: req.params.newrole
      }
    }
  )
    .then(users => res.json(users))
    .catch(Err => res.json(err));
}

//Function to approve/decline any particular user
function assignReply(req, res) {
  let reply;
  if (req.params.reply == "approve") {
    reply = "Approved";
  } else if (req.params.reply == "decline") {
    reply = "Rejected";
  }
  let email = req.body.email;

  User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        status: reply
      }
    }
  )
    .then(
      User.find({ email: req.body.email }).then(user =>
        res.json({ status: true, User: user })
      )
    )
    .catch(err => res.json(err));
}

//Exporting all the functions
module.exports = {
  checkSession,
  authenticate,
  logout,
  register,
  assignToken,
  verifytoken,
  setPassword,
  getAllTeachers,
  getAllParents,
  getAllAdmins,
  assignReply,
  editUser,
  editRole,
  viewUser,
  Token
};
