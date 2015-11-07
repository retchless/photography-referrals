var db = require("../utils/db");

exports.get = function(req, res) {
  var answer = {
    referralId: req.query["referralId"],
    available: req.query["available"],
    photographerId: req.query["photographerId"]
  }

  if (typeof answer.referralId == "undefined" || typeof answer.available == "undefined" || typeof answer.photographerId == "undefined") {
    res.end("Invalid parameters - availability not recorded.");
    return;
  }

  db.recordAvailability(answer, function(err, results) {
    if (err) {
      res.end(err.toString());
    }
    res.render("availability", results);
  });
}