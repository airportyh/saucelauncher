describe('TempFile', function () {
  var TempFile;
  var tfile;

  describe('#constructor', function () {
    beforeEach(function () {
      TempFile = require('../lib/sauce_launcher/temp_file');
    });

    it('can be instantiated with `new`', function () {
      tfile = new TempFile();
      tfile.should.be.an.instanceof(TempFile);
    });
    it('can be instantiated without `new`', function () {
      tfile = TempFile();
      tfile.should.be.an.instanceof(TempFile);
    });
  });

  describe('with faked out dependencies', function () {
    var now;
    var clock;
    var dependencies;

    afterEach(function () {
      if (clock != null) {
        clock.restore();
      }
    });

    function prepare(funcs) {
      // Fake the clock.
      now = Date.now();
      clock = sinon.useFakeTimers(now);

      // Fake the fs module...
      dependencies = {
        fs: _.extend({
          realpathSync: sinon.spy(function () {
            return '/tmp';
          })
        }, funcs)
      };
      // ... and inject it into the context.
      TempFile = sandbox.require('../lib/sauce_launcher/temp_file', {
        requires: dependencies
      });
    }

    describe('#realpath', function () {
      beforeEach(function () {
        prepare();
      });

      describe('without the `name` option', function () {
        beforeEach(function () {
          tfile = new TempFile();
        });

        it('uses a UUID as name', function () {
          tfile.realpath().should.match(
            /^\/tmp\/........-....-4...-....-............$/
          );
        });
      });

      describe('with the `name` option', function () {
        beforeEach(function () {
          tfile = new TempFile({ name: 'foobar.json' });
        });

        it('uses the provided name', function () {
          tfile.realpath().should.equal('/tmp/foobar.json');
        });
      });
    });

    describe('#exists', function () {
      beforeEach(function () {
        prepare({
          existsSync: sinon.spy(function () {
            return true;
          })
        });
        tfile = new TempFile({ name: 'foobar.json' });
      });

      it('calls `existsSync` with the file path', function () {
        tfile.exists().should.be.true;
        dependencies.fs.existsSync.should.have.been.calledWithExactly(
          '/tmp/foobar.json'
        );
      });
    });

    describe('#expired', function () {
      beforeEach(function () {
        prepare({
          statSync: sinon.spy(function () {
            return { mtime: now };
          })
        });
      });

      describe('without the `ttl` option', function () {
        beforeEach(function () {
          tfile = new TempFile({ name: 'foobar.json' });
        });

        it('returns `false`', function () {
          tfile.expired().should.be.false;
          dependencies.fs.statSync.should.not.have.been.called;
        });
      });

      describe('with the `ttl` option', function () {
        beforeEach(function () {
          tfile = new TempFile({ name: 'foobar.json', ttl: 1000 });
        });

        it('returns `false` if not enough time has passed', function () {
          clock.tick(500);
          tfile.expired().should.be.false;
          dependencies.fs.statSync.should.have.been.called;
        });
        it('returns `true` if enough time has passed', function () {
          clock.tick(1500);
          tfile.expired().should.be.true;
          dependencies.fs.statSync.should.have.been.called;
        });
      });
    });

    describe('#read', function () {
      beforeEach(function () {
        prepare({
          readFileSync: sinon.spy(function () {
            return 'bazqux';
          })
        });
        tfile = new TempFile({ name: 'foobar.json' });
      });

      it('calls `readFileSync` with the file path and returns the data', function () {
        tfile.read().should.equal('bazqux');
        dependencies.fs.readFileSync.should.have.been.calledWithExactly(
          '/tmp/foobar.json'
        );
      });
    });

    describe('#write', function () {
      beforeEach(function () {
        prepare({
          writeFileSync: sinon.spy(function () {
          })
        });
        tfile = new TempFile({ name: 'foobar.json' });
      });

      it('calls `writeFileSync` with the file path and the data', function () {
        tfile.write('bazqux');
        dependencies.fs.writeFileSync.should.have.been.calledWithExactly(
          '/tmp/foobar.json',
          'bazqux'
        );
      });
    });
  });
});
