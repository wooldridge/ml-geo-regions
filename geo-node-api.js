var config = require('./config'),
    should = require('should'),
    marklogic = require('marklogic');

var db = marklogic.createDatabaseClient({
  host: config.host,
  port: config.database.port,
  user: config.auth.user,
  password: config.auth.pass,
  authType: 'digest'
});

var q = marklogic.queryBuilder;

describe('geo-node-api', function() {

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

  it('should perform a geospatial point-equals-point query', function(done) {

    var lat = cities["Chicago"].point.latitude,
        lon = cities["Chicago"].point.longitude;

    var where = q.where(
                  q.geospatial(
                    q.geoPropertyPair('point', 'latitude', 'longitude'),
                    q.point(q.latlon(lat, lon))
                  )
                );
    db.documents.query(
      q.where(
        q.geospatial(
          q.geoElementPair(
            q.qname('point'),
            q.qname('latitude'),
            q.qname('longitude')
          ),
          q.point(lat, lon)
        )
      )
    ).result(function(result) {
        //console.log(JSON.stringify(result, null, 2));
        result.length.should.equal(1);
        result[0].content.name.should.equal("Chicago");
        done();
      },
      function(error) {
        console.log(JSON.stringify(error, null, 2));
        done();
      });

  });

  it('should perform a geospatial region-includes-point query', function(done) {

    var usaBox = q.polygon([50,-126], [24,-126], [24,-66], [50,-66]);

    db.documents.query(
      q.where(
        q.geospatial(
          q.geoElementPair(
            q.qname('point'),
            q.qname('latitude'),
            q.qname('longitude')
          ),
          usaBox
        )
      )
      //.withOptions({"debug": true})
    ).result(function(result) {
        //console.log(JSON.stringify(result, null, 2));
        result.length.should.equal(1);
        result[0].content.name.should.equal("Chicago");
        done();
      },
      function(error) {
        console.log(JSON.stringify(error, null, 2));
        done();
      });

  });

  // TODO
  it('should perform a geospatial region-includes-region query', function(done) {

    var usaBox = q.polygon([50,-126], [24,-126], [24,-66], [50,-66]);

    db.documents.query(
      q.where(
        q.geospatial(
          // Specify region(s) to search
          usaBox
        )
      )
      //.withOptions({"debug": true})
    ).result(function(result) {
        //console.log(JSON.stringify(result, null, 2));
        result.length.should.equal(1);
        result[0].content.name.should.equal("Chicago");
        done();
      },
      function(error) {
        console.log(JSON.stringify(error, null, 2));
        done();
      });

  });

});
