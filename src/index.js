#!/usr/bin/env node
import program from 'commander'
import start from './start'

program
  .version('0.0.1')
  .usage('<command>')
  .option('start', 'Create a proj')
  .parse(process.argv)


if (program.start) {
  start()
}
