const escapeQuotes = (contents) => (
  contents
    .replace(/\'/g, "\\'")
)

const fileMapper = (rows) => {
  let output = '<?php \n' + `
/**
 *  This file was generated using google-sheet-i18n with the PHP preset
 *  ¯\\_(ツ)_/¯
 */
`
  output += rows.reduce((outputSoFar, { key, data }, index) => {
    if (index === 0) outputSoFar += '$lang = [ \n'
    const content = escapeQuotes(data)
    let rowContent = `  \'${key}\' => \'${content}\'`
    if (index === rows.length - 1) {
      rowContent += ']; \n ?>'
    } else {
      rowContent += ',\n'
    }
    return outputSoFar + rowContent
  }, '')
  return output
}

module.exports = {
  fileMapper,
  fileExtension: '.php',
}
