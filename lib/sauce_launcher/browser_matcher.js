var _      = require('./util');
var format = require('util').format;

var DEFAULTS = {
  properties: ['api_name', 'short_version', 'os']
};

/**
 * Finds the closest match for the provided browser string.
 */
function BrowserMatcher(browsers, options) {
  if (!(this instanceof BrowserMatcher)) {
    return new BrowserMatcher(browsers, options);
  }

  this.options  = _.extend({}, DEFAULTS, options);
  this.browsers = _.cloneDeep(browsers);
}

_.extend(BrowserMatcher.prototype, {

  closest: function (str) {
    var target     = str.toLowerCase();
    var properties = this.options.properties;
    var specifiers = _.times(properties.length, function () {
      return '%s';
    }).join('-');

    return _(this.browsers)
      .sortBy(function (browser) {
        var args = [specifiers].concat(_.map(properties, function (property) {
          return (browser[property] || '').replace(' ', '').toLowerCase();
        }));
        var candidate = format.apply(null, args).replace(/-{2,}/, '-');
        var score = _.levenshtein(target, candidate);
        return score;
      })
      .first();
  }

});

module.exports = BrowserMatcher;
