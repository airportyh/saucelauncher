var events   = require('events');
var inherits = require('util').inherits;

function FakeProc() {
  if (this instanceof FakeProc) {
    this.stdout = new events.EventEmitter();
    this.stdout = new events.EventEmitter();
    this.stderr = new events.EventEmitter();
  } else {
    return new FakeProc();
  }
}

inherits(FakeProc, events.EventEmitter);

module.exports = function (chai, utils) {
  chai.FakeProc = FakeProc;
};
