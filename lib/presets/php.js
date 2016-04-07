'use strict';

var escapeQuotes = function escapeQuotes(contents) {
  return contents.replace(/\'/g, "\\'");
};

var fileMapper = function fileMapper(rows) {
  var outputObject = rows.reduce(function (outputSoFar, row) {
    var property = {};
    property[row.key] = row.data;
    return Object.assign(outputSoFar, property);
  }, {});

  return Object.keys(outputObject).reduce(function (outputSoFar, key, index, keys) {
    var content = escapeQuotes(outputObject[key]);
    var rowContent = '  \'' + key + '\' => \'' + content + '\'';

    if (index === keys.length - 1) {
      rowContent += ']; \n ?>';
    } else {
      rowContent += ',\n';
    }

    if (index === 0) {
      return outputSoFar + '$lang = [ \n' + rowContent;
    }

    return outputSoFar + rowContent;
  }, '<?php \n' + '\n/**\n *  This file was generated using google-sheet-i18n with the PHP preset\n *  ¯\\_(ツ)_/¯\n */\n');
};

module.exports = {
  fileMapper: fileMapper,
  fileExtension: '.php'
};