
/**
 *  Formats rows into key : { language: translation }
 *  ie. {
 *  	common.greeting: {
 *  		en_CA: 'Hello!',
 *  		fr_CA: 'Bonjour!'
 *  	}
 *  }
 */

export const formatRow = (row, categories, languages, delimiter) => {
  const formattedRow = {}
  let rowIndex = categories.reduce((previous, current, index, array) => {
    if (row[array[0]] === null || row[array[0]] === '#') {
      return null
    }

    if (!row[current]) {
      return previous
    }

    return previous + delimiter + row[current]
  }, '')

  if (rowIndex !== null) {
    rowIndex = rowIndex.substr(1)
    formattedRow[rowIndex] = {}
    languages.forEach((language) => {
      formattedRow[rowIndex][language] = row[language.replace(/_/, '').toLowerCase()]
    })
  }

  return rowIndex ? formattedRow : null
}
