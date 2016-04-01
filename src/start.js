import GoogleSpreadsheet from 'google-spreadsheet'
import Promise from 'bluebird'
import fse from 'fs-extra'
import path from 'path'

const { stdout } = process
const fs = Promise.promisifyAll(fse)
let config

try {
  config = require(path.join(process.cwd(), 'i18n.config'))
} catch (err) {
  config = null
}

const { sheetId,
   suffix,
   outPath,
   credentialsPath,
   categories,
   languages,
   preset } = config

let { extension,
  mapper } = config


const getInfo = (doc) => new Promise((resolve, reject) => {
  doc.getInfo((err, info) => {
    if (info) {
      resolve(info)
    } else {
      reject(err)
    }
  })
})

const getRows = (worksheet) => new Promise((resolve, reject) => {
  worksheet.getRows((err, rows) => {
    if (rows) {
      resolve(rows)
    } else {
      reject(err)
    }
  })
})

const formatRow = (row) => {
  const formattedRow = {}
  let rowIndex = categories.reduce((previous, current, index, array) => {
    if (row[array[0]] === null || row[array[0]] === '#') {
      return null
    }

    if (!row[current]) {
      return previous
    }

    return `${previous}.${row[current]}`
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

const getTranslations = (worksheet) => {
  getRows(worksheet)
    .then(rows => {
      const formattedRows = rows.map(formatRow).filter(row => row !== null)
      languages.forEach(language => (
        fs.ensureDirAsync(`${outPath}/${language}`)
          .then(() => {

            if (preset) {
              const { fileMapper, fileExtension } = require(path.join(__dirname, '../',
               'lib/presets', preset))
              extension = fileExtension
              mapper = fileMapper
            }
            const output = mapper(formattedRows, language)
            const writePath =
              `${outPath}/${language}/${worksheet.title.toLowerCase() + (suffix || '') + extension}`

            return fs.writeFileAsync(writePath, output, 'utf8')
          })

      ))
    })

}

const generateTranslations = ({ worksheets, title }) => {
  stdout.write(`Generating language file for ${title} \n`)
  worksheets.forEach(getTranslations)
}


const start = () => {
  if (config) {
    const docSync = new GoogleSpreadsheet(sheetId)
    const doc = Promise.promisifyAll(docSync)

    const creds = require(credentialsPath)

    fs.removeAsync(outPath)
      .then(() => fs.ensureDirAsync(outPath))
      .then(() => doc.useServiceAccountAuthAsync(creds))
      .then(() => getInfo(doc))
      .then(generateTranslations)
  }
}


export default start
