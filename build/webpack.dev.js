const base_config = require('./webpack.base')// 引入通用配置
const development_config = {
  mode: 'development',
  ...base_config
}
module.exports = development_config