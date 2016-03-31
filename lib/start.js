'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _googleSpreadsheet = require('google-spreadsheet');

var _googleSpreadsheet2 = _interopRequireDefault(_googleSpreadsheet);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _process = process;
var stdout = _process.stdout;

var creds = require('../credentials.json');
var fs = _bluebird2.default.promisifyAll(_fsExtra2.default);
var languagePath = process.cwd() + '/lang';

var categories = ['category', 'sub-category', 'subcategory2'];

var languages = ['en_CA', 'fr_CA'];

var getInfo = function getInfo(doc) {
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

var getRows = function getRows(worksheet) {
  return new _bluebird2.default(function (resolve, reject) {
    worksheet.getRows({ limit: 999999 }, function (err, rows) {
      if (rows) {
        resolve(rows);
      } else {
        reject(err);
      }
    });
  });
};

var formatRow = function formatRow(row, index) {
  var formattedRow = {};

  if (!row.category || index === 0 || row.category === '#') {
    return null;
  }

  var rowIndex = row.category + '.' + row['sub-category'] + '.' + row.subcategory2;

  if (!row.subcategory2) {
    rowIndex = row.category + '.' + row['sub-category'];
  }

  if (!row['sub-category']) {
    rowIndex = row.category + '.' + row.subcategory2;
  }

  formattedRow[rowIndex] = {};
  languages.forEach(function (language) {
    formattedRow[rowIndex][language] = row[language.replace(/_/, '').toLowerCase()];
  });

  return formattedRow;
};

var getTranslations = function getTranslations(worksheet) {
  getRows(worksheet).then(function (rows) {
    var formattedRows = rows.map(formatRow).filter(function (row) {
      return row !== null;
    });
    var output = '<?php ';
    languages.forEach(function (language) {
      fs.ensureDirAsync(languagePath + '/' + language).then(function () {
        formattedRows.forEach(function (row, index) {
          if (index === 0) {
            output += '$lang = [';
          }

          var key = Object.keys(row)[0];
          var content = row[key][language].replace(/\"/g, '\\"').replace(/\'/g, "\\'");
          output += '\'' + key + '\' => \'' + content + '\'';
          if (index === formattedRows.length - 1) {
            output += ']; ?>';
          } else {
            output += ',';
          }
        });
        fs.writeFileAsync(languagePath + '/' + language + '/' + worksheet.title.toLowerCase() + '_lang.php', output, 'utf8');
        output = '<?php ';
      });
    });
  });
};

var listSheets = function listSheets(_ref) {
  var worksheets = _ref.worksheets;
  var title = _ref.title;

  stdout.write('Generating language file for ' + title + ' \n');
  worksheets.forEach(getTranslations);
};

var start = function start() {

  var docSync = new _googleSpreadsheet2.default('1YhuBJhnJ15Geyclh5fFFRGJNI9RGzhcxnBrnl_zLA64');
  var doc = _bluebird2.default.promisifyAll(docSync);

  fs.removeAsync(languagePath).then(function () {
    return fs.mkdirAsync(languagePath);
  }).then(function () {
    return doc.useServiceAccountAuthAsync(creds);
  }).then(function () {
    return getInfo(doc);
  }).then(listSheets);
};

exports.default = start;