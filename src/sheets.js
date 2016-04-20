import { stdout } from 'process'
import { getConfig,
  getDocument,
  authorizeConnection,
} from './config-helper'
import { getInfo } from './sheets-helper'

function printSheetsInfo({ worksheets }) {
  const sheetsArray = worksheets.map(({ title }) => title)
  stdout.write(sheetsArray.join('\n'))
}

export default function sheets() {
  const config = getConfig()
  const doc = getDocument(config)

  authorizeConnection(config, doc)
    .then(() => getInfo(doc))
    .then(printSheetsInfo)
}

