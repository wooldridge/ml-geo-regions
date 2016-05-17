var config = {};

config.path = "/PATH/TO/ml-geo-regions/"; // include trailing "/"

config.host = "localhost";

config.server = {
  "port": 8563
};

config.database = {
  "name": "ml-sem-taxonomy",
  "port": 8562
};

config.auth = {
  user: 'USERNAME',
  pass: 'PASSWORD',
  sendImmediately: false
};

config.databaseSetup = {
  "database-name": config.database.name,
  "geospatial-region-path-index": [
    {
      "path-expression": "/region",
      "coordinate-system": "wgs84",
      "geohash-precision": "3",
      "invalid-values": "ignore"
    }
  ]
};

config.forestSetup = {
  "forest-name": config.database.name + '-1',
  "database": config.database.name
}

config.restSetup = {
  "rest-api": {
    "name": config.database.name + "-rest",
    "database": config.database.name,
    "modules-database": config.database.name + "-modules",
    "port": config.database.port,
    "error-format": "json"
  }
}

config.searchSetup = {
  "options": {
    "constraint": [
      {
        "name": "test",
        "geo-region-path": {
          "path-index": "/region"
        }
      }
    ]
  }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = config;
}
