export default interface IMediaApi {
  '/media/*': {
    GET: {
      params: [string]
    }
  }
  '/media/': {
    POST: {
      response: {
        path: string
      }
    }
  }
}
