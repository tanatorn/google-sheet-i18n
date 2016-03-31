import GoogleSpreadsheet from 'google-spreadsheet'
import Promise from 'bluebird'
import fse from 'fs-extra'
import path from 'path'

const { stdout } = process
const creds = require('../credentials.json')
const fs = Promise.promisifyAll(fse)
const languagePath = `${process.cwd()}/lang`

const categories = ['category', 'sub-category', 'subcategory2']

const languages = ['en_CA', 'fr_CA']

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
  worksheet.getRows({ limit: 999999 }, (err, rows) => {
    if (rows) {
      resolve(rows)
    } else {
      reject(err)
    }
  })
})

const formatRow = (row, index) => {
  const formattedRow = {}

  if (!row.category || index === 0 || row.category === '#') {
    return null
  }

  let rowIndex = `${row.category}.${row['sub-category']}.${row.subcategory2}`

  if (!row.subcategory2) {
    rowIndex = `${row.category}.${row['sub-category']}`
  }

  if (!row['sub-category']) {
    rowIndex = `${row.category}.${row.subcategory2}`
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
      let output = '<?php '
      languages.forEach(language => {
        fs.ensureDirAsync(`${languagePath}/${language}`)
          .then(() => {
            formattedRows.forEach((row, index) => {
              if (index === 0) {
                output += '$lang = ['
              }

              const key = Object.keys(row)[0]
              const content = row[key][language].replace(/\"/g, '\\"').replace(/\'/g, "\\'")
              output += `\'${key}\' => \'${content}\'`
              if (index === formattedRows.length - 1) {
                output += ']; ?>'
              } else {
                output += ','
              }
            })
            fs.writeFileAsync(`${languagePath}/${language}/${worksheet.title.toLowerCase()}_lang.php`
                , output, 'utf8')
            output = '<?php '
          })

      })
    })

}

const listSheets = ({ worksheets, title }) => {
  stdout.write(`Generating language file for ${title} \n`)
  worksheets.forEach(getTranslations)
}


const start = () => {

  const docSync = new GoogleSpreadsheet('1YhuBJhnJ15Geyclh5fFFRGJNI9RGzhcxnBrnl_zLA64')
  const doc = Promise.promisifyAll(docSync)

  fs.removeAsync(languagePath)
    .then(() => fs.mkdirAsync(languagePath))
    .then(() => doc.useServiceAccountAuthAsync(creds))
    .then(() => getInfo(doc))
    .then(listSheets)
}


export default start
