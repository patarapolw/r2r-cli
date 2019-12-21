module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:48000',
        ws: true,
      },
      '^/media': {
        target: 'http://localhost:48000',
      },
    },
  },
}
