import path from 'path'
import { IMediaApi } from '@r2r/api-definition'
import RestypedRouter from 'restyped-express-async'
import { Router } from 'express'
import Db from '../engine/db'
import fs from 'fs'

export default (app: Router, config: {
  mediaFolder: string
  db: Db
}) => {
  const router = RestypedRouter<IMediaApi>(app)

  router.get('/media/*', async (req, res) => {
    const id = req.params[0]
    const m = (await config.db.media.find({ _id: id }, ['data'], 'LIMIT 1'))[0]
    if (m) {
      res.send(m.data || '')
    } else if (fs.existsSync(path.join(config.mediaFolder, req.params[0]))) {
      res.sendFile(path.join(config.mediaFolder, req.params[0]))
    } else {
      res.sendStatus(404)
    }
  })

  router.post('/media/', async () => {
    return {
      path: config.mediaFolder,
    }
  })
}
