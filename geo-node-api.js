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

    var whereClause = q.where(
                  q.geospatial(
                  q.geoElementPair(
                    q.qname('point'),
                    q.qname('latitude'),
                    q.qname('longitude')
                  ),
                    q.geoOptions('coordinate-system=wgs84'),
                    q.point(q.latlon(lat, lon))
                  )
                );
    //console.log(JSON.stringify(whereClause, null, 2));
    db.documents.query(whereClause)
    .result(function(result) {
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

  it('should perform a geospatial region-includes-point query (geoPropertyPair)', function(done) {

    var usaBox = q.polygon([50,-126], [24,-126], [24,-66], [50,-66]);

    var whereClause = q.where(
                        q.geospatial(
                          q.geoPropertyPair('point', 'latitude', 'longitude'),
                          usaBox
                        )
                      );
                      //.withOptions({"debug": true});

    //console.log(JSON.stringify(whereClause, null, 2));
    db.documents.query(whereClause)
    .result(function(result) {
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

  it('should perform a geospatial region-includes-point query (geoElementPair)', function(done) {

    var usaBox = q.polygon([50,-126], [24,-126], [24,-66], [50,-66]);

    var whereClause = q.where(
                        q.geospatial(
                          q.geoElementPair(
                            q.qname('point'),
                            q.qname('latitude'),
                            q.qname('longitude')
                          ),
                          usaBox
                        )
                      );
                      //.withOptions({"debug": true});

    //console.log(JSON.stringify(whereClause, null, 2));
    db.documents.query(whereClause)
    .result(function(result) {
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

  it('should perform a geospatial region-includes-point query (geoPath)', function(done) {

    var usaBox = q.polygon([50,-126], [24,-126], [24,-66], [50,-66]);

    var geoClause = q.geospatial(
                          q.geoPath('/gElemChildParent/gElemChildPoint'),
                          //q.geoPath(q.pathIndex('/point', '')),
                          usaBox
                        );

    //console.log(JSON.stringify(geoClause, null, 2));

    var whereClause = q.where(geoClause);
                      //.withOptions({"debug": true});

    //console.log(JSON.stringify(whereClause, null, 2));
    db.documents.query(whereClause)
    .result(function(result) {
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
    };

    var toTest = mexicoUSA;

    var whereClause = q.geospatial(
          q.geoPath('/region'),
          'overlaps',
          q.box(
            toTest.box.south,
            toTest.box.west,
            toTest.box.north,
            toTest.box.east
          )
        );

    //console.log(JSON.stringify(whereClause, null, 2));

    db.documents.query(
      q.where(whereClause)
      //.withOptions({"debug": true})
    ).result(function(result) {
        //console.log(JSON.stringify(result, null, 2));
        result.length.should.equal(toTest.overlaps.length);
        result[0].content.name.should.equal("USA");
        result[1].content.name.should.equal("Mexico");
        done();
      },
      function(error) {
        console.log(JSON.stringify(error, null, 2));
        done();
      });

  });

});
