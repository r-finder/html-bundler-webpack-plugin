const path = require('path');
const HtmlBundlerPlugin = require('@test/html-bundler-webpack-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: './src/index.html',
      },
      minify: 'auto', // auto && production mode => minify
      // use additional 'minifyOptions' only when 'minify' is 'auto'
      minifyOptions: {
        minifyCSS: false,
        minifyJS: true,
      },
    }),
  ],
};
