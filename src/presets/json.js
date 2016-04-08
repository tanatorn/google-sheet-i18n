const fileMapper = (rows) => (
  JSON.stringify(rows.reduce((jsonObject, { key, data }) => {
    const newRow = {}
    newRow[key] = data
    return Object.assign(jsonObject, newRow)
  }, {}))
)

module.exports = {
  fileMapper,
  fileExtension: '.json',
}
