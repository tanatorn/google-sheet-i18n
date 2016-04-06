'use strict';

var escapeQuotes = function escapeQuotes(contents) {
  return contents.replace(/\"/g, '\\"');
};

var fileMapper = function fileMapper(rows) {
  var output = rows.reduce(function (outputSoFar, _ref, index) {
    var key = _ref.key;
    var data = _ref.data;


    var content = escapeQuotes(data);
    var rowContent = '  "' + key + '": "' + content + '"';
    if (index === rows.length - 1) {
      rowContent += '}';
    } else {
      rowContent += ',\n';
    }

    return outputSoFar + rowContent;
  }, '{ \n');
  return output;
};

module.exports = {
  fileMapper: fileMapper,
  fileExtension: '.json'
};