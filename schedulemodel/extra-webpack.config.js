const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default

module.exports = (angularWebpackConfig, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(angularWebpackConfig, options)
  if (singleSpaWebpackConfig.mode === 'production') {
    singleSpaWebpackConfig.output.jsonpFunction = 'schedulemodels';
  }
  // Feel free to modify this webpack config however you'd like to
  return singleSpaWebpackConfig
}