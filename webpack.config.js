module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
    library: 'sequelize-crud',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
};