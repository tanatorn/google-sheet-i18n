const escapeQuotes = (contents) => (
  contents
    .replace(/\'/g, "\\'")
)

const fileMapper = (rows) => {
  const outputObject = rows.reduce((outputSoFar, row) => {
    const property = {}
    property[row.key] = row.data
    return Object.assign(outputSoFar, property)
  }, {})

  return Object.keys(outputObject).reduce((outputSoFar, key, index, keys) => {
    const content = escapeQuotes(outputObject[key])
    let rowContent = `  \'${key}\' => \'${content}\'`

    if (index === keys.length - 1) {
      rowContent += ']; \n ?>'
    } else {
      rowContent += ',\n'
    }

    if (index === 0) {
      return `${outputSoFar}$lang = [ \n${rowContent}`
    }

    return outputSoFar + rowContent
  }, '<?php \n' + `
/**
 *  This file was generated using google-sheet-i18n with the PHP preset
 *  ¯\\_(ツ)_/¯
 */
`)
}

module.exports = {
  fileMapper,
  fileExtension: '.php',
}
