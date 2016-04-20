'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sheets;

var _process = require('process');

var _configHelper = require('./config-helper');

var _sheetsHelper = require('./sheets-helper');

function printSheetsInfo(_ref) {
  var worksheets = _ref.worksheets;

  var sheetsArray = worksheets.map(function (_ref2) {
    var title = _ref2.title;
    return title;
  });
  _process.stdout.write(sheetsArray.join('\n'));
}

function sheets() {
  var config = (0, _configHelper.getConfig)();
  var doc = (0, _configHelper.getDocument)(config);

  (0, _configHelper.authorizeConnection)(config, doc).then(function () {
    return (0, _sheetsHelper.getInfo)(doc);
  }).then(printSheetsInfo);
}