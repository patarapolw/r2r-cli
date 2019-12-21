export default interface IIoApi {
  '/io/': {
    GET: {
      query: {
        deck: string
        reset?: boolean
      }
    }
    POST: {
      response: {
        id: string
      }
    }
  }
}
