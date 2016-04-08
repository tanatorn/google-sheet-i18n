'use strict';

var fileMapper = function fileMapper(rows) {
  return JSON.stringify(rows.reduce(function (jsonObject, _ref) {
    var key = _ref.key;
    var data = _ref.data;

    var newRow = {};
    newRow[key] = data;
    return Object.assign(jsonObject, newRow);
  }, {}));
};

module.exports = {
  fileMapper: fileMapper,
  fileExtension: '.json'
};