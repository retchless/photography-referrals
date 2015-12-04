var
  nodemailer = require('nodemailer'),
  async = require("async"),
  dust = require('dustjs-linkedin'),
  db = require("../utils/db"),
  EmailTemplate = require('email-templates').EmailTemplate,
  path = require('path'),
  smtpPool = require('nodemailer-smtp-pool')
;

var adminEmail = 'retchless@gmail.com';
if (process.env.OPENSHIFT_NODEJS_PORT) {
  // if we are in production, use info@thedot.photo
  adminEmail = 'info@thedot.photo';
}

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(smtpPool({
    service: 'Gmail',
    auth: {
        user: 'thedotreferral@gmail.com',
        pass: 'retchless'
    },
    // use up to 5 parallel connections
    maxConnections: 3,
    // do not send more than 50 messages per connection
    maxMessages: 50,
    // no not send more than 5 messages in a second
    rateLimit: 5
}));

module.exports.sendAskEmail = function(referral, referrer, photogs, callback) {
  var templateDir = path.join(__dirname, "../", 'templates', 'ask')

  var askEmail = new EmailTemplate(templateDir);

  async.each(photogs, function (photog, next) {
    askEmail.render({photographer: photog, referral: referral, referrer: referrer, domain: process.env.OPENSHIFT_APP_DNS||"localhost:6001"}, function (err, results) {
      if (err) {
        console.log(err);
        return next(err);
      }
      sendMail(photog.email, null, {subject: "Incoming Referral from The Dot", body: results.html}, function(err, info) {
        next();
      });
      // result.html
      // result.text
    })
  }, function (err) {
    if (err) {
      console.log("Error ask email sending email for referral " + referral._id);
      console.log(err);
    }
    console.log("Emails sent for referral " + referral._id);
  });

  //callback early - let mail send async
  callback();
}

module.exports.sendResultsEmail = function(referral, photographers, referringPhotog, callback) {

  var availPhotogs = referral.availability;
  var subject = "";

  var listToSend = [];

  if (availPhotogs) {
    console.log(availPhotogs.length + " available photographers for referral " + referral._id + ":");
    outer: for (var i = 0; i < availPhotogs.length; i++) {
      inner: for (var j = 0; j < photographers.length; j++) {
        if (photographers[j]._id.toString() == availPhotogs[i].photographerId.toString()) {
          var photog = photographers[j];
          if (!photog.profileUrl) {
            photog.profileUrl = "http://www.thedot.photo/" + photog.fname.toLowerCase().replace(/ /g, "-") + "-"+ photog.lname.toLowerCase().replace((/ /g), "-");            
          }
          listToSend.push(photog);
          break inner;
        }
      }
    }

    console.log("Available photographers:")
    console.log(listToSend);
    
    subject = "The.Dot: Available photographers on your wedding date!";
  } else {
    console.log("No photographers available for referral " + referral._id);
    subject = "The.Dot: No photographers found for your wedding date";
  }

  var templateDir = path.join(__dirname, "../", 'templates', listToSend.length ? 'results' : 'results_none');
  var resultsEmail = new EmailTemplate(templateDir);
  resultsEmail.render({availPhotogs: listToSend, referral: referral, referringPhotog: referringPhotog, domain: process.env.OPENSHIFT_APP_DNS||"localhost:6001"}, function (err, results) {
    if (err) {
      console.log("Error rendering template.");
      console.log(err);
    }

    sendMail(referral.client.email, adminEmail, {subject: subject, body: results.html}, function(err, info) {
      if (err) {
        console.log("Error sending mail.");
        console.log(err);
        callback(err);
      }
      callback();
    });
    // result.html
    // result.text
  }, function (err) {
    callback(err);
  })
}

/*
 * to: the recipient's email address
 * content.subject: the subject of the email to be sent
 * content.body: the body of the email to be sent
 */
var sendMail = function(to, cc, content, callback) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'The Dot Referral Service <info@thedot.photo>', // sender address
      to: to,
      replyTo: adminEmail,
      subject: content.subject, // Subject line
      html: content.body // html body
  };

  if (cc) {
    mailOptions.cc = cc;
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if (error){
        console.log("Error sending email to: " + to);
        console.log(error);
        return callback(error);
      }

      if (cc) {
        console.log('Message sent to ' + to + " and (by CC) to " + cc + ": " + info.response);
      } else {
        console.log('Message sent to ' + to + ": " + info.response);
      }

      callback(null, info);
  });
};
module.exports.sendMail = sendMail;

function closeConnection() {
  connection.quit();
}
