var _     = require('./util');
var path  = require('path');
var spawn = require('child_process').spawn;

var JAR_FILE = path.resolve(__dirname, '../../support/Sauce-Connect.jar');

/**
 * Wrapper around `Sauce-Connect.jar` provided by Sauce Labs.
 */
function SauceConnect(options) {
  if (!(this instanceof SauceConnect)) {
    return new SauceConnect(options);
  }

  this.options = _.extend({}, options);
}

_.extend(SauceConnect.prototype, {

  version: function (callback) {
    var stdout = [];
    var stderr = [];

    var proc = spawnProc('--version');

    proc.stdout.on('data', function (data) {
      stdout.push(data.toString());
    });
    proc.stderr.on('data', function (data) {
      stderr.push(data.toString());
    });
    proc.on('close', function (code) {
      if (code === 0) {
        callback(null, _.chomp(stdout.join('')));
      } else {
        callback(_.chomp(stderr.join('')));
      }
    });

    return proc;
  },

  tunnel: function (options) {
    var args = [this.options.username, this.options.apiKey];

    options = (options != null ? options : {});
    if (options.debug) {
      args.push('--debug');
    }
    if (options.shared) {
      args.push('--shared-tunnel');
    }

    return spawnProc.apply(this, args);
  }

});

function spawnProc() {
  var args = ['-jar', JAR_FILE];
  return spawn('java', args.concat(_.toArray(arguments)), { detached: true });
}

module.exports = SauceConnect;
