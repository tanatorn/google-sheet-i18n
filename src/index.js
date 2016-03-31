#!/usr/bin/env node
import program from 'commander'
import start from './start'

program
  .version('0.0.3')
  .usage('<command>')
  .option('start', 'Run a translation')
  .parse(process.argv)


if (program.start) {
  start()
}
