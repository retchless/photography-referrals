'use strict';

var MongoClient = require('mongodb').MongoClient;

var services = process.env.VCAP_SERVICES;

var conn_str = "";
if (services) {
  var services = JSON.parse(services);
  if (services['mongolab']) {
    conn_str = services['mongolab'][0]['credentials'].uri;
  } else {
    conn_str = 'mongodb://localhost:27017';
  }
} else {
  conn_str = 'mongodb://localhost:27017';
}

var MongoClient = require('mongodb').MongoClient;
var db, photographers, referrals;
MongoClient.connect(conn_str, function (err, database) {
  if (err) {
    console.error("mongodb connection failed");
    console.error(err.toString());
    return;
  }
  db = database;
  photographers = db.collection('photographers');
  referrals = db.collection('referrals');
});

module.exports.insertPhotographer = function (photographer, callback) {
  if (!db) {
    return callback("attempted to access mongodb, but there is no active connection");
  }
  photographers.insert(photographer, callback);
};

module.exports.findPhotographers = function (callback) {
  if (!db) {
    return callback("attempted to access mongodb, but there is no active connection");
  }
  photographers.find({}).toArray(callback);
};