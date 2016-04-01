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

var fs = _bluebird2.default.promisifyAll(_fsExtra2.default);
var config = void 0;

try {
  config = require(_path2.default.join(process.cwd(), 'i18n.config'));
} catch (err) {
  config = null;
}

var _config = config;
var sheetId = _config.sheetId;
var suffix = _config.suffix;
var outPath = _config.outPath;
var credentialsPath = _config.credentialsPath;
var categories = _config.categories;
var languages = _config.languages;
var preset = _config.preset;
var _config2 = config;
var extension = _config2.extension;
var mapper = _config2.mapper;


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
    worksheet.getRows(function (err, rows) {
      if (rows) {
        resolve(rows);
      } else {
        reject(err);
      }
    });
  });
};

var formatRow = function formatRow(row) {
  var formattedRow = {};
  var rowIndex = categories.reduce(function (previous, current, index, array) {
    if (row[array[0]] === null || row[array[0]] === '#') {
      return null;
    }

    if (!row[current]) {
      return previous;
    }

    return previous + '.' + row[current];
  }, '');

  if (rowIndex !== null) {
    rowIndex = rowIndex.substr(1);
    formattedRow[rowIndex] = {};
    languages.forEach(function (language) {
      formattedRow[rowIndex][language] = row[language.replace(/_/, '').toLowerCase()];
    });
  }

  return rowIndex ? formattedRow : null;
};

var getTranslations = function getTranslations(worksheet) {
  getRows(worksheet).then(function (rows) {
    var formattedRows = rows.map(formatRow).filter(function (row) {
      return row !== null;
    });
    languages.forEach(function (language) {
      return fs.ensureDirAsync(outPath + '/' + language).then(function () {

        if (preset) {
          var _require = require(_path2.default.join(__dirname, '../', 'lib/presets', preset));

          var fileMapper = _require.fileMapper;
          var fileExtension = _require.fileExtension;

          extension = fileExtension;
          mapper = fileMapper;
        }
        var output = mapper(formattedRows, language);
        var writePath = outPath + '/' + language + '/' + (worksheet.title.toLowerCase() + (suffix || '') + extension);

        return fs.writeFileAsync(writePath, output, 'utf8');
      });
    });
  });
};

var generateTranslations = function generateTranslations(_ref) {
  var worksheets = _ref.worksheets;
  var title = _ref.title;

  stdout.write('Generating language file for ' + title + ' \n');
  worksheets.forEach(getTranslations);
};

var start = function start() {
  if (config) {
    (function () {
      var docSync = new _googleSpreadsheet2.default(sheetId);
      var doc = _bluebird2.default.promisifyAll(docSync);

      var creds = require(credentialsPath);

      fs.removeAsync(outPath).then(function () {
        return fs.ensureDirAsync(outPath);
      }).then(function () {
        return doc.useServiceAccountAuthAsync(creds);
      }).then(function () {
        return getInfo(doc);
      }).then(generateTranslations);
    })();
  }
};

exports.default = start;