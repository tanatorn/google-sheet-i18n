'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRows = exports.getInfo = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getInfo = exports.getInfo = function getInfo(doc) {
  return new _bluebird2.default(function (resolve, reject) {
    doc.getInfo(function (err, info) {
      if (info) {
        resolve(info);
      } else {
        reject(err);
      }
    });
  });
};

var getRows = exports.getRows = function getRows(worksheet) {
  return new _bluebird2.default(function (resolve, reject) {
    worksheet.getRows(function (err, rows) {
      if (rows) {
        resolve(rows);
      } else {
        reject(err);
      }
    });
  });
};