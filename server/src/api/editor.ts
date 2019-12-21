import { IEditorApi } from '@r2r/api-definition'
import RestypedRouter from 'restyped-express-async'
import { Router } from 'express'
import Db from '../engine/db'

export default (app: Router, db: Db) => {
  const router = RestypedRouter<IEditorApi>(app)

  router.post('/editor/', async (req) => {
    const { q, offset, limit, sort } = req.body

    const [data, ids] = await Promise.all([
      db.parseCond(q || {}, {
        offset,
        limit,
        fields: {
          card: ['front', 'back', 'mnemonic', 'tag', 'srsLevel', 'nextReview', 'createdAt', 'updatedAt', 'stat', 'deck', '_id'],
          template: ['name', 'front', 'back'],
          note: ['meta', 'data'],
          source: ['name'],
        },
        sort,
      }),
      db.parseCond(q || {}, {
        fields: {
          card: ['_id'],
        },
        sort,
      }),
    ])

    return {
      data,
      count: ids.length,
    }
  })

  router.put('/editor/create', async (req) => {
    const ids = await db.insertMany(Array.isArray(req.body.create) ? req.body.create : [req.body.create])
    return { ids }
  })

  router.put('/editor/update', async (req, res) => {
    const { ids, update } = req.body
    await db.updateMany(ids, update)
    res.sendStatus(201)
  })

  router.delete('/editor/', async (req, res) => {
    const { ids } = req.body
    await db.deleteMany(ids)
    res.sendStatus(201)
  })

  router.put('/editor/tag', async (req, res) => {
    const { ids, tags } = req.body
    for (const id of ids) {
      const c = (await db.card.find({ _id: id }, ['tag'], 'LIMIT 1'))[0]
      if (c) {
        await db.card.update({ _id: id }, { tag: [...(c.tag || []), ...tags] })
      }
    }
    res.sendStatus(201)
  })

  router.delete('/editor/tag', async (req, res) => {
    const { ids, tags } = req.body
    for (const id of ids) {
      const c = (await db.card.find({ _id: id }, ['tag'], 'LIMIT 1'))[0]
      if (c) {
        await db.card.update({ _id: id }, { tag: (c.tag || []).filter((t: string) => !tags.includes(t)) })
      }
    }
    res.sendStatus(201)
  })
}
