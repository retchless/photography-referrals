var express = require("express"),
    path = require('path'),
    bodyParser = require("body-parser"),
    cons = require("consolidate"),
    dust = require("dustjs-linkedin"),
    mailer = require("./utils/mailer"),
    db = require("./utils/db"),
    CronJob = require('cron').CronJob,
    auth = require('http-auth');

var routes = {
      photographers: require("./routes/photographers"),
      test: require("./routes/test"),
      referral: require("./routes/referral"),
      availability: require("./routes/availability")
    };

// Authentication module.;
var basic = auth.basic({
    realm: "TheDotReferral.",
    file: __dirname + "/users.htpasswd" // gevorg:gpass, Sarah:testpass ...
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));

// leave /availability open so you don't have to auth to respond
app.get("/availability", routes.availability.get);

// set up app routes
app.use('/static', express.static(path.join(__dirname, 'public')));

// setup auth
app.use(auth.connect(basic));

app.get("/photographers", routes.photographers.get);
app.put("/photographers", routes.photographers.put);

app.get("/referral", routes.referral.get);
app.post("/referral", routes.referral.post);

app.get("/", function(req, res) {
  res.redirect('/referral');
});
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 6001;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var cron = '*/5 * * * * *';
if (process.env.OPENSHIFT_NODEJS_PORT) {
  // if we are in production, do cron job every 15 minutes
  cron = '0 */15 * * * *';
}

console.log("PORT: " + server_port + ", IP: " + server_ip_address);

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

var job = new CronJob(cron, 
  /* on tick */ function(){
    var date = new Date();
    console.log("Start cron job: " + date.toLocaleDateString() + " " + date.toLocaleTimeString());

    db.getCompletedReferrals(function(err, referrals) {
      if (err) {
        console.log("error:");
        console.log(err);
      } else {
        if (referrals.length > 0) {
          console.log("Completed referrals: ");
          console.log(referrals);
          db.getPhotographers(function(err, photographers)  {
            if (err) {
              console.log("Error getting list of Photographers from DB");
              console.log(err);
              return err;
            }

            referrals.forEach(function(referral) {
              var referralId = referral._id;
              db.getPhotographerById(referral.referrer, function(err, referringPhotog) {
                if (err) {
                  console.log("Error getting referring photographer. Could not complete referral " + referralId);
                  return err;
                }
                console.log("Send results email to referral: " + referralId);
                console.log(referral);

                mailer.sendResultsEmail(referral, photographers, referringPhotog, function(err) {
                  if (err) {
                    console.log("Error sending email to referral: " + referralId);
                    console.log(err);
                  } else {
                    console.log("Results email sent.");
        
                    console.log("Marking as completed in db.");
                    db.markCompleted(referral, function() {
                      console.log("Referral " + referralId + " marked completed.");
                    });
                  }
                });
              });
            });
          });
        } else {
          console.log("No referrals marked for completion");
        }  
      } 
      
      console.log("End cron job");
    })
  },
  /* on stop */ function () {
    // This function is executed when the job stops
  },
  true /* Start the job right now */
);
