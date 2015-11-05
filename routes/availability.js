var db = require("../utils/db");

exports.get = function(req, res) {
  console.log(req.query);
  
  var answer = {
    referralId: req.query["referralId"],
    available: req.query["available"],
    photographerId: req.query["photographerId"]
  }

  if (typeof answer.referralId == "undefined" || typeof answer.available == "undefined" || typeof answer.photographerId == "undefined") {
    res.end("Invalid parameters - availability not recorded.");
    return;
  }

  db.recordAvailability(answer, function(err, referral) {
    res.render("availability", {
      referral: referral,
      available: req.query["available"]
    });
  });
}