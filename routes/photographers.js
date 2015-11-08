var db = require("../utils/db");

exports.get = function(req, res) {
  db.getPhotographers(function(err, photogs) {
    if (err) {
      res.status(400);
      res.end(err.toString());
      return;
    }
    res.end(JSON.stringify(photogs));
  });
};

exports.put = function(req, res) {
  if (!req.body || !req.body.fname || !req.body.lname || !req.body.email) {
    res.status(400);
    res.end("Invalid PUT body - must provide: fname, lname, email");
    return;
  }
  db.insertPhotographer(req.body, function(err, result) {
    if (err) {
      res.status(400);
      res.end(err.toString());
      return;
    }
    res.end("OK");
  });
};