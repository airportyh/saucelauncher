var _    = require('./util');
var fs   = require('fs');
var path = require('path');

var FALLBACK_DIR  = '/tmp';
var ENV_VARIABLES = ['TMPDIR', 'TMP', 'TEMP'];

/**
 * Allows manipulating temporary files with an optional time-to-live. If a TTL
 * is specified, the file will be marked as expired if its `mtime` is less than
 * the current time minus the TTL.
 *
 * These files will NOT be automatically removed.
 */
function TempFile(options) {
  if (!(this instanceof TempFile)) {
    return new TempFile(options);
  }

  this.options = _.extend({ name: randomName() }, options);
  this.path    = path.join(tempDir(), this.options.name);
}

_.extend(TempFile.prototype, {

  realpath: function () {
    return this.path;
  },

  exists: function () {
    return fs.existsSync(this.path);
  },

  expired: function () {
    if (this.options.ttl == null) {
      return false;
    }

    var stat = fs.statSync(this.path);
    return stat.mtime < (Date.now() - this.options.ttl);
  },

  read: function () {
    return fs.readFileSync(this.path);
  },

  write: function (data) {
    fs.writeFileSync(this.path, data);
  }

});

function randomName() {
  return _.uuid();
}

function tempDir() {
  var path = fs.realpathSync(FALLBACK_DIR);
  _.each(ENV_VARIABLES, function (name) {
    var value = process.env[name];
    if (value) {
      path = fs.realpathSync(value);
      return false;
    }
  });
  return path;
}

module.exports = TempFile;
