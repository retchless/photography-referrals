var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var async = require("async");

var host = process.env.OPENSHIFT_MONGODB_DB_HOST;
var port = process.env.OPENSHIFT_MONGODB_DB_PORT;
var username = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
var password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;

var conn_str = "";
if (host) {
  console.log("Found OpenShift MongoDB: " + host + ":" + port);
  conn_str = "mongodb://"+username+":"+password+"@"+host+":"+port;
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

module.exports.recordAvailability = function(answer, callback) {
  if (!db) {
    return callback("attempted to access mongodb, but there is no active connection");
  }

  var asyncTasks = {
    photographer: function(callback) {
      getPhotographerById(answer.photographerId, function(err, photog) {
        if (!photog || photog.length == 0) {
          callback("error: Invalid Photographer ID");
          return;
        }
        console.log("valid photographer: " + photog._id);
        callback(null, photog);
      });
    },
    referral: function(callback) {
      getReferralById(answer.referralId, function(err, ref) {
        if (!ref || ref.length == 0) {
          callback("error: Invalid Referral ID");
          return;
        }
        console.log("valid referral: " + ref._id);
        callback(null, ref);
      });
    }
  }

  async.parallel(asyncTasks, function(err, results) {
    if (err) {
        callback(err);
    }

    results.availability = !!JSON.parse(answer.available);

    // first try just updating the existing response for this photographer
    referrals.update({
      _id: ObjectID(answer.referralId),
      "availability.photographerId": answer.photographerId
    }, {
      $set: {
        "availability.$.available": results.availability
      }
    }, function(err, result) {
      if (err) {
        console.log("error: " + err.toString());
        return callback(err);
      }

      // if we modified a record, fetch the referral and respond
      if (result.nModified > 0) {
        return callback(null, results);
      }

      // if we didn't modify a record, the photographer hadn't replied yet, so add a new response
      referrals.update({
        _id: ObjectID(answer.referralId)
      }, {
        $addToSet: {
          availability: {
            photographerId: answer.photographerId,
            available: results.availability
          }
        }
      }, function(err, result) {
        if (err) {
          return callback(err);
        }

        // we successfully added the new answer, fetch the referral and respond
        return callback(null, results);
      });
    });
  });
}

function getReferralById (id, callback) {
  if (!db) {
    return callback("attempted to access mongodb, but there is no active connection");
  }

  var id;
  try {
    id = ObjectID(id);
  } catch (err) {
    return callback("Invalid referral ID");
  }
 
  referrals.findOne({ _id: id}, callback);
}
module.exports.getReferralById = getReferralById;

function getPhotographerById (id, callback) {
  if (!db) {
    return callback("attempted to access mongodb, but there is no active connection");
  }

  var id;
  try {
    id = ObjectID(id);
  } catch (err) {
    return callback("Invalid photographer ID");
  }

  photographers.findOne({ _id: id}, callback);
}
module.exports.getPhotographerById = getPhotographerById;

module.exports.getActiveReferrals = function(callback) {
  if (!db) {
    return callback("attempted to access mongodb, but there is no active connection");
  }

  referrals.find({
    created: { $lt: new Date((new Date()) - 1000*60*60*24) }
  }, callback);
}

module.exports.insertReferral = function(referral, callback) {
  if (!db) {
    return callback("attempted to access mongodb, but there is no active connection");
  }
  referrals.insert(referral, callback);
}