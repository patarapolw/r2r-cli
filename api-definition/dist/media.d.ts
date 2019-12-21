export default interface IMediaApi {
  '/media/*': {
    GET: {}
  }
  '/media/': {
    POST: {
      response: {
        path: string
      }
    }
  }
}
