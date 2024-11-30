const path = require('path');

module.exports = {
  entry: './src/assets/actor.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src', 'assets'),
  },
  target: 'web',
  mode: 'production',
  resolve: {
    alias: {
      '@dfinity/agent': path.resolve(__dirname, 'node_modules/@dfinity/agent'),
    },
  },
};