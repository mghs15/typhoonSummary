const fs = require('fs');

const metadata = require(`./src/metadata.json`);

const dataset = require(`./dat/dataset.json`);
const route = require(`./dat/route.json`);
const tide = require(`./dat/tide.json`);
const tidediff = require(`./dat/tide-diff.json`);

const set = {
  "metadata": metadata,
  "chart": {
    ...dataset, ...tide, ...tidediff
  },
  "route": route
}

fs.writeFileSync(`./docs/data.json`, JSON.stringify(set, null, 2));


