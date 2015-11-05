var db = require("../utils/db");

exports.get = function(req, res) {
  db.findPhotographers(function(err, photogs) {
    if (err) {
      res.status(400);
      res.end(err.toString());
      return;
    }
    res.render("submit", {
      photographers: photogs
    })
  });
}