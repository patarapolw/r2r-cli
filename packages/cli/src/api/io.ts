import fileUpload, { UploadedFile } from 'express-fileupload'
import uuid from 'uuid/v4'
import path from 'path'
import fs from 'fs'
import Anki from '../engine/anki'
import sanitize from 'sanitize-filename'
import Db from '../engine/db'
import rimraf from 'rimraf'
import { Record, String } from 'runtypes'
import { IIoApi } from '@r2r/api-definition'
import RestypedRouter from 'restyped-express-async'
import { Router } from 'express'
import 'socket.io'

export default (app: Router, io: SocketIO.Server, config: {
  tmpFolder: string
  db: Db
}) => {
  const router = RestypedRouter<IIoApi>(app)
  router.use(fileUpload())
  const idToFilename: { [key: string]: string } = {}

  router.post('/io/', async (req) => {
    const id = uuid()
    const file = req.files!.file as UploadedFile
    const tmp = config.tmpFolder

    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp)
    }
    fs.writeFileSync(path.join(tmp, id), file.data)
    idToFilename[id] = file.name

    return { id }
  })

  router.get('/io/', async (req, res) => {
    const { deck, reset } = req.query
    const fileId = sanitize(deck)

    rimraf.sync(path.join(config.tmpFolder, fileId))

    const xdb = new Db(path.join(config.tmpFolder, fileId), () => { })
    await xdb.init()
    config.db.export({ deck: { $like: `${deck}/%` } }, xdb)
    config.db.export({ deck }, xdb)

    res.download(path.join(config.tmpFolder, fileId))
  })

  io.on('connection', (socket: any) => {
    socket.on('message', async (msg: any) => {
      const { id, type } = Record({
        id: String,
        type: String,
      }).check(msg)

      try {
        if (type === '.apkg') {
          const anki = new Anki(
            path.join(config.tmpFolder, id),
            idToFilename[id],
            (p: any) => {
              io.send(p)
            },
          )

          await anki.export(config.db)
          anki.close()
          io.send({})
        } else {
          const xdb = new Db(path.join(config.tmpFolder, id), (p: any) => {
            io.send(p)
          })
          await xdb.init()
          xdb.export({}, config.db)
          io.send({})
        }
      } catch (e) {
        io.send({
          error: e.toString(),
        })
      }
    })
  })
}
