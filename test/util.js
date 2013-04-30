describe('util', function () {
  var util;

  beforeEach(function () {
    util = require('../lib/sauce_launcher/util');
  });

  describe('#chomp', function () {
    var chomp;

    beforeEach(function () {
      chomp = util.chomp;
    });

    it('leaves `hello` as-is', function () {
      chomp('hello').should.equal('hello');
    });
    it('turns `hello\\r` into `hello`', function () {
      chomp('hello\r').should.equal('hello');
    });
    it('turns `hello\\n` into `hello`', function () {
      chomp('hello\n').should.equal('hello');
    });
    it('turns `hello\\r\\n` into `hello`', function () {
      chomp('hello\r\n').should.equal('hello');
    });
    it('turns `hello\\n\\r` into `hello\\n`', function () {
      chomp('hello\n\r').should.equal('hello\n');
    });
    it('leaves `hello \\n there` as-is', function () {
      chomp('hello \n there').should.equal('hello \n there');
    });
  });

  describe('#camelize', function () {
    var camelize;

    beforeEach(function () {
      camelize = util.camelize;
    });

    it('leaves `hello` as-is', function () {
      camelize('hello').should.equal('hello');
    });
    it('turns `hello_world` into `helloWorld`', function () {
      camelize('hello_world').should.equal('helloWorld');
    });
    it('leaves `helloWorld` as-is', function () {
      camelize('helloWorld').should.equal('helloWorld');
    });
  });

  describe('#snakeize', function () {
    var snakeize;

    beforeEach(function () {
      snakeize = util.snakeize;
    });

    it('leaves `hello` as-is', function () {
      snakeize('hello').should.equal('hello');
    });
    it('turns `helloWorld` into `hello_world`', function () {
      snakeize('helloWorld').should.equal('hello_world');
    });
    it('leaves `hello_world` as-is', function () {
      snakeize('hello_world').should.equal('hello_world');
    });
  });

  describe('#levenshtein', function () {
    var lev;

    beforeEach(function () {
      lev = util.levenshtein;
    });

    it('returns 0 if both strings are null', function () {
      lev(null, null).should.equal(0);
    });
    it('returns 0 if both strings are empty', function () {
      lev('', '').should.equal(0);
    });
    it('returns 0 if both strings are equal', function () {
      lev('foo', 'foo').should.equal(0);
    });
    it('returns the length of the first string if the second one is null', function () {
      lev('foo', null).should.equal(3);
    });
    it('returns the length of the first string if the second one is empty', function () {
      lev('foo', '').should.equal(3);
    });
    it('returns the length of the second string if the first one is null', function () {
      lev(null, 'foo').should.equal(3);
    });
    it('returns the length of the second string if the first one is empty', function () {
      lev('', 'foo').should.equal(3);
    });
    it('returns 1 if both strings are one insertion away', function () {
      lev('foo', 'oo').should.equal(1);
    });
    it('returns 1 if both strings are one deletion away', function () {
      lev('oo', 'foo').should.equal(1);
    });
    it('returns 1 if both strings are one substitution away', function () {
      lev('foo', 'moo').should.equal(1);
    });
    it('returns the total number of edits to go from the first string to the second one', function () {
      lev('foobar', 'bazqux').should.equal(6);
    });
  });

  describe('#uuid', function () {
    var uuid;

    beforeEach(function () {
      uuid = util.uuid;
    });

    it('returns a v4 UUID', function () {
      uuid().should.match(
        /^........-....-4...-....-............$/
      );
    });
    it('returns different UUIDs in subsequent calls', function () {
      uuid().should.not.equal(uuid());
    });
  });
});
