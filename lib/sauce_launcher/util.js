var _   = require('lodash');
var log = require('winston').log;

_.mixin({

  /**
   * Returns a new string with carriage return characters (`\r`, `\n`, and
   * `\r\n`) removed from the end.
   */
  chomp: function (str) {
    return str.replace(/(\r|\n|\r\n)$/, '');
  },

  /**
   * Converts a snakeized string (`api_key`) to a camelized one (`apiKey`).
   */
  camelize: function (str) {
    return str.replace(/_+(.)?/g, function (match, c) {
      return c.toUpperCase();
    });
  },

  /**
   * Converts a camelized string (`apiKey`) to a snakeized one (`api_key`).
   */
  snakeize: function (str) {
    return str.replace(/([a-z])([A-Z]+)/g, '$1_$2').toLowerCase();
  },

  /**
   * Returns the minimum number of single-character edits (insertion, deletion,
   * substitution) required to change `str1` into `str2`.
   */
  levenshtein: function (str1, str2) {
    if (str1 === str2 || (!str1 && !str2)) {
      return 0;
    }
    if (!str1) {
      return str2.length;
    }
    if (!str2) {
      return str1.length;
    }

    var current = [];
    var prev;
    var value;

    for (var i = 0; i <= str2.length; i++) {
      for (var j = 0; j <= str1.length; j++) {
        if (i && j) {
          if (str1.charAt(j - 1) === str2.charAt(i - 1)) {
            value = prev;
          } else {
            value = Math.min(current[j], current[j - 1], prev) + 1;
          }
        } else {
          value = i + j;
        }

        prev = current[j];
        current[j] = value;
      }
    }

    return current.pop();
  },

  /**
   * Returns a RFC 4122 v4 universally unique identifier.
   */
  uuid: function () {
    var pattern  = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return pattern.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = (c === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  verbose: function () {
    tlog('verbose', arguments);
  },

  info: function () {
    tlog('info', arguments);
  },

  warn: function () {
    tlog('warn', arguments);
  },

  error: function () {
    tlog('error', arguments);
  }

});

function tlog(type, args) {
  log.apply(null, [type].concat(_.toArray(args)));
}

module.exports = _;
