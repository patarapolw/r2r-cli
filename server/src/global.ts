import path from 'path'
import Db from './engine/db'
// eslint-disable-next-line no-unused-vars
import SocketIO from 'socket.io'
import rimraf from 'rimraf'
import fs from 'fs-extra'
import DEFAULTS from './defaults.json'
import { String } from 'runtypes'

export const PORT = process.env.PORT || DEFAULTS.port
export const ROOT = String.check(process.env.ROOT)
export const COLLECTION = path.join(ROOT, 'user.r2r')
export const MEDIA_FOLDER = path.join(ROOT, 'media')
export const TMP_FOLDER = path.join(ROOT, 'tmp')

fs.ensureDirSync(MEDIA_FOLDER)
fs.ensureDirSync(TMP_FOLDER)

export const DB = new Db(COLLECTION)

export const g: {
  IO?: SocketIO.Server
} = {}

function onExit () {
  rimraf.sync(TMP_FOLDER)
  process.exit()
}

process.on('exit', onExit)
process.on('SIGINT', onExit)
