var db = require("../utils/db"),
    mailer = require("../utils/mailer");

exports.get = function(req, res) {
  db.getPhotographers(function(err, photogs) {
    if (err) {
      res.status(400);
      res.end(err.toString());
      return;
    }

    photogs.sort(function(a,b) {
        if (a.fname && b.fname) {
          if (a.fname.toLowerCase() < b.fname.toLowerCase()) return -1;
          if (a.fname.toLowerCase() > b.fname.toLowerCase()) return 1;
        }
        if (a.lname && b.lname) {
          if (a.lname.toLowerCase() < b.lname.toLowerCase()) return -1;
          if (a.lname.toLowerCase() > b.lname.toLowerCase()) return 1;          
        }
        return 0;
    });

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
      venue: req.body.weddingVenue || ""
    },
    notes: req.body.notes || "",
    requestDate: new Date(),
    completed: false
  };

  console.log("New referral submitted: " + JSON.stringify(referral));

  db.insertReferral(referral, function(err, result) {
    if (err) {
      res.status(400);
      res.end(err.toString());
      return;
    }
    db.getPhotographers(function(err, photogs) {
      if (err) {
        res.status(400);
        res.end(err.toString());
        return;
      }

      // remove the contributing photographer from the email list
      var referrer, recipients = [];
      for (var i in photogs) {
        if (photogs[i]._id == req.body.referrer) {
          referrer = photogs[i];
        } else {
          recipients.push(photogs[i]);
        }
      }
      mailer.sendAskEmail(referral, referrer, recipients, function() {
        res.render("submitted");
      });
    });
  });
}
