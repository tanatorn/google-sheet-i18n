'use strict';

var escapeQuotes = function escapeQuotes(contents) {
  return contents.replace(/\"/g, '\\"');
};

var fileMapper = function fileMapper(rows, language) {
  var output = '\n/**\n *  This file was generated using google-sheet-i18n with the JSON preset\n *  ¯_(ツ)_/¯\n */\n';
  rows.forEach(function (row, index) {
    if (index === 0) {
      output += '{ \n';
    }

    var key = Object.keys(row)[0];
    var content = escapeQuotes(row[key][language]);
    output += '  "' + key + '": "' + content + '"';
    if (index === rows.length - 1) {
      output += '}';
    } else {
      output += ',\n';
    }
  });
  return output;
};

module.exports = {
  fileMapper: fileMapper,
  fileExtension: '.json'
};