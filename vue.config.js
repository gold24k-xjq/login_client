
const webpack = require('webpack')
///login_client/dist/
module.exports = {

	publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',

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
    }


}