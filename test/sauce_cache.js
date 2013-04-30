describe('SauceCache', function () {
  var SauceCache;
  var cache;

  describe('#constructor', function () {
    beforeEach(function () {
      SauceCache = require('../lib/sauce_launcher/sauce_cache');
    });

    it('can be instantiated with `new`', function () {
      cache = new SauceCache();
      cache.should.be.an.instanceof(SauceCache);
    });
    it('can be instantiated without `new`', function () {
      cache = SauceCache();
      cache.should.be.an.instanceof(SauceCache);
    });
  });

  describe('with faked out dependencies', function () {
    var tfile;
    var dependencies;

    function prepare(funcs) {
      // Fake the TempFile module...
      tfile = _.extend({
        realpath: function () {
          return '/tmp/foobar';
        }
      }, funcs);
      dependencies = {
        './temp_file': function () {
          return tfile;
        }
      };
      // ... and inject it into the context.
      SauceCache = sandbox.require('../lib/sauce_launcher/sauce_cache', {
        requires: dependencies
      });
    }

    describe('#load', function () {
      describe('when the temp file does not exist', function () {
        beforeEach(function () {
          prepare({
            exists: sinon.spy(function () {
              return false;
            }),
            write: sinon.spy()
          });
          cache = new SauceCache({ version: '0.0.0' });
        });

        it('calls the provider', function () {
          var providerSpy = sinon.spy();
          cache.load(providerSpy);
          providerSpy.should.have.been.called;
        });
      });

      describe('when the temp file is expired', function () {
        beforeEach(function () {
          prepare({
            exists: sinon.spy(function () {
              return true;
            }),
            expired: sinon.spy(function () {
              return true;
            }),
            write: sinon.spy()
          });
          cache = new SauceCache({ version: '0.0.0' });
        });

        it('calls the provider', function () {
          var providerSpy = sinon.spy();
          cache.load(providerSpy);
          providerSpy.should.have.been.called;
        });
      });

      describe('when the temp file is fresh but has a different version', function () {
        beforeEach(function () {
          prepare({
            exists: sinon.spy(function () {
              return true;
            }),
            expired: sinon.spy(function () {
              return false;
            }),
            read: sinon.spy(function () {
              return JSON.stringify({ version: '0.0.1', data: 'bazqux' });
            }),
            write: sinon.spy()
          });
          cache = new SauceCache({ version: '0.0.0' });
        });

        it('calls the provider', function () {
          var providerSpy = sinon.spy();
          cache.load(providerSpy);
          providerSpy.should.have.been.called;
        });
      });

      describe('when the temp file is fresh and has the same version', function () {
        beforeEach(function () {
          prepare({
            exists: sinon.spy(function () {
              return true;
            }),
            expired: sinon.spy(function () {
              return false;
            }),
            read: sinon.spy(function () {
              return JSON.stringify({ version: '0.0.0', data: 'bazqux' });
            }),
            write: sinon.spy()
          });
          cache = new SauceCache({ version: '0.0.0' });
        });

        it('does not call the provider', function () {
          var providerSpy = sinon.spy();
          var callback = function () {};
          cache.load(providerSpy, callback);
          providerSpy.should.not.have.been.called;
        });
        it('notifies the callback', function () {
          var callbackSpy = sinon.spy();
          cache.load(null, callbackSpy);
          callbackSpy.should.have.been.calledWithExactly(
            null,
            'bazqux'
          );
        });
      });

      describe('if the provider fails', function () {
        beforeEach(function () {
          prepare({
            exists: sinon.spy(function () {
              return false;
            }),
            write: sinon.spy()
          });
          cache = new SauceCache({ version: '0.0.0' });
        });

        it('notifies the callback', function () {
          var provider = function (callback) {
            callback('error');
          };
          var callbackSpy = sinon.spy();
          cache.load(provider, callbackSpy);
          callbackSpy.should.have.been.calledWithExactly(
            'error'
          );
        });
      });

      describe('if the provider succeeds', function () {
        beforeEach(function () {
          prepare({
            exists: sinon.spy(function () {
              return false;
            }),
            write: sinon.spy()
          });
          cache = new SauceCache({ version: '0.0.0' });
        });

        it('writes the temp file', function () {
          var provider = function (callback) {
            callback(null, 'bazqux');
          };
          var callback = function () {};
          cache.load(provider, callback);
          tfile.write.should.have.been.calledWithMatch(
            JSON.stringify({ version: '0.0.0', data: 'bazqux' })
          );
        });
        it('notifies the callback', function () {
          var provider = function (callback) {
            callback(null, 'bazqux');
          };
          var callbackSpy = sinon.spy();
          cache.load(provider, callbackSpy);
          callbackSpy.should.have.been.calledWithExactly(
            null,
            'bazqux'
          );
        });
      });
    });
  });
});
