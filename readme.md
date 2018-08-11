## 配置 webpack 自动打包工具示例
- 安装 webpack 
  ```
  // 全局安装
  npm i webpack -g 
  npm i webpack-cli -g
  // 安装完成初始化 node 环境，配置 webpack.config.js 文件
  ```
- webpack.config.js 文件配置
  ```javascript
  // 引入 node.js 的核心模块 path
  const path = require('path')
  // 配置文件需要暴露出一个对象
  const config = {
    mode: 'development',// 4.0版本需要配置一个mode，来指定是开发环境还是生产环境， development, production, none ,未设置默认为 production
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
  ```
  在 src/modules/ 目录下存放了需要打包的 js 文件，在命令行中 执行 webpack 命令就会执行打包程序，在 dist 文件夹（没有则生成）中生成目标文件
  > webpack 在 node 环境中执行，所以模块化采用 commonjs 规范

- 根据具体使用环境，配置不同的配置文件

  在命令行中执行 `webpack` ，系统会默认读取 webpack.config.js 中的配置去执行打包，我们可以设置具体的配置文件，在执行 webpack 命令时传入参数，从而根据具体情况打包文件

  - 在目录中建立 build 文件夹存放配置文件
  - 在 build 目录中建立通用配置 webpack.base.js 文件，设置通用配置
    ```javascript
    const path = require('pathpath')
    const base_config = {
      entry: {
        main: './src/modules/main'
      },
      output: {
        path: path.join(__dirname, '/../dist'),
        filename: '[name].js'// 根据入口文件命名文件，[name]_[hash], 在文件名后加入 hash 值作为文件名
      }
    }
    module.exports = base_config
    ```
  - 根据需要，建立用于开发环境的 webpack.dev.js 文件和用于生产环境的webpack.pro.js 文件
    ```javascript
    /* webpack.dev.js 文件 */
    const base_config = require('./webpack.base')// 引入通用配置
    const development_config = {
      mode: 'development',
      ...base_config
    }
    module.exports = development_config
    ```
    ```
    /* webpack.pro.js 文件 */
    const base_config = require('./webpack.base')
    const production_config = {
      ...base_config,
      mode: 'production',
      output: {
        filename: '[name]_[hash].min.js'
      }
    }
    module.exports = production_config
    ```
    > 当 node 版本太低时不支持 `...` 对象展开命令，需要使用 webpack-merge 包
  - 创建 index.js 文件，用于 webpack 命令执行
    ```javascript
    /* index.js 文件 */
    const development_config = require('./webpack.dev')
    const production_config = require('./webpack.pro')
    // 文件暴露一个函数，根据传入的参数选择不同的打包模式
    module.exports = function (env) {
      if( env === 'production') return production_config
      return development_config
    }
    ```
  - 执行 webpack 打包命令时，可以传入参数根据需要选择打包模式
    ```
    // --env 双杠命令用于传参，后面带参数
    webpack --env production --config ./build
    ```
  - 配置 package.json 文件，简化命令输入
    ```javascript
    /*package.json 文件 script 部分*/
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "dev": "webpack --env development --config ./build/index.js",
      "pro": "webpack --env production --config ./build/index.js",
      "startpack": "npm run pro"
    },
    ``` 
    在命令行键入相应命令执行，如 `npm run dev` 则执行 "dev" 中的语句
- 至此，javascript 文件的处理基本完成，接着处理别的文件，但是 **webpack 自身只理解 JavaScript**，所以要处理别的文件，需要使用 plugin 和 loader
  > loader： 可以将所有类型的文件转换为 webpack 能够处理的有效模块，loader 不能处理的模块可以交由 plugin 处理

  > plugin： 可用于执行范围更广的任务。范围包括，从打包优化和压缩，一直到重新定义环境中的变量,功能及其强大

  - 处理 html（html, jade, ejs, hbs 等） 文件：html-webpack-plugin
    - 安装 html-webpack-plugin
      ```
      npm i html-webpack-plugin -D
      ```
    - 在 build/webpack.base.js 中添加
    ```javascript
    const base_config = {
      entry: {...},
      output: {...},
      // plugin 的使用要通过实例化传入 option 参数配置
      plugins: [
        new HtmlWebpackPlugin({
          template: './src/index.html',// 模块名称
          filename: 'index.html',// 生成的文件名
          title: 'webpack-demo-html',// 生成的 html 文件的 title
          minify: {// 压缩 html 文件
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true
          }
        })
      ]
    }
    ```
    - html-webpack-plugin 的一些相关参数 [参考文档](https://segmentfault.com/a/1190000007294861)
      - `title`: 设置生成的 html 文件的标题。
      - `filename`: 文件名
      - `template`: 模板，可以是 html, jade, ejs, hbs, 等等，但是要注意的是，使用自定义的模板文件时，需要提前安装对应的 loader， 否则webpack不能正确解析。
      - `inject`: 注入选项，script 标签的位置
      - `favicon`: favicon 图标文件路径
      - `minify`: 内部集成的 html-minifier [参考文档](https://github.com/kangax/html-minifier#options-quick-reference)

      - ect 可根据资料选择使用

  - 处理 css、scss 等的文件：使用 loader 
    - loader: loader的使用就是在配置项中，设置modules，在modules中设置rule值为数组，在数组里放入多个匹配规则
    - 安装相关包
      ```
      npm i css-loader style-loader -D // 处理css style-loader将css代码放到 style 标签中
      npm i sass-loader -D // 处理 sass
      npm i node-sass -D // node 处理 sass 模块
      ```
    - 在 build/webpack.base.js 添加
      ```javascript
      module: {
        rules: [
          { test: /\.css$/g, use: ['style-loader', 'css-loader'] },
          { test: /\.scss$/g, use: ['style-loader', 'css-loader', 'sass-loader'] }
        ]
      }
      ```
        > style-loader 把样式放在了 style 标签中，抽离出来需要使用 extract-text-webpack-plugin 插件
    - 安装
      ```
      npm i extract-text-webpack-plugin@next -D
      ```
      > extract-text-webpack-plugin 最新稳定版还不能支持webpack4.0.0以上的版本，使用起来会报错，所以这里使用 @next 命令安装最新版
    - 配置
      ```javascript
      plugins: [
        new HtmlWebpackPlugin({...}),
        new ExtractTextPlugin ({
          filename: 'index.css',// 目标文件名
          allChunks: true // 提取所有片段
        })
      ],
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",// 当 use 的 loader 没有被提取时使用的 loader 
              use: "css-loader"
            })
          },
          {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",// 当 use 的 loader 没有被提取时使用的 loader 
              use: ['css-loader', "sass-loader"]
            })
          }
        ]
      }
      ```
  - 处理 css 兼容
    - 安装
      ```
      npm i postcss-loader -D
      npm i autoprefixer -D // postcss-loader 的自动兼容插件
      ```
    - 配置： 
      - 在 webpack 项目目录下创建 postcss.config.js 文件并配置
        ```javascript
        module.exports = {
          plugins: [
            require('autoprefixer')
          ]
        }
        ```
      - 在 webpack.base.js 配置中添加
        ```javascript
        // 在 use 配置中 css-loader 前添加 postcss-loader 即可
        {
        test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader", 'postcss-loader']
          })
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ['css-loader', 'postcss-loader', "sass-loader"]
          })
        }
        ```
      - 在 package.json 文件中添加浏览器支持
        ```javascript
        "browserslist": [
          "defaults",
          "not ie < 11",
          "last 2 versions",
          "> 1%",
          "iOS 7",
          "last 3 iOS versions"
        ]
        ```
