#!/usr/bin/env node

var cmd  = require('commander');
var fs   = require('fs');
var path = require('path');
var log  = require('winston');
var sl   = require('..');

var _              = sl.util;
var BrowserMatcher = sl.BrowserMatcher;
var SauceCache     = sl.SauceCache;
var SauceClient    = sl.SauceClient;
var SauceConfig    = sl.SauceConfig;
var SauceConnect   = sl.SauceConnect;
var SauceDriver    = sl.SauceDriver;

var PACKAGE_FILE = path.join(__dirname, '../package.json');

var package = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf8'));
var name    = package.name;
var version = package.version;

var config;
var action;
var args;

// Program /////////////////////////////////////////////////////////////////////////////////////////

cmd.name = name;

cmd
  .version(version)
  .option('-u, --user <user>', 'username for Sauce Labs')
  .option('-k, --key <key>',   'access key for Sauce Labs')
  .option('-d, --debug',       'enable verbose debugging', false);

cmd
  .command('launch <browser> <url>')
  .description('Launch a remote browser (e.g. launch ipad-6-mac10.8 http://www.google.com)')
  .action(setAction(launchAction));

cmd
  .command('browsers')
  .description('List all browsers currently supported on Sauce Labs')
  .action(setAction(browsersAction));

cmd
  .command('jobs')
  .description('List last 100 jobs belonging to the specified user')
  .action(setAction(jobsAction));

cmd
  .command('tunnels')
  .description('List all running tunnels belonging to the specified user')
  .action(setAction(tunnelsAction));

cmd
  .command('create-tunnel')
  .description('Create a secure tunnel using Sauce Connect')
  .action(setAction(createTunnelAction));

cmd
  .command('*')
  .action(setAction(unknownAction));

// Setup ///////////////////////////////////////////////////////////////////////////////////////////

cmd.parse(process.argv);

// Show help and exit if no arguments were passed.
if (_.isEmpty(cmd.args)) {
  cmd.help();
}

// Lower logging level if debug flag was passed.
enableLogger(cmd.debug ? 'verbose' : 'error');

// Read config parameters and run the specified action.
config = new SauceConfig({ username: cmd.user, apiKey: cmd.key }).config();
runAction();

// Actions /////////////////////////////////////////////////////////////////////////////////////////

function launchAction(browser, url) {
  var cache = new SauceCache({ version: version });
  cache.load(
    function (callback) {
      var client = new SauceClient(config);
      client.browsers(function (err, browsers) {
        exitIfError(err && err.error);
        callback(null, browsers);
      });
    },
    function (err, browsers) {
      var matcher = new BrowserMatcher(browsers);
      var match   = matcher.closest(browser);
      var driver;

      _.extend(config, {
        browserName: match['api_name'],
        version:     match['short_version'],
        platform:    match['os'],
        url:         url
      });

      _.verbose('Launching %s %s (%s)', match['long_name'], match['long_version'], match['os']);
      driver = new SauceDriver(config);
      driver.run(function () {
        setInterval(function () {}, 1000);
      });
    }
  );
}

function browsersAction() {
  _.verbose('Requesting list of browsers');
  var client = new SauceClient(config);
  client.browsers(function (err, data) {
    exitIfError(err && err.error);
    console.log(data);
  });
}

function jobsAction() {
  _.verbose('Requesting list of jobs');
  var client = new SauceClient(config);
  client.jobs(function (err, data) {
    exitIfError(err && err.error);
    console.log(data);
  });
}

function tunnelsAction() {
  _.verbose('Requesting list of tunnels');
  var client = new SauceClient(config);
  client.tunnels(function (err, data) {
    exitIfError(err && err.error);
    console.log(data);
  });
}

function createTunnelAction() {
  _.verbose('Creating tunnel');
  var tunnel = new SauceConnect(config).tunnel();
  tunnel.stdout.on('data', function (data) {
    process.stdout.write(data);
  });
  tunnel.stderr.on('data', function (data) {
    process.stderr.write(data);
  });

  cleanup(function () {
    _.verbose('Killing tunnel process');
    tunnel.kill();
  });
}

function unknownAction(unknown) {
  console.error('Unknown command `' + unknown + '`.');
  exit();
}

// Helpers /////////////////////////////////////////////////////////////////////////////////////////

function enableLogger(level) {
  log.remove(log.transports.Console);
  log.add(log.transports.Console, {
    level:     level,
    colorize:  true,
    timestamp: true
  });
}

function setAction(act) {
  return function () {
    action = act;
    args = arguments;
  };
}

function runAction() {
  action.apply(null, args);
}

// Termination /////////////////////////////////////////////////////////////////////////////////////

function cleanup(func) {
  process.on('cleanup', func);
}

function exitIfError(err) {
  if (err) {
    _.error(err);
    exit();
  }
}

function exit() {
  if (!_.isEmpty(process.listeners('cleanup'))) {
    // The first time you press C-c, the program will try to clean up.
    _.verbose('Cleaning up');
    process.emit('cleanup');
    process.removeAllListeners('cleanup');
  } else {
    // The second time you press C-c, there will be no listeners and the program
    // will exit.
    _.verbose('Exiting');
    process.exit(1);
  }

}

process.on('SIGTERM', exit);
process.on('SIGINT',  exit);
process.on('SIGQUIT', exit);
process.on('SIGHUP',  exit);
