require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("_helpers/jwt");
const errorHandler = require("_helpers/error-handler");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const expressValidator = require("express-validator");
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieparser());
app.use(cors({ origin: process.env.CLIENT_URL }));

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: "user_sid",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

// var socket = require('socket.io');

// start server
// const port = process.env.PORT || 4000;
// const server = app.listen(process.env.PORT, function() {
// 	console.log(`Server listening on port ${process.env.PORT}`);
// });

// var server = http.createServer(app);
// io = socket(server);

// require('./socket/socket')(io);

// // middleware function to check for logged in users
// let sessionChecker = (req, res, next) => {
//     if (req.session.user && req.cookies.user_sid) {
//         res.redirect('/');
//     } else {
//         next();
//     }
// };

// // middleware for checking if the cookie information is saved or not
// app.use((req, res, next) => {
//     if (req.cookies.user_sid && !req.session.user) {
//         res.clearCookie('user_sid');
//     }
//     next();
// });

// use JWT auth to secure the api
app.use(jwt());
// api routes
app.use("/users", require("./routes/user_routes.js"));
app.use("/calendar", require("./routes/calendar_routes.js"));
app.use("/programs", require("./routes/lesson_routes.js"));
app.use("/messages", require("./routes/message_routes"));
app.use("/tasks", require('./routes/tasks_routes'));
app.use(errorHandler);

module.exports = app;
