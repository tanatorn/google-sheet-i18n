const escapeQuotes = (contents) => (
  contents
    .replace(/\"/g, '\\"')
)

const fileMapper = (rows, language) => {
  let output = `
/**
 *  This file was generated using google-sheet-i18n with the JSON preset
 *  ¯\_(ツ)_/¯
 */
`
  rows.forEach((row, index) => {
    if (index === 0) {
      output += '{ \n'
    }

    const key = Object.keys(row)[0]
    const content = escapeQuotes(row[key][language])
    output += `  \"${key}\": \"${content}\"`
    if (index === rows.length - 1) {
      output += '}'
    } else {
      output += ',\n'
    }
  })
  return output
}

module.exports = {
  fileMapper,
  fileExtension: '.json',
}
