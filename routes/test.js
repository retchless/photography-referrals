var mailer = require("../utils/mailer");

exports.sendMail = function(req, res) {
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
}