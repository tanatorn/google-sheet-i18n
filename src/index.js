#!/usr/bin/env node
import program from 'commander'
import start from './start'
import sheets from './sheets'
program
  .version('0.0.6')
  .usage('<command>')
  .option('start', 'Generate translations')
  .option('sheets', 'List available sheets')
  .parse(process.argv)


if (program.start) {
  start()
}

if (program.sheets) {
  sheets()
}
