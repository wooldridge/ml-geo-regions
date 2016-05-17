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
    "search-option": [
      "unfiltered"
    ],
    "page-length": 10,
    "term": {
      "apply": "term",
      "empty": {
        "apply": "all-results"
      },
      "term-option": [
        "punctuation-insensitive"
      ]
    },
    "constraint": [
      {
        "name": "doc",
        "range": {
          "collation": "http://marklogic.com/collation/",
          "type": "xs:string",
          "facet": false,
          "element": {
            "ns": "",
            "name": "doc"
          }
        }
      },
      {
        "name": "title",
        "range": {
          "collation": "http://marklogic.com/collation/",
          "type": "xs:string",
          "facet": false,
          "element": {
            "ns": "",
            "name": "title"
          }
        }
      },
      {
        "name": "description",
        "range": {
          "collation": "http://marklogic.com/collation/",
          "type": "xs:string",
          "facet": false,
          "element": {
            "ns": "",
            "name": "description"
          }
        }
      }
    ],
    "transform-results": {
      "apply": "snippet",
      "preferred-elements": {
        "element": [
          {
            "ns": "",
            "name": "description"
          },
          {
            "ns": "",
            "name": "title"
          }
        ]
      },
      "max-matches": "3",
      "max-snippet-chars": "250",
      "per-match-tokens": "20"
    },
    "return-query": true,
    "extract-metadata": {
      "constraint-value": [
        {
          "ref": "doc"
        },
        {
          "ref": "title"
        },
        {
          "ref": "description"
        }
      ]
    }
  }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = config;
}
