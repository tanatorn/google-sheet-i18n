#!/usr/bin/env node
import program from 'commander'
import start from './start'

program
  .version('0.0.6')
  .usage('<command>')
  .option('start', 'Generate translations')
  .parse(process.argv)


if (program.start) {
  start()
}
