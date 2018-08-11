// 引入 node.js 的核心模块 path
const path = require('path')
// 配置文件需要暴露出一个对象
const config = {
  mode: 'development',// 4.0版本需要配置一个mode，来指定是开发环境还是生产环境， development, production, none
  entry: {
    // 入口文件
    main: './src/modules/main'
  },
  output: {
    // 打包的出口路径，必须是绝对路径
    path: path.join(__dirname, '/dist')
  }
}
module.exports = config

// 命令行执行 webpack 就会执行打包程序