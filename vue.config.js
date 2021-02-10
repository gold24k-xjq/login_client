
const webpack = require('webpack')

module.exports = {

    publicPath: '/',
    outputDir: process.env.outputDir,
    productionSourceMap: false,

    chainWebpack: config => {
        config.plugin('provide').use(webpack.ProvidePlugin, [{
            $: 'jquery',
            jquery: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }]),
        config.plugin('html').tap(args => {
            args[0].title= '成长AI'
            return args
        })
    },
    configureWebpack: {
        performance: {
            hints:'warning',
            //入口起点的最大体积
            maxEntrypointSize: 50000000,
            //生成文件的最大体积
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    }


}