#!/usr/bin/env node

import yargs from 'yargs'
import path from 'path'
import fs from 'fs'
import { initServer } from './server'
import { scan as dreeScan } from 'dree'

const { argv } = yargs
  .scriptName('r2r-editor')
  .version(require(path.join(__dirname, '../package.json')).version)
  .command('$0 [options] <fileOrDir>', 'Read file or directory or in the editor', (args) => {
    args.positional('fileOrDir', {
      describe: 'Path to the file or directory to read',
    })
  })
  .option('edit', {
    alias: 'e',
    type: 'boolean',
    default: false,
    describe: 'Edit the file in editor',
  })
  .option('port', {
    alias: 'p',
    type: 'number',
    default: 24000,
    describe: 'Port to run the server',
  })
  .option('open', {
    type: 'boolean',
    default: true,
    hidden: true,
  })
  .option('no-open', {
    type: 'boolean',
    describe: 'Do not open the browser after running the server',
  })
  .coerce(['fileOrDir'], path.resolve)
  .check((args) => {
    const arrayArgs = Object.entries(args)
      .filter(([k, v]) => typeof k === 'string' && /[A-Z]+/i.test(k) && Array.isArray(v))
      .map(([k, _]) => k)

    return arrayArgs.length > 0
      ? `Too many arguments: ${arrayArgs.join(', ')}`
      : true
  })

let { edit, fileOrDir, port, open } = argv
let dirTree
let root = fileOrDir!

if (fs.statSync(fileOrDir!).isDirectory()) {
  dirTree = dreeScan(fileOrDir!, {
    extensions: ['md'],
    exclude: [/\.git/, /node_modules/],
  })
  fileOrDir = undefined
} else {
  root = path.dirname(fileOrDir!)
}

initServer({
  edit,
  filename: fileOrDir,
  dirTree,
  root,
  port,
  open,
})
