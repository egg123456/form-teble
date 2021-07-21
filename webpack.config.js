/*
 * @Author: wb-yangergang
 * @Date: 2021-07-19 15:48:05
 * @LastEditors: wb-yangergang
 * @LastEditTime: 2021-07-21 15:37:03
 * @Description: file content
 */
const path = require('path');
module.exports = {
  target: ['web'],
  mode: 'development',
  entry: { index: './src/index.js' },//多入口
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      { 
        test: /\.css$/, 
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
       }
     },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),  //服务器资源目录
    port: 7000, //服务端口号
    host:'0.0.0.0', //服务器主机号，
    historyApiFallback: true,  //任意的 404 响应都可能需要被替代为 index.html
    hot: true, //启用webpack热替换
    stats: "errors-only", //errors-only表示只打印错误：还有"minimal"，"normal"，"verbose"
 }
}