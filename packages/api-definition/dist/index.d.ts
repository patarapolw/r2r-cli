import IEditorApi from './editor'
import IIoApi from './io'
import IMediaApi from './media'
import IQuizApi from './quiz'
import { IEntry } from './shared'

type IApi = IEditorApi & IIoApi & IMediaApi & IQuizApi

export default IApi
export { IEditorApi, IIoApi, IMediaApi, IQuizApi, IEntry }
