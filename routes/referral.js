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

exports.post = function(req, res) {
  if (!req.body || !req.body.referrer) {
    res.status(400);
    res.end("Invalid referral. A referring photographer is required.");
    return;
  }
  if (!req.body.clientFirstName) {
    res.status(400);
    res.end("Invalid referral. Client first name is required.");
    return;
  }
  if (!req.body.clientLastName) {
    res.status(400);
    res.end("Invalid referral. Client last name is required.");
    return;
  }
  if (!req.body.clientEmail) {
    res.status(400);
    res.end("Invalid referral. Client email is required.");
    return;
  }
  if (!req.body.weddingDate) {
    res.status(400);
    res.end("Invalid referral. Wedding date is required.");
    return;
  }
  if (!req.body.weddingCity) {
    res.status(400);
    res.end("Invalid referral. Wedding city is required.");
    return;
  }
  if (!req.body.weddingVenue) {
    res.status(400);
    res.end("Invalid referral. Wedding venue is required.");
    return;
  }

  var referral = {
    referrer: req.body.referrer,
    client: {
      fname: req.body.clientFirstName,
      lname: req.body.clientLastName,
      email: req.body.clientEmail
    },
    wedding: {
      date: req.body.weddingDate,
      city: req.body.weddingCity,
      venue: req.body.weddingVenue
    },
    notes: req.body.notes || ""
  };
  console.log(referral);

  db.insertReferral(referral, function(err, result) {
    if (err) {
      res.status(400);
      res.end(err.toString());
      return;
    }
    res.end("Referral created successfully!");
  });
}