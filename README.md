# ml-geo-regions

Test new geospatial search features

## Requirements

- MarkLogic 9
- Node.js

## To Run

```git clone https://github.com/wooldridge/ml-geo-regions```

```cd ml-geo-regions```

```npm install```

Copy `config_sample.js` to `config.js` and edit `config.js` for your setup (path, user, password, etc.).

```node setup```

```mocha index```

To undo setup from root directory: `node teardown`
