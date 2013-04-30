var BROWSERS = require('./fixtures/browsers');

describe('BrowserMatcher', function () {
  var BrowserMatcher;
  var matcher;

  describe('#constructor', function () {
    beforeEach(function () {
      BrowserMatcher = require('../lib/sauce_launcher/browser_matcher');
    });

    it('can be instantiated with `new`', function () {
      matcher = new BrowserMatcher();
      matcher.should.be.an.instanceof(BrowserMatcher);
    });
    it('can be instantiated without `new`', function () {
      matcher = BrowserMatcher();
      matcher.should.be.an.instanceof(BrowserMatcher);
    });
  });

  describe('#closest', function () {
    beforeEach(function () {
      BrowserMatcher = require('../lib/sauce_launcher/browser_matcher');
      matcher = new BrowserMatcher(BROWSERS);
    });

    it('finds an exact match based on `api_name`', function () {
      var match = matcher.closest('chrome');
      match
        .should.have.property('api_name')
        .and.equal('chrome');
    });
    it('finds an exact match based on `api_name` and `short_version`', function () {
      var match = matcher.closest('firefox-10');
      match
        .should.have.property('api_name')
        .and.equal('firefox');
      match
        .should.have.property('short_version')
        .and.equal('10');
    });
    it('finds an exact match based on `api_name` and `os`', function () {
      var match = matcher.closest('firefox-windows2003');
      match
        .should.have.property('api_name')
        .and.equal('firefox');
      match
        .should.have.property('os')
        .and.equal('Windows 2003');
    });
    it('finds an approximate match based on `api_name`, `short_version` and `os`', function () {
      var match = matcher.closest('internetexplorer-10-windows');
      match
        .should.have.property('api_name')
        .and.equal('internet explorer');
      match
        .should.have.property('short_version')
        .and.equal('10');
      match
        .should.have.property('os')
        .and.equal('Windows 2012');
    });
  });
});
