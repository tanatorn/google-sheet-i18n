'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = getConfig;
exports.getDocument = getDocument;
exports.authorizeConnection = authorizeConnection;

var _googleSpreadsheet = require('google-spreadsheet');

var _googleSpreadsheet2 = _interopRequireDefault(_googleSpreadsheet);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _process = require('process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfig() {
  try {
    return require(_path2.default.join((0, _process.cwd)(), 'i18n.config'));
  } catch (err) {
    return null;
  }
}

function getDocument(_ref) {
  var sheetId = _ref.sheetId;

  return _bluebird2.default.promisifyAll(new _googleSpreadsheet2.default(sheetId));
}

function authorizeConnection(_ref2, doc) {
  var credentialsPath = _ref2.credentialsPath;

  var creds = require(credentialsPath);
  return doc.useServiceAccountAuthAsync(creds);
}