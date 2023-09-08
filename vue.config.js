/**
 * 配置该文件可以参考:
 * https://cli.vuejs.org/zh/config/#%E7%9B%AE%E6%A0%87%E6%B5%8F%E8%A7%88%E5%99%A8
 *
 */
const url = 'http://192.168.0.114:39999'//胡宇江
// const url = 'http://192.168.6.78:39999' //王傲
// const url = 'http://api.idatatrust.com' //线上
// 基础路径，发布前修改这里,当前配置打包出来的资源都是相对路径
let publicPath = './'

const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: publicPath,
  lintOnSave: true,
  productionSourceMap: false,
  css: {
    // 忽略 CSS order 顺序警告
    extract: { ignoreOrder: true },
    loaderOptions: {
      sass: {
        implementation: require('sass'), // This line must in sass option
      },
    },
  },
  configureWebpack: {
    resolve: {
     alias: {
      '@': resolve('src')
     }
    },
   },
  chainWebpack: config => {
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  // 配置转发代理
  devServer: {
    port: 38082,
    disableHostCheck:true,
    proxy: {
      '/': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/': '/'
        }
      }
    }
  }
}
