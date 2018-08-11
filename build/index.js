const development_config = require('./webpack.dev')
const production_config = require('./webpack.pro')
// 文件暴露一个函数，根据传入的参数选择不同的打包模式
module.exports = function (env) {
  if( env === 'production') return production_config
  return development_config
}
