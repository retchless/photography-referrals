import express from "express";
import bodyParser from "body-parser";
import React from "react";
import Router from "react-router";
import ReactViews from "express-react-views";
import mailer from "./utils/mailer";
import db from "./utils/db";
import cfenv from "cfenv";

const app = express();
app.use(bodyParser.json());

var appEnv = cfenv.getAppEnv();

// set up Jade
app.set('views', './views');  
app.set('view engine', 'jsx');
app.engine('jsx', ReactViews.createEngine());
app.use('/static', express.static(__dirname + "../../../src/server/public"));

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

import routes from "../shared/routes";

app.get('/*', function (req, res) {  
  Router.run(routes, req.url, Handler => {
    let content = React.renderToString(<Handler />);
    res.render('index', { content: content });
  });
});

app.listen(appEnv.port, appEnv.bind, function() {
    console.log("server starting on " + appEnv.url)
});
