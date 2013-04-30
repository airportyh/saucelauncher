var _  = require('./util');
var wd = require('wd');

var DEFAULTS = {
  host: 'ondemand.saucelabs.com',
  port: 80
};

/**
 * Manages the remote browser in Sauce Labs through WebDriver.
 */
function SauceDriver(options) {
  if (!(this instanceof SauceDriver)) {
    return new SauceDriver(options);
  }

  this.options = _.extend({}, DEFAULTS, options);
  this.driver  = createDriver(this.options);
}

_.extend(SauceDriver.prototype, {

  run: function (func) {
    this.driver
      .chain()
      .init(this.options)
      .get(this.options.url, func);
  }

});

function createDriver(options) {
  options = (options != null ? options : {});
  return wd.remote(
    options.host,
    options.port,
    options.username,
    options.apiKey
  );
}

module.exports = SauceDriver;
