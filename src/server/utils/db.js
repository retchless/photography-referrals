var MongoClient = require('mongodb').MongoClient;

var host = process.env.OPENSHIFT_MONGODB_DB_HOST;
var port = process.env.OPENSHIFT_MONGODB_DB_PORT;
var username = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
var password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;

var conn_str = "";
if (host) {
  console.log("Found OpenShift MongoDB: " + host + ":" + port);
  conn_str = "mongodb://"+host+":"+port;
} else {
  console.log("Default to localhost MongoDB: 127.0.0.1:27017");
  conn_str = 'mongodb://localhost:27017';
}

var MongoClient = require('mongodb').MongoClient;
var db, photographers, referrals;
MongoClient.connect(conn_str, function(err, database) {
  if(err) {
    console.error("mongodb connection failed");
    console.error(err.toString());
    return;
  }
  db = database;
  photographers = db.collection('photographers');
  referrals = db.collection('referrals');
});

module.exports.insertPhotographer = function(photographer, callback) {
  if (!db) {
    return callback("attempted to access mongodb, but there is no active connection");
  }
  photographers.insert(photographer, callback);
}

module.exports.findPhotographers = function(callback) {
  if (!db) {
    return callback("attempted to access mongodb, but there is no active connection");
  }
  photographers.find({}).toArray(callback);
}