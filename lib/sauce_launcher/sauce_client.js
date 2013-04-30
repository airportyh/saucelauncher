var _         = require('./util');
var SauceLabs = require('saucelabs');

/**
 * Wrapper around the `saucelabs` module, which is itself a wrapper around
 * Sauce Labs REST API.
 */
function SauceClient(options) {
  if (!(this instanceof SauceClient)) {
    return new SauceClient(options);
  }

  this.options = _.extend({}, options);
  this.client  = createClient(this.options);
}

_.extend(SauceClient.prototype, {

  browsers: function (callback) {
    this.client.getWebDriverBrowsers(callback);
  },

  jobs: function (callback) {
    this.client.getJobs(callback);
  },

  tunnels: function (callback) {
    this.client.getActiveTunnels(callback);
  }

});

function createClient(options) {
  options = (options != null ? options : {});
  return new SauceLabs({
    username: options.username,
    password: options.apiKey
  });
}

module.exports = SauceClient;
