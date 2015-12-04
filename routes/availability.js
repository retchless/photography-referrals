var db = require("../utils/db");

exports.get = function(req, res) {
  var answer = {
    referralId: req.query["referralId"],
    available: req.query["available"],
    photographerId: req.query["photographerId"]
  }

  console.log("Photographer availability endpoint accessed via url: " + req.url);
  
  if (typeof answer.referralId == "undefined" || typeof answer.available == "undefined" || typeof answer.photographerId == "undefined") {
    res.end("Invalid parameters - availability not recorded.");
    return;
  }

  db.recordAvailability(answer, function(err, results) {
    if (err) {
      res.render("error", { errTxt: err.toString() });
      return;
    }
    if (!results || !results.photographer) {
      res.render("error", { errTxt: "There was a problem with your request. Either your photographer ID or the referral ID is incorrect (bad link?).  Your availability has not been recorded." });
      return;
    }
    console.log("Photographer " + results.photographer.fname + " " + results.photographer.lname + " availability marked as " + results.availability + " for event id " + results.referral._id)
    res.render("availability", results);
  });
}