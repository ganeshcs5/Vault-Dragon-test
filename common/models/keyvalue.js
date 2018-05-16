'use strict';

module.exports = function (KeyValue) {
  KeyValue.keypost = function (key, cb) {


    var listOfdata = Object.getOwnPropertyNames(key);
    
    if (listOfdata.length != 1) {
      cd(null, "please send only one data at a time")
    } else {
      var object = {};
      object.key = listOfdata[0];
      object.value = key[object.key];
      object.timestamp = new Date().getTime();
      KeyValue.create(object, function (err, saveObject) {
        var resObject = {};
        resObject.key = saveObject.key;
        resObject.value = saveObject.value;
        resObject.timestamp = saveObject.timestamp;
        cb(null, resObject);
      })
    }


  }
  //get function
  KeyValue.keyGet = function (key, timestamp, cb) {

    console.log(timestamp)
    var whereClause = {
      order: 'timestamp DESC',
      where: {
        key: key
      }

    }


    KeyValue.find(whereClause, function (err, obj) {

      if (obj.length == 0) {
        cb(null, "no values")
      } else if (timestamp == undefined || timestamp === "") {
        console.log(timestamp + "      test")
        var object = {};

        object.value = obj[0].value
        cb(null, object);
      } else {

        for (var i = 0; i < obj.length; i++) {
          if (timestamp >= obj[i].timestamp) {
            var object = {};
            object.value = obj[i].value;
            cb(null, object);
            break;
          }
        }
      }


    })

  };
  KeyValue.remoteMethod(
    'keyGet', {
      http: {
        path: '/key/:key',
        verb: 'get'
      },
      accepts: [
        { arg: 'key', type: 'string', required: true },
        { arg: 'timestamp', type: 'string' }
      ],
      returns: {
        arg: 'response',
        type: 'string'
      }
    }
  );
  KeyValue.remoteMethod(
    'keypost', {
      http: {
        path: '/key',
        verb: 'post'
      },
      accepts: [
        { arg: 'key', type: 'object', required: true, http: { source: 'body' } },
      ],
      returns: {
        arg: 'response',
        type: 'string'
      }
    }
  );
};
