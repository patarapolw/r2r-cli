interface ITreeViewStat {
  new: number;
  leech: number;
  due: number;
}

export interface ITreeViewItem {
  name: string;
  fullName: string;
  isOpen: boolean;
  children?: ITreeViewItem[];
  stat: ITreeViewStat;
}

export default interface IQuizApi {
  '/quiz/': {
    POST: {
      body: {
        q: string
        deck?: string
        type?: 'all' | 'due' | 'leech' | 'new'
        due?: string
      }
      response: {
        ids: string[]
      }
    }
  }
  '/quiz/id': {
    POST: {
      body: {
        id: string
      }
      response: {
        front?: string
        back?: string
        mnemonic?: string
        css?: string
        js?: string
      }
    }
    PUT: {
      body: {
        id: string
      }
    }
    DELETE: {
      body: {
        id: string
      }
    }
  }
  '/quiz/treeview': {
    POST: {
      body: {
        q: string
      }
      response: {
        treeview: ITreeViewItem[]
      }
    }
  }
}
