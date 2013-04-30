var SAUCE_URL      = 'ondemand.saucelabs.com';
var SAUCE_PORT     = 80;
var SAUCE_USERNAME = 'johndoe';
var SAUCE_API_KEY  = '550e8400-e29b-41d4-a716-446655440000';

describe('SauceDriver', function () {
  var SauceDriver;
  var driver;

  describe('#constructor', function () {
    beforeEach(function () {
      SauceDriver = require('../lib/sauce_launcher/sauce_driver');
    });

    it('can be instantiated with `new`', function () {
      driver = new SauceDriver();
      driver.should.be.an.instanceof(SauceDriver);
    });
    it('can be instantiated without `new`', function () {
      driver = SauceDriver();
      driver.should.be.an.instanceof(SauceDriver);
    });
  });

  describe('with faked out dependencies', function () {
    var dependencies;

    function prepare() {
      // Fake the wd module...
      dependencies = {
        wd: {
          remote: sinon.spy()
        }
      };
      // ... and inject it into the context.
      SauceDriver = sandbox.require('../lib/sauce_launcher/sauce_driver', {
        requires: dependencies
      });
    }

    describe('#constructor', function () {
      beforeEach(function () {
        prepare();
        driver = new SauceDriver({
          username: SAUCE_USERNAME,
          apiKey:   SAUCE_API_KEY
        });
      });

      it('calls the `remote` method in WebDriver', function () {
        dependencies.wd.remote.should.have.been.calledWithExactly(
          SAUCE_URL,
          SAUCE_PORT,
          SAUCE_USERNAME,
          SAUCE_API_KEY
        );
      });
    });
  });
});
