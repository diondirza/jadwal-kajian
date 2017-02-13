/* eslint-disable import/no-extraneous-dependencies */
// PostCSS-Loader config options
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-simple-vars'),
    require('postcss-cssnext'),
  ],
};
