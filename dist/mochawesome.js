'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Done function gets called before mocha exits
 *
 * @param {Object} output
 * @param {Object} config
 * @param {Function} exit
 */

var done = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(output, config, failures, exit) {
    var reportJsonFile, reportHtmlFile;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reportJsonFile = config.reportJsonFile, reportHtmlFile = config.reportHtmlFile;
            _context.prev = 1;

            if (!config.writeReporte) {
              _context.next = 9;
              break;
            }

            _context.next = 5;
            return saveFile(reportJsonFile, output);

          case 5:
            log('Report JSON saved to ' + reportJsonFile, null, config);

            // Create and save the HTML to disk
            _context.next = 8;
            return marge.create(output, config);

          case 8:
            log('Report HTML saved to ' + reportHtmlFile, null, config);

          case 9:
            exit(failures);
            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](1);

            log(_context.t0, 'error', config);
            exit(failures);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 12]]);
  }));

  return function done(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

var login = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(opciones) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("Desde login");
            _context2.prev = 1;
            _context2.next = 4;
            return logger(opciones);

          case 4:
            _context2.next = 9;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2['catch'](1);

            log("error");

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 6]]);
  }));

  return function login(_x5) {
    return _ref2.apply(this, arguments);
  };
}();

var asyncFun = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(opciones) {
    var request;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("dentro de await");
            request = require('request-promise');
            return _context3.abrupt('return', request.post({
              url: opciones.bunyanSlackHook,
              body: (0, _stringify2.default)({ "channel": "#canalqa", "username": "@iortega", "text": "[INFO] Pruebas" })
            }).then(function (body) {
              console.log(body);
              return _promise2.default.resolve();
            }));

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function asyncFun(_x6) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Initialize a new reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mocha = require('mocha');
var uuid = require('uuid');
var stringify = require('json-stringify-safe');
var conf = require('./config');
var marge = require('mochawesome-report-generator');
var utils = require('./utils');

// Import the utility functions
var log = utils.log,
    getPercentClass = utils.getPercentClass,
    cleanTest = utils.cleanTest,
    traverseSuites = utils.traverseSuites,
    saveFile = utils.saveFile;

// Track the total number of tests registered

var totalTestsRegistered = { total: 0 };function Mochawesome(runner, options) {
  var _this = this;

  var logToSlack = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(delay) {
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              console.log('async working!');

            case 1:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function logToSlack(_x7) {
      return _ref4.apply(this, arguments);
    };
  }();
  // Add a unique identifier to each test


  // Done function will be called before mocha exits
  // This is where we will save JSON and generate the report
  this.done = function (failures, exit) {
    return done(_this.output, _this.config, failures, exit);
  };

  // Reset total tests counter
  totalTestsRegistered.total = 0;

  // Create/Save necessary report dirs/files
  var reporterOpts = options && options.reporterOptions || {};
  this.config = conf(reporterOpts);

  // Call the Base mocha reporter
  mocha.reporters.Base.call(this, runner);
  var bunyan = require("bunyan"),
      BunyanSlack = require('bunyan-slack'),
      request = require('request'),
      loggers;

  var opciones = conf(reporterOpts);
  loggers = bunyan.createLogger({
    name: opciones.bunyanSlackName,
    streams: [{
      stream: new BunyanSlack({
        webhook_url: opciones.bunyanSlackHook,
        channel: opciones.bunyanSlackChannel,
        username: opciones.bunyanSlackUsername
      })
    }]
  });

  // Show the Spec Reporter in the console
  new mocha.reporters.Spec(runner); // eslint-disable-line

  var allTests = [];
  var allPending = [];
  var allFailures = [];
  var allPasses = [];
  var endCalled = false;

  // Add a unique identifier to each test
  runner.on('test', function (test) {
    return test.uuid = uuid.v4();
  });

  // Add test to array of all tests
  runner.on('test end', function (test) {
    return allTests.push(test);
  });

  runner.on('test end', function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(test) {
      var request, p;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              request = require('request-promise');

              console.log('test started');
              p = request.post({
                url: opciones.bunyanSlackHook,
                body: (0, _stringify2.default)({ "channel": "#canalqa", "username": "@iortega", "text": "[INFO] Pruebas" })
              });
              _context5.next = 5;
              return p;

            case 5:

              console.log('test finished');

            case 6:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x8) {
      return _ref5.apply(this, arguments);
    };
  }());
  // Add pending test to array of pending tests
  runner.on('pending', function (test) {
    test.uuid = uuid.v4();
    allPending.push(test);
  });

  // Add passing test to array of passing tests
  runner.on('pass', function (test) {
    return allPasses.push(test);
  });

  // Add failed test to array of failed tests
  runner.on('fail', function (test) {
    return allFailures.push(test);
  });

  // Process the full suite
  runner.on('end', function () {
    try {
      /* istanbul ignore else */
      if (!endCalled) {
        // end gets called more than once for some reason
        // so we ensure the suite is processed only once
        endCalled = true;

        var allSuites = _this.runner.suite;

        traverseSuites(allSuites, totalTestsRegistered);

        var obj = {
          stats: _this.stats,
          suites: allSuites,
          allTests: allTests.map(cleanTest),
          allPending: allPending.map(cleanTest),
          allPasses: allPasses.map(cleanTest),
          allFailures: allFailures.map(cleanTest),
          copyrightYear: new Date().getFullYear()
        };

        obj.stats.testsRegistered = totalTestsRegistered.total;

        var _obj$stats = obj.stats,
            passes = _obj$stats.passes,
            failures = _obj$stats.failures,
            pending = _obj$stats.pending,
            tests = _obj$stats.tests,
            testsRegistered = _obj$stats.testsRegistered;

        var passPercentage = Math.round(passes / (testsRegistered - pending) * 1000) / 10;
        var pendingPercentage = Math.round(pending / testsRegistered * 1000) / 10;

        obj.stats.passPercent = passPercentage;
        obj.stats.pendingPercent = pendingPercentage;
        obj.stats.other = passes + failures + pending - tests;
        obj.stats.hasOther = obj.stats.other > 0;
        obj.stats.skipped = testsRegistered - tests;
        obj.stats.hasSkipped = obj.stats.skipped > 0;
        obj.stats.failures -= obj.stats.other;
        obj.stats.passPercentClass = getPercentClass(passPercentage);
        obj.stats.pendingPercentClass = getPercentClass(pendingPercentage);

        // Save the final output to be used in the done function
        _this.output = stringify(obj, null, 2);
      }
    } catch (e) {
      // required because thrown errors are not handled directly in the
      // event emitter pattern and mocha does not have an "on error"
      /* istanbul ignore next */
      log('Problem with mochawesome: ' + e.stack, 'error');
    }
  });
}

module.exports = Mochawesome;
