import Promise from 'bluebird'
import fse from 'fs-extra'
import path from 'path'
import { getRows,
  getInfo,
} from './sheets-helper'
import { formatRow } from './formatter'
const { stdout } = process
const fs = Promise.promisifyAll(fse)
import { getConfig,
  getDocument,
  authorizeConnection,
} from './config-helper'

const config = getConfig()

const { outputs,
  categories,
  languages,
} = config

const delimiter = config.delimiter || '.'


/**
 * Gets all the rows from the sheet, filters out undefined rows
 */
const getSheetRows = (worksheet) => (
  new Promise((resolve, reject) => (
    getRows(worksheet)
      .then(rows => {
        const newRows = rows
          .map((row) => formatRow(row, categories, languages, delimiter))
          .filter(row => row !== null)
        resolve({
          title: worksheet.title.toLowerCase(),
          rows: newRows,
        })
      })
      .catch(reject)
  )
))

/**
 * Prepares data to be used with the mapper
 */
const prepareMapData = (rows, language) => (
  rows.map((row) => {
    const key = Object.keys(row)[0]
    return {
      key,
      data: row[key][language],
    }
  })
)

/**
 * Attempts to load a mapper, if a mapper is set by the user, use it,
 * other wise try to load a preset
 */
const prepareMapper = (preset, mapper) => {
  let userPreset = null
  if (mapper) {
    userPreset = mapper
  } else {
    userPreset = require(path.join(__dirname, '../',
     'lib/presets', preset))
  }
  return userPreset
}


const createConcatenatedTranslations = (rows, outPath, preset, mapper, prefix, suffix) => {
  Promise.all(
    languages.map(language => (
      fs.ensureDirAsync(`${outPath}`)
        .then(() => {

          const { fileMapper, fileExtension } = prepareMapper(preset, mapper)
          const mappedRows = prepareMapData(rows, language)
          const output = fileMapper(mappedRows, language)
          const writePath =
            `${outPath}/${(prefix || '') + language + (suffix || '') + fileExtension}`
          return fs.writeFileAsync(writePath, output, 'utf8')
        })
     ))
  )
}

const getTranslations = (title, rows, outPath, preset, mapper, prefix, suffix) => (
  languages.map(language => (
    fs.ensureDirAsync(`${outPath}/${language}`)
      .then(() => {
        const { fileMapper, fileExtension } = prepareMapper(preset, mapper)
        const mappedRows = prepareMapData(rows, language)
        const output = fileMapper(mappedRows, language)
        const writePath =
          `${outPath}/${language}/${(prefix || '') + title + (suffix || '') +
            fileExtension}`

        return fs.writeFileAsync(writePath, output, 'utf8')
      })

  ))
)

const createTranslations = (sheets, outPath, preset, mapper, prefix, suffix) => (
  Promise.all(
    sheets.map(({ title, rows }) => (
      getTranslations(title, rows, outPath, preset, mapper, prefix, suffix)
  )))
)

const generateTranslations = (sheets,
  { concat, mapper, name, outPath, prefix, preset, suffix }) => {

  stdout.write(`Generating i18n files for the ${name} output `)
  let translationPromise = null
  if (concat) {
    const rows = sheets.reduce((prev, curr) => prev.concat(curr.rows), [])
    translationPromise =
      createConcatenatedTranslations(rows, outPath, preset, mapper, prefix, suffix)
  } else {
    translationPromise =
      createTranslations(sheets, outPath, preset, mapper, prefix, suffix)
  }

  return translationPromise

}

const getSheets = ({ worksheets }) => {
  stdout.write('Fetching Rows from Google Sheets ')
  return new Promise((resolve, reject) => (
    Promise.all(worksheets.map(getSheetRows))
      .then(sheets => {
        stdout.write(`✓ \n`)
        return resolve(sheets)
      })
      .catch(reject)
  ))
}

const beginTranslations = (sheets) => (
  Promise.all(outputs.map((output) => (
    new Promise((resolve, reject) => (
      fs.removeAsync(output.outPath)
        .then(() => fs.ensureDirAsync(output.outPath))
        .then(() => generateTranslations(sheets, output))
        .then(() => {
          stdout.write(`✓ \n`)
          resolve(true)
        })
        .catch(reject)
      )
    ))
  ))
)

const start = () => {
  if (config) {
    const doc = getDocument(config)
    authorizeConnection(config, doc)
      .then(() => getInfo(doc))
      .then(getSheets)
      .then(beginTranslations)
      .then(() => stdout.write('Successfully generated i18n files! \n'))

  } else {
    stdout.write('You don\'t have a configuration file!')
  }
}


export default start
