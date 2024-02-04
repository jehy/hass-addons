// config-overrides.js

const {aliasWebpack, aliasJest} = require('react-app-alias-ex')

const options = {} // default is empty for most cases

module.exports = aliasWebpack(options)
module.exports.jest = aliasJest(options)


/*
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

module.exports = function override(config, env) {
    if (env === 'production') {
        config.plugins.push(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/\.(js|css)$/]))
    }
    return config
}

const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin')

module.exports = function override(config, env) {
    if (env === 'production') {
        config.plugins.push(new ScriptExtHtmlWebpackPlugin({
            inline: /.+[.]js/,
        }))
        config.plugins.push(new StyleExtHtmlWebpackPlugin())
    }
    return config
}
    */
