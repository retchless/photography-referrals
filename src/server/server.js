import express from "express";  
import React from "react";  
import Router from "react-router";
import ReactViews from "express-react-views";
import mailer from "./utils/mailer";
import cfenv from "cfenv";

const app = express();
var appEnv = cfenv.getAppEnv();

// set up Jade
app.set('views', './views');  
app.set('view engine', 'jsx');
app.engine('jsx', ReactViews.createEngine());

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
