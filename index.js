var config = require('./config'),
    should = require('should'),
    rp = require('request-promise');

describe('geo-region', function() {

  var cities = {
    "Mexico City": {
      "point": {
        "latitude": 19.429297983081977,
        "longitude": -99.140625
      },
      "within": "/mexico.json"
    },
    "Chicago": {
      "point": {
        "latitude": 41.881832,
        "longitude": -87.623177
      },
      "within": "/usa.json"
    },
    "Havana": {
      "point": {
        "latitude": 22.58,
        "longitude": -82.24
      },
      "within": "/cuba.json"
    },
    "Paris": {
      "point": {
        "latitude": 48.8566,
        "longitude": 2.3522
      },
      "within": null
    }
  }

  var mexicoUSA = {
    "box": {
      "south": 23,
      "west": -111,
      "north": 38,
      "east": -97
    },
    "overlaps": [
        "/mexico.json",
        "/usa.json"
    ]
  }

  it('should perform a contains search using geo-region-path-query', function(done) {
    var toTest = cities["Chicago"];
    var body = {
      "query": {
        "queries": [{
          "geo-region-path-query":{
            "path-index": {
              "text": "/region"
            },
            "geospatial-operator": "contains",
            "point": toTest.point
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
      .then(function (result) {
        //console.log(JSON.stringify(result, null, 2));
        result.total.should.equal(1);
        result.results[0].uri.should.equal(toTest.within);
        done();
      })
      .catch(done);
  });

  it('should perform an overlap search using geo-region-path-query', function(done) {
    var toTest = mexicoUSA;
    var body = {
      "query": {
        "queries": [{
          "geo-region-path-query":{
            "path-index": {
              "text": "/region"
            },
            "geospatial-operator": "overlaps",
            "box": toTest.box
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
      .then(function (result) {
        //console.log(JSON.stringify(result, null, 2));
        result.total.should.equal(2);
        result.results[0].uri.should.equalOneOf(toTest.overlaps);
        result.results[1].uri.should.equalOneOf(toTest.overlaps);
        done();
      })
      .catch(done);
  });

  it('should execute a combination query using geo-region-constraint-query', function(done) {
    var toTest = cities["Mexico City"];
    var body = {
      "search": {
        "query": {
          "queries": [{
            "geo-region-constraint-query":{
              "constraint-name": "test",
              "geospatial-operator": "contains",
              "point": toTest.point
            }
          }]
        },
        "options": {
          "constraint": [
            {
              "name": "test",
              "geo-region-path": {
                "path-index": { "text": "/region" }
              }
            }
          ]
        }
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
      .then(function (result) {
        //console.log(JSON.stringify(result, null, 2));
        result.total.should.equal(1);
        result.results[0].uri.should.equal(toTest.within);
        done();
      })
      .catch(done);
  });
});
