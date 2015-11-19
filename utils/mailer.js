var
  nodemailer = require('nodemailer'),
  async = require("async"),
  dust = require('dustjs-linkedin'),
  db = require("../utils/db"),
  EmailTemplate = require('email-templates').EmailTemplate,
  path = require('path')
;

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'thedotreferral@gmail.com',
        pass: 'retchless'
    }
});

module.exports.sendAskEmail = function(referral, photogs, callback) {
  var templateDir = path.join(__dirname, "../", 'templates', 'ask')
   
  var askEmail = new EmailTemplate(templateDir);
   
  async.each(photogs, function (photog, next) {
    askEmail.render({photographer: photog, referral: referral, domain: process.env.OPENSHIFT_APP_DNS||"localhost:6001"}, function (err, results) {
      if (err) {
        console.log(err);
        return next(err);
      }
      sendMail(photog.email, {subject: "Incoming Referral from The Dot", body: results.html}, function(err, info) {
        next();
      });
      // result.html 
      // result.text 
    })
  }, function (err) {
    callback();
  });
}

module.exports.sendResultsEmail = function(referral, photographers, callback) {

  var availPhotogs = referral.availability;
  var subject = "";
  if (availPhotogs) {
    console.log(availPhotogs.length + " available photographers for referral " + referral._id + ":");
    console.log(availPhotogs); 
    for (var i = 0; i < availPhotogs.length; i++) {

    }
    subject = "The.Dot: Available photographers on your wedding date!"
  } else {
    console.log("No photographers available for referral " + referral._id);
    subject = "";
  }

  var templateDir = path.join(__dirname, "../", 'templates', availPhotogs ? 'results' : 'results_none');  
  var resultsEmail = new EmailTemplate(templateDir);
  resultsEmail.render({availPhotogs: availPhotogs, referral: referral, domain: process.env.OPENSHIFT_APP_DNS||"localhost:6001"}, function (err, results) {
    if (err) {
      console.log("Error rendering template.");
      console.log(err);
    }

    sendMail(referral.client.email, {subject: subject, body: results.html}, function(err, info) {
      if (err) {
        console.log("Error sending mail.");
        console.log(err);  
      }
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
var sendMail = function(to, content, callback) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'The Dot Referral Service <thedotreferral@gmail.com>', // sender address
      to: to,
      subject: content.subject, // Subject line
      html: content.body // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log("Error sending email to: " + to);
        console.log(error);
        return callback(error);
      }
      console.log('Message sent to '+ to + ": " + info.response);
      callback(null, info);
  });
};
module.exports.sendMail = sendMail;

function closeConnection() {
  connection.quit();
}
