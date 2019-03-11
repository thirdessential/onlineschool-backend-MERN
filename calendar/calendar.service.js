const db = require("_helpers/db");
const Calendar = db.Calendar;

// Fetch calender data
async function getdata_cal() {
  return await Calendar.find({}).select("-1");
}

// Function to post cal data
async function postdata_cal(caldata) {
  let random_id = Math.random()
    .toString()
    .slice(2, 11);

  const data = new Calendar({
    title: caldata.title,
    avatar: caldata.avatar,
    description: caldata.description,
    start: caldata.start,
    end: caldata.end,
    type: caldata.type,
    calendar: caldata.calendar,
    _id: random_id
  });

  // save user
  await data.save().then(content => res.json({ status: true, Event: content }));
}

//Exporting them
module.exports = {
  getdata_cal,
  postdata_cal
};
