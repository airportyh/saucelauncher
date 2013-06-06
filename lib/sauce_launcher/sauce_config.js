var _    = require('./util');
var fs   = require('fs');
var path = require('path');

var CONFIG_FILE = path.join(process.env.HOME, '.saucelabs.json');

/**
 * Manages configuration parameters.
 *
 * If nothing is passed to its constructor, it will read all parameters from
 * `~/.saucelabs.json`. If any parameters are passed to the constructor, they
 * will override those in the file.
 */
function SauceConfig(contents) {
  if (!(this instanceof SauceConfig)) {
    return new SauceConfig(contents);
  }

  this.contents = _.extend(clean(readConfig()), clean(contents));
}

_.extend(SauceConfig.prototype, {

  config: function () {
    return _.clone(this.contents);
  }

});

function readConfig() {
  return hasEnvConfig() ? envConfig() : readConfigFile();
}


function readConfigFile() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function clean(contents) {
  return _.reduce(contents, function (memo, value, key) {
    if (!_.isUndefined(value)) {
      memo[_.camelize(key)] = value;
    }
    return memo;
  }, {});
}

function hasEnvConfig() {
  return process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY;
}

function envConfig() {
  return {
    username: process.env.SAUCE_USERNAME,
    apiKey: process.env.SAUCE_ACCESS_KEY
  };
}

module.exports = SauceConfig;
