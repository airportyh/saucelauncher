var _        = require('./util');
var TempFile = require('./temp_file');

var DEFAULTS = {
  name: 'saucelabs_cache.json',
  ttl:  24 * 60 * 60 * 1000 // 1 day
};

/**
 * Manages the cache used to store Sauce Labs stuff.
 */
function SauceCache(options) {
  if (!(this instanceof SauceCache)) {
    return new SauceCache(options);
  }

  this.options = _.extend({}, DEFAULTS, options);
  this.tfile   = new TempFile(this.options);
}

_.extend(SauceCache.prototype, {

  load: function (provider, callback) {
    var cache = readFromTempFile(this.tfile, this.options.version);
    if (cache == null) {
      provider(_.bind(function (err, data) {
        if (err != null) {
          callback(err);
        } else {
          writeToTempFile(this.tfile, this.options.version, data);
          callback(null, data);
        }
      }, this));
    } else {
      callback(null, cache.data);
    }
  }

});

function readFromTempFile(tfile, version) {
  var result;

  _.verbose('Trying to read cache file (%s)', tfile.realpath());
  if (tfile.exists()) {
    if (!tfile.expired()) {
      try {
        result = JSON.parse(tfile.read());
        if (version != null && version !== result.version) {
          _.verbose('Cache file exists with old version (%s)', result.version);
          result = null;
        } else {
          _.verbose('Cache file exists with current version (%s)', result.version);
        }
      } catch (e) {
        _.error('Cache file could not be read: %s', e.message);
      }
    } else {
      _.verbose('Cache file exists but has expired');
    }
  }

  return result;
}

function writeToTempFile(tfile, version, data) {
  _.verbose('Trying to write cache file (%s)', tfile.realpath());
  try {
    tfile.write(JSON.stringify({ version: version, data: data }));
    _.verbose('Cache file written with current version (%s)', version);
  } catch (e) {
    _.error('Cache file could not be written: %s', e.message);
  }
}

module.exports = SauceCache;
