var config = require('./config'),
    rp = require('request-promise');

function test() {
  var cities = {
    "Mexico City": {
      "latitude": 19.429297983081977,
      "longitude": -99.140625
    },
    "Chicago": {
      "latitude": 41.881832,
      "longitude": -87.623177
    },
    "Havana": {
      "latitude": 22.58,
      "longitude": -82.24
    },
    "Paris": {
      "latitude": 48.8566,
      "longitude": 2.3522
    }
  }
  var body = {
    "query": {
      "queries": [{
              "geo-region-path-query":{
                "path-index": {
                  "text": "/region"
                },
                "geospatial-operator": "contains",
                "point": cities["Chicago"]
              }
      }]
    }
  };
  var options = {
    method: 'POST',
    uri: 'http://' + config.host + ':' + config.restSetup["rest-api"]["port"] + '/v1/search',
    body: body,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: config.auth
  };
  rp(options)
    .then(function (parsedBody) {
      console.log(JSON.stringify(parsedBody, null, 2));
    })
    .catch(function (err) {
      console.log(JSON.stringify(err, null, 2));
    });
}

test();
