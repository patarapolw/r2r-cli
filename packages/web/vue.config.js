const path = require('path')

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
  chainWebpack: (config) => {
    config.resolve.symlinks(false)
  },
}
