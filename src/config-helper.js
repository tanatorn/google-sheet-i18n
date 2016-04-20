import GoogleSpreadsheet from 'google-spreadsheet'
import Promise from 'bluebird'
import { cwd } from 'process'
import path from 'path'

export function getConfig() {
  try {
    return require(path.join(cwd(), 'i18n.config'))
  } catch (err) {
    return null
  }
}

export function getDocument({ sheetId }) {
  return Promise.promisifyAll(new GoogleSpreadsheet(sheetId))
}

export function authorizeConnection({ credentialsPath }, doc) {
  const creds = require(credentialsPath)
  return doc.useServiceAccountAuthAsync(creds)
}

