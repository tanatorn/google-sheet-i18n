const escapeQuotes = (contents) => (
  contents
    .replace(/\"/g, '\\"')
)

const fileMapper = (rows) => {
  const output = rows.reduce((outputSoFar, { key, data }, index) => {

    const content = escapeQuotes(data)
    let rowContent = `  \"${key}\": \"${content}\"`
    if (index === rows.length - 1) {
      rowContent += '}'
    } else {
      rowContent += ',\n'
    }

    return outputSoFar + rowContent
  }, '{ \n')
  return output
}

module.exports = {
  fileMapper,
  fileExtension: '.json',
}
