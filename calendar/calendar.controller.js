const calendarService = require("../calendar/calendar.service");
const db = require("_helpers/db");
const Calendar = db.Calendar;

// get  Calendar data
function getdata(req, res, next) {
  calendarService
    .getdata_cal()
    .then(data =>
      res.json({
        cal_data: data
      })
    )
    .catch(err => next(err));
}

//post calendar data
function postcal_data(req, res, next) {
  calendarService
    .postdata_cal(req.body)
    .then(() => res.json({ Success: true }))
    .catch(err => next(err));
}

//Exporting them
module.exports = {
  getdata,
  postcal_data
};
