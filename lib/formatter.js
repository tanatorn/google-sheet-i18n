'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 *  Formats rows into key : { language: translation }
 *  ie. {
 *  	common.greeting: {
 *  		en_CA: 'Hello!',
 *  		fr_CA: 'Bonjour!'
 *  	}
 *  }
 */

var formatRow = exports.formatRow = function formatRow(row, categories, languages, delimiter) {
  var formattedRow = {};
  var rowIndex = categories.reduce(function (previous, current, index, array) {
    if (row[array[0]] === null || row[array[0]] === '#') {
      return null;
    }

    if (!row[current]) {
      return previous;
    }

    return previous + delimiter + row[current];
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