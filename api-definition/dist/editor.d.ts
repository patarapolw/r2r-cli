// eslint-disable-next-line no-unused-vars
import { IEntry } from './shared'

export default interface IEditorApi {
  '/editor/': {
    POST: {
      body: {
        q: string | Record<string, any>
        offset?: number
        limit?: number
        sort?: {
          key: string
          desc?: boolean
        }
      },
      response: {
        data: Partial<IEntry>[],
        count: number
      }
    }
    DELETE: {
      body: {
        ids: string[]
      }
    }
  }
  '/editor/create': {
    PUT: {
      body: {
        create: IEntry | IEntry[]
      }
      response: {
        ids: string[]
      }
    }
  }
  '/editor/update': {
    PUT: {
      body: {
        ids: string[]
        update: Partial<IEntry>
      }
    }
  }
  '/editor/tag': {
    PUT: {
      body: {
        ids: string[]
        tags: string[]
      }
    }
    DELETE: {
      body: {
        ids: string[]
        tags: string[]
      }
    }
  }
}
