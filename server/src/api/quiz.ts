import moment from 'moment'
import Db, { parseQ } from '../engine/db'
import { IQuizApi } from '@r2r/api-definition'
import RestypedRouter from 'restyped-express-async'
import { Router } from 'express'
import { ITreeViewItem } from '@r2r/api-definition/dist/quiz'

export default (app: Router, db: Db) => {
  const router = RestypedRouter<IQuizApi>(app)

  router.post('/quiz/', async (req) => {
    const { q, deck, type, due } = req.body

    let $or = [parseQ(q)]
    let dueOrNew = false

    if (deck) {
      $or = $or.map((cond) => {
        return [
          {
            ...cond,
            deck,
          },
          {
            ...cond,
            deck: { $like: `${deck}/%` },
          },
        ]
      }).reduce((a, b) => [...a, ...b])
    }

    if (type !== 'all') {
      if (type === 'due') {
        $or.map((cond) => {
          cond.nextReview = { $lte: moment().toISOString() }
        })
      } else if (type === 'leech') {
        $or.map((cond) => {
          cond.srsLevel = 0
        })
      } else if (type === 'new') {
        $or.map((cond) => {
          cond.nextReview = { $exists: false }
        })
      } else {
        dueOrNew = true
      }
    }

    if (due) {
      const m = /(-?\d+(?:\.\d+)?\S+)/.exec(due)
      if (m) {
        try {
          $or.map((cond) => {
            cond.nextReview = { $lte: moment().add(parseFloat(m[1]), m[2] as any).toISOString() }
          })
        } catch (e) {
          console.error(e)
          dueOrNew = true
        }
      } else {
        dueOrNew = true
      }
    }

    if (dueOrNew) {
      $or = $or.map((cond) => {
        return [
          {
            ...cond,
            nextReview: { $exists: false },
          },
          {
            ...cond,
            nextReview: { $lte: moment().toISOString() },
          },
        ]
      }).reduce((a, b) => [...a, ...b])
    }

    const ids = Array.from(new Set((await Promise.all($or.map(async (cond) => {
      return (await db.parseCond(cond, {
        fields: {
          card: ['_id'],
        },
      })).map((c) => c._id!)
    }))).reduce((a, b) => [...a, ...b])))

    return { ids }
  })

  router.post('/quiz/treeview', async (req) => {
    function recurseParseData (data: ITreeViewItem[], deck: string[], _depth = 0) {
      let doLoop = true

      while (_depth < deck.length - 1) {
        for (const c of data) {
          if (c.name === deck[_depth]) {
            c.children = c.children || []
            recurseParseData(c.children, deck, _depth + 1)
            doLoop = false
            break
          }
        }

        _depth++

        if (!doLoop) {
          break
        }
      }

      if (doLoop && _depth === deck.length - 1) {
        const fullName = deck.join('/')
        const thisDeckData = deckData.filter((d) => d.deck === fullName || d.deck!.indexOf(`${fullName}/`) === 0)

        data.push({
          name: deck[_depth],
          fullName,
          isOpen: _depth < 2,
          stat: {
            new: thisDeckData.filter((d) => !d.nextReview).length,
            leech: thisDeckData.filter((d) => d.srsLevel === 0).length,
            due: thisDeckData.filter((d) => d.nextReview && moment(d.nextReview).toDate() < now).length,
          },
        })
      }
    }

    const { q } = req.body

    const deckData = await db.parseCond(q || {}, {
      fields: {
        card: ['nextReview', 'srsLevel', 'deck', '_id'],
      },
    })

    const now = new Date()

    const deckList: string[] = deckData.map((d: any) => d.deck)
    const deckWithSubDecks: string[] = []

    deckList.filter((d, i) => deckList.indexOf(d) === i).sort().forEach((d) => {
      const deck = d.split('/')
      deck.forEach((seg, i) => {
        const subDeck = deck.slice(0, i + 1).join('/')
        if (deckWithSubDecks.indexOf(subDeck) === -1) {
          deckWithSubDecks.push(subDeck)
        }
      })
    })

    const fullData = [] as ITreeViewItem[]
    deckWithSubDecks.forEach((d) => {
      const deck = d.split('/')
      recurseParseData(fullData, deck)
    })

    return {
      treeview: fullData,
    }
  })

  router.post('/quiz/id', async (req) => {
    const r = await db.render(req.body.id)
    return r
  })

  router.put('/quiz/id', async (req, res) => {
    await db.markRight(req.body.id)
    res.sendStatus(201)
  })

  router.delete('/quiz/id', async (req, res) => {
    await db.markWrong(req.body.id)
    res.sendStatus(201)
  })
}
