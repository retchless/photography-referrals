var
  SMTPConnection = require('smtp-connection'),
  async = require("async"),
  dust = require("dust"),
  db = require("../utils/db")
;

initConnection();

module.exports.sendAskEmail = function(referral, photographer, callback) {
  dust.render('views/ask', { referral: referral, photographer: photographer }, function(err, out) {
    console.log(err || out);
  });
}

module.exports.sendResultsEmail = function(referral, callback) {
  dust.render('views/results', { referral: referral }, function(err, out) {
    console.log(err || out);
  });
}

/*
 * to: the recipient's email address
 * content.subject: the subject of the email to be sent
 * content.body: the body of the email to be sent
 */
module.exports.sendMail = function(to, content, callback) {

  var message = content.subject ? "Subject: " + content.subject + "\n": "";
  message += content.body;
  connection.send(
    {
      from: "thedotreferral@gmail.com",
      to: to
    },
    message,
    callback
  );

};

var connection;
function initConnection() {

  connection = new SMTPConnection({
    port: 465,
    host: "smtp.gmail.com",
    secure: true
  });

  async.series([
    connection.connect.bind(connection),
    function(callback) {
      connection.login({
        user: "thedotreferral",
        pass: "retchless"
      }, callback);
    }
  ],

  function(err, results) {
    if (err) {
      console.error("SMTP connection failed: " + err.toString());
    } else {
      console.log("SMTP connection established");  
    }
  });

}
