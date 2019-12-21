import axios from 'restyped-axios'
import IApi from '@r2r/api-definition'

export const api = axios.create<IApi>({
  baseURL: '/api/',
})

export interface IColumn {
  name: string
  width?: number
  label: string
  type?: 'string' | 'html' | 'number' | 'datetime' | 'tag' | 'multiline'
  required?: boolean
}

export const Columns: IColumn[] = [
  { name: 'deck', width: 150, type: 'string', required: true, label: 'Deck' },
  { name: 'front', width: 400, type: 'html', required: true, label: 'Front' },
  { name: 'back', width: 400, type: 'html', label: 'Back' },
  { name: 'mnemonic', width: 300, type: 'html', label: 'Mnemonic' },
  { name: 'tag', width: 150, type: 'tag', label: 'Tags' },
  { name: 'srsLevel', width: 150, type: 'number', label: 'SRS Level' },
  { name: 'nextReview', width: 250, type: 'datetime', label: 'Next Review' },
  { name: 'createdAt', width: 250, type: 'datetime', label: 'Created' },
  { name: 'updatedAt', width: 250, type: 'datetime', label: 'Updated' },
]

export const DateFormat = 'Y-M-d H:i'
