"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _expressReactViews = require("express-react-views");

var _expressReactViews2 = _interopRequireDefault(_expressReactViews);

var _utilsMailer = require("./utils/mailer");

var _utilsMailer2 = _interopRequireDefault(_utilsMailer);

var _utilsDb = require("./utils/db");

var _utilsDb2 = _interopRequireDefault(_utilsDb);

// END TEST ROUTES

var _sharedRoutes = require("../shared/routes");

var _sharedRoutes2 = _interopRequireDefault(_sharedRoutes);

var app = (0, _express2["default"])();
app.use(_bodyParser2["default"].json());

// set up Jade
app.set('views', './views');
app.set('view engine', 'jsx');
app.engine('jsx', _expressReactViews2["default"].createEngine());
app.use('/static', _express2["default"]["static"](__dirname + "../../../src/server/public"));

// THESE ARE TEST ROUTES - REAL ROUTES SHOULD BE MOVED OUT OF THE MAIN APP FILE
app.get("/sendMail", function (req, res) {
  var address = req.query.address;
  if (!address) {
    res.status = 400;
    res.end("Missing required url parameter: address");
    return;
  }

  _utilsMailer2["default"].sendMail(address, { subject: "Subject line", body: "My mailer is in a module now" }, function (err, callback) {
    if (err) {
      res.status = 400;
      res.end(err.toString());
      return;
    }
    res.end("Mail sent!");
  });
});

app.get("/photographers", function (req, res) {
  _utilsDb2["default"].findPhotographers(function (err, photogs) {
    if (err) {
      res.status(400);
      res.end(err.toString());
      return;
    }
    res.end(JSON.stringify(photogs));
  });
});

app.put("/photographers", function (req, res) {
  console.log(req.body);
  if (!req.body || !req.body.fname || !req.body.lname || !req.body.email) {
    res.status(400);
    res.end("Invalid PUT body - must provide: fname, lname, email");
    return;
  }
  _utilsDb2["default"].insertPhotographer(req.body, function (err, result) {
    if (err) {
      res.status(400);
      res.end(err.toString());
      return;
    }
    res.end("OK");
  });
});

app.get('/*', function (req, res) {
  _reactRouter2["default"].run(_sharedRoutes2["default"], req.url, function (Handler) {
    var content = _react2["default"].renderToString(_react2["default"].createElement(Handler, null));
    res.render('index', { content: content });
  });
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 6001;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

console.log("PORT: " + server_port + ", IP: " + server_ip_address);

app.listen(server_port, server_ip_address, function () {
  console.log("Listening on " + server_ip_address + ", server_port " + server_port);
});