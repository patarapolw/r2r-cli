module.exports = {
  devServer: {
    proxy: {
      '^/(api|reveal|reveal-md)/': {
        target: 'http://localhost:3000',
      },
    },
  },
  publicPath: '',
  outputDir: '../dist/web',
}
