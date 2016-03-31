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

const { sheetId, suffix, outPath, fileMapper, credentialsPath, categories, languages } = config


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

  if (!row.category || row.category === '#') {
    return null
  }

  let rowIndex = `${row.category}.${row[categories[1]]}.${row[categories[2]]}`

  if (!row[categories[2]]) {
    rowIndex = `${row.category}.${row[categories[1]]}`
  }

  if (!row[categories[1]]) {
    rowIndex = `${row.category}.${row[categories[2]]}`
  }

  formattedRow[rowIndex] = {}
  languages.forEach((language) => {
    formattedRow[rowIndex][language] = row[language.replace(/_/, '').toLowerCase()]
  })

  return formattedRow
}

const getTranslations = (worksheet) => {
  getRows(worksheet)
    .then(rows => {
      const formattedRows = rows.map(formatRow).filter(row => row !== null)
      languages.forEach(language => {
        fs.ensureDirAsync(`${outPath}/${language}`)
          .then(() => {
            const output = fileMapper(formattedRows, language)
            fs.writeFileAsync(`${outPath}/${language}/${worksheet.title.toLowerCase() + suffix}`,
              output, 'utf8')
          })

      })
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
      .then(() => fs.mkdirAsync(outPath))
      .then(() => doc.useServiceAccountAuthAsync(creds))
      .then(() => getInfo(doc))
      .then(generateTranslations)
  }
}


export default start
