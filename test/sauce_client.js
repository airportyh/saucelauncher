var SAUCE_USERNAME = 'johndoe';
var SAUCE_API_KEY  = '550e8400-e29b-41d4-a716-446655440000';

describe('SauceClient', function () {
  var SauceClient;
  var client;

  describe('#constructor', function () {
    beforeEach(function () {
      SauceClient = require('../lib/sauce_launcher/sauce_client');
    });

    it('can be instantiated with `new`', function () {
      client = new SauceClient();
      client.should.be.an.instanceof(SauceClient);
    });
    it('can be instantiated without `new`', function () {
      client = SauceClient();
      client.should.be.an.instanceof(SauceClient);
    });
  });

  describe('with faked out dependencies', function () {
    var saucelabs;
    var dependencies;

    function prepare(func) {
      // Fake the saucelabs module...
      saucelabs = _.object([func], [sinon.spy()]);
      dependencies = {
        saucelabs: sinon.spy(function () {
          return saucelabs;
        })
      };
      // ... and inject it into the context.
      SauceClient = sandbox.require('../lib/sauce_launcher/sauce_client', {
        requires: dependencies
      });
    }

    describe('#browsers', function () {
      beforeEach(function () {
        prepare('getWebDriverBrowsers');
        client = new SauceClient({
          username: SAUCE_USERNAME,
          apiKey:   SAUCE_API_KEY
        });
      });

      it('calls the `getWebDriverBrowsers` method in SauceLabs', function () {
        var callback = function () {};
        client.browsers(callback);
        saucelabs.getWebDriverBrowsers.should.have.been.calledWithExactly(
          callback
        );
      });
    });

    describe('#jobs', function () {
      beforeEach(function () {
        prepare('getJobs');
        client = new SauceClient({
          username: SAUCE_USERNAME,
          apiKey:   SAUCE_API_KEY
        });
      });

      it('calls the `getJobs` method in SauceLabs', function () {
        var callback = function () {};
        client.jobs(callback);
        saucelabs.getJobs.should.have.been.calledWithExactly(
          callback
        );
      });
    });

    describe('#tunnels', function () {
      beforeEach(function () {
        prepare('getActiveTunnels');
        client = new SauceClient({
          username: SAUCE_USERNAME,
          apiKey:   SAUCE_API_KEY
        });
      });

      it('calls the `getActiveTunnels` method in SauceLabs', function () {
        var callback = function () {};
        client.tunnels(callback);
        saucelabs.getActiveTunnels.should.have.been.calledWithExactly(
          callback
        );
      });
    });

  });
});
