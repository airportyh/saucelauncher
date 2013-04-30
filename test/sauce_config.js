var path = require('path');

var CONFIG_FILE    = path.join(process.env.HOME, '.saucelabs.json');
var SAUCE_USERNAME = 'johndoe';
var SAUCE_API_KEY  = '550e8400-e29b-41d4-a716-446655440000';

var SAMPLE_CONFIG = {
  username: SAUCE_USERNAME,
  api_key:  SAUCE_API_KEY
};

describe('SauceConfig', function () {
  var SauceConfig;
  var config;

  describe('#constructor', function () {
    beforeEach(function () {
      SauceConfig = require('../lib/sauce_launcher/sauce_config');
    });

    it('can be instantiated with `new`', function () {
      config = new SauceConfig();
      config.should.be.an.instanceof(SauceConfig);
    });
    it('can be instantiated without `new`', function () {
      config = SauceConfig();
      config.should.be.an.instanceof(SauceConfig);
    });
  });

  describe('with faked out dependencies', function () {
    var dependencies;

    function prepare(err) {
      // Fake the fs module...
      dependencies = {
        fs: {
          readFileSync: sinon.spy(function () {
            if (err != null) {
              throw err;
            }
            return JSON.stringify(SAMPLE_CONFIG);
          })
        }
      };
      // ... and inject it into the context.
      SauceConfig = sandbox.require('../lib/sauce_launcher/sauce_config', {
        requires: dependencies
      });
    }

    describe('#config', function () {
      var PROPERTIES = [
        { key: 'username', ckey: 'username', value: SAUCE_USERNAME },
        { key: 'api_key',  ckey: 'apiKey',   value: SAUCE_API_KEY  }
      ];

      _.each(PROPERTIES, function (property) {
        var key   = property.key;
        var ckey  = property.ckey;
        var value = property.value;

        describe('if `' + key + '` was passed to the constructor', function () {
          var override;

          beforeEach(function () {
            override = _.object([key], ['bazqux']);
            config = new SauceConfig(override);
          });

          it('contains that value for key `' + ckey + '`', function () {
            config.config()[ckey].should.equal(override[key]);
          });
        });

        describe('if nothing was passed to the constructor but `' + key + '` exists in `~/.saucelabs.json`', function () {
          beforeEach(function () {
            prepare();
            config = new SauceConfig();
          });

          it('contains that value for key `' + ckey + '`', function () {
            dependencies.fs.readFileSync.should.have.been.calledWithExactly(
              CONFIG_FILE,
              'utf8'
            );
            config.config()[ckey].should.equal(value);
          });
        });

        describe('if nothing was passed to the constructor and `' + key + '` does not exist in `~/.saucelabs.json`', function () {
          beforeEach(function () {
            prepare('NOENT');
            config = new SauceConfig();
          });

          it('contains `undefined` for key `' + ckey + '`', function () {
            dependencies.fs.readFileSync.should.have.been.calledWithExactly(
              CONFIG_FILE,
              'utf8'
            );
            should.not.exist(config.config()[ckey]);
          });
        });
      });
    });
  });
});
