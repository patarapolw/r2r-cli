#!/usr/bin/env node

import yargs from 'yargs'
import server from './server'

const { argv } = yargs
  .scriptName('r2r')
  .command('$0 <root>', 'Create or open in r2r', (y) => {
    y.positional('root', {
      describe: 'Root as <root>/user.r2r',
      type: 'string',
    })
  })
  .option('filename', {
    alias: 'f',
    describe: 'Custom filename to open, including the extension, such as custom.r2r',
    default: 'user.r2r',
  })
  .option('port', {
    describe: 'Server port to open for R2r server',
    default: '48000',
  })
  .help()

const { root, filename, port } = argv

server(port, root as string, filename).catch((e) => console.error(e))
