import express, { Router } from 'express'
import editorRouter from './api/editor'
import mediaRouter from './api/media'
import quizRouter from './api/quiz'
import ioRouter from './api/io'
import cors from 'cors'
import bodyParser from 'body-parser'
import SocketIO from 'socket.io'
import http from 'http'
import path from 'path'
import Db from './engine/db'
import fs from 'fs-extra'
import rimraf from 'rimraf'

export default async function main (port: string, root: string, filename: string = 'user.r2r') {
  const app = express()
  const server = new http.Server(app)
  const io = SocketIO(server)
  const db = new Db(path.join(root, filename))
  const mediaFolder = path.join(root, 'media')
  const tmpFolder = path.join(root, 'tmp')

  fs.ensureDirSync(mediaFolder)
  fs.ensureDirSync(tmpFolder)

  function onExit () {
    rimraf.sync(tmpFolder)
    process.exit()
  }

  process.on('exit', onExit)
  process.on('SIGINT', onExit)

  app.use(cors())
  app.use(bodyParser.json())

  mediaRouter(app, {
    mediaFolder,
    db,
  })

  const apiRouter = Router()
  app.use('/api', apiRouter)

  editorRouter(apiRouter, db)
  ioRouter(apiRouter, io, {
    tmpFolder,
    db,
  })
  quizRouter(apiRouter, db)

  app.use(express.static(path.join(__dirname, '../web/dist')))

  await db.init()
  server.listen(port, () => console.log(`Server running at http://localhost:${port}`))
}
