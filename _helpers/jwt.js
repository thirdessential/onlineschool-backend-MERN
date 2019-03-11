const expressJwt = require("express-jwt");
const userService = require("../users/user.service");

//Exporting it
module.exports = jwt;

function jwt() {
  const secret = process.env.SECRET;
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      "/users/authenticate",
      "/users/register",
      "/users/token",
      { url: /\/users\/setpassword\/([^\/]*)$/, methods: ["GET", "POST"] },
      "/users/login",
      "/users/logout",
      "/users/check",
      "/users/getallteachers",
      "/users/getalladmins",
      "/users/getallparents",
      "/calendar/getcalendar",
      "/calendar/sendcalendar",
      { url: /\/users\/permissions\/([^\/]*)$/, methods: ["POST"] },
      { url: /\/users\/edit\/([^\/]*)$/, methods: ["POST"] },
      "/users/view",
      { url: /\/users\/edit\/role\/([^\/]*)$/, methods: ["POST"] },
      "/users/getstudents",
      "/users/createstudent",
      "/programs/fetchall",
      "/programs/create",
      "/programs/lesson/post",
      "/programs/getlessons",
      "/programs/changetype",
      "/programs/lesson/changetype",
      "/users/students/changeplan",
      "/users/student/view",
      "/users/forgotpassword",
      "/users/students/edit",
      "/users/forgotpassword/token",
      "/programs/lesson/fetchall",
      "/messages/get",
      "/tasks/create",
      "/tasks/getall",
      "/tasks/getbytitle"
    ]
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }
  done();
}
