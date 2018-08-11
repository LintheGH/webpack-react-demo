const base_config = require('./webpack.base')
const production_config = {
  ...base_config,
  mode: 'production',
  output: {
    filename: '[name]_[hash].min.js'
  }
}
module.exports = production_config