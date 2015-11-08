var express = require("express"),
    path = require('path'),
    bodyParser = require("body-parser"),
    cons = require("consolidate"),
    dust = require("dustjs-linkedin"),
    mailer = require("./utils/mailer"),
    db = require("./utils/db"),
    CronJob = require('cron').CronJob;

var routes = {
      photographers: require("./routes/photographers"),
      test: require("./routes/test"),
      referral: require("./routes/referral"),
      availability: require("./routes/availability")
    };

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up app
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('dust', cons.dust);
app.set('view engine', 'dust');

// THESE ARE TEST ROUTES - REAL ROUTES SHOULD BE MOVED OUT OF THE MAIN APP FILE
app.get("/sendMail", routes.test.sendMail);
// END TEST ROUTES

app.get("/photographers", routes.photographers.get);
app.put("/photographers", routes.photographers.put);

app.get("/referral", routes.referral.get);
app.post("/referral", routes.referral.post);

app.get("/availability", routes.availability.get);

app.get("/", function(req, res) {
  res.send("Check out /referral...");
});
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 6001;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

console.log("PORT: " + server_port + ", IP: " + server_ip_address);
 
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

var job = new CronJob('*/30 * * * * *', 
  /* on tick */ function(){
    db.getCompletedReferrals(function(err, referrals) {
      for (var i = 0; i < referrals.length; i++) {
        //mailer.sendResultsEmail(referrals[i]);
        db.markCompleted(referrals[i], function() {
          console.log("Referral " + referrals[i]._id + " marked completed.");
        });
      }
    })
  }, 
  /* on stop */ function () {
    // This function is executed when the job stops
  },
  true /* Start the job right now */
);