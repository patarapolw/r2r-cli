module.exports = {
  pages: {
    index: './src/main.ts',
    reveal: './src/reveal.ts',
  },
  devServer: {
    proxy: {
      '^/api/': {
        target: 'http://localhost:3000',
      },
      '^/reveal/': {
        target: 'http://localhost:3000',
      },
    },
  },
  publicPath: '',
  outputDir: '../dist/web',
}
