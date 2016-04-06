'use strict';

var escapeQuotes = function escapeQuotes(contents) {
  return contents.replace(/\'/g, "\\'");
};

var fileMapper = function fileMapper(rows) {
  var output = '<?php \n' + '\n/**\n *  This file was generated using google-sheet-i18n with the PHP preset\n *  ¯\\_(ツ)_/¯\n */\n';
  output += rows.reduce(function (outputSoFar, _ref, index) {
    var key = _ref.key;
    var data = _ref.data;

    if (index === 0) outputSoFar += '$lang = [ \n';
    var content = escapeQuotes(data);
    var rowContent = '  \'' + key + '\' => \'' + content + '\'';
    if (index === rows.length - 1) {
      rowContent += ']; \n ?>';
    } else {
      rowContent += ',\n';
    }
    return outputSoFar + rowContent;
  }, '');
  return output;
};

module.exports = {
  fileMapper: fileMapper,
  fileExtension: '.php'
};