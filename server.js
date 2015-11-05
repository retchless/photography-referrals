var express = require("express"),
    path = require('path'),
    bodyParser = require("body-parser"),
    cons = require("consolidate"),
    dust = require("dustjs-linkedin"),
    mailer = require("./utils/mailer"),
    db = require("./utils/db");

var app = express();
app.use(bodyParser.json());

// set up app
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('dust', cons.dust);
app.set('view engine', 'dust');

// THESE ARE TEST ROUTES - REAL ROUTES SHOULD BE MOVED OUT OF THE MAIN APP FILE
app.get("/sendMail", function(req, res) {
  var address = req.query.address;
  if (!address) {
    res.status = 400;
    res.end("Missing required url parameter: address");
    return;
  }

  mailer.sendMail(address, {subject: "Subject line", body: "My mailer is in a module now"}, function(err, callback) {
    if (err) {
      res.status = 400;
      res.end(err.toString());
      return;
    }
    res.end("Mail sent!");
  })
});

app.get("/photographers", function(req, res) {
  db.findPhotographers(function(err, photogs) {
    if (err) {
      res.status(400);
      res.end(err.toString());
      return;
    }
    res.end(JSON.stringify(photogs));
  });
})

app.put("/photographers", function(req, res) {
  console.log(req.body);
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
});
// END TEST ROUTES

app.get("/submit", function(req, res) {
  res.render("submit");
});

app.get("/", function(req, res) {
  res.send("Check out /submit...");
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 6001;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

console.log("PORT: " + server_port + ", IP: " + server_ip_address);
 
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});