/**
 * Webpack configuration for production.
 *
 * Development configuration augments this production
 * config object -> ensure any changes are not breaking.
 */

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var config = {
  //entry point(s) to the app
  entry: [
    path.resolve(__dirname, './client')
  ],
  //output goes to `build/bundle.js`
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  //modules resolving
  resolve: {
    //module directories (not necessary to pass full paths as webpack looks in `./`,`../`, `../../`, etc.)
    modulesDirectories: ['node_modules', 'shared'],
    //extensions that should be used to resolve modules
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
        //.jsx file loader -> es2015 and react babel extensions (make sure to also include the same config in the `.babelrc` file)
        test: /.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015'],
          plugins: []
        }
      }, {
        //SASS
        test: /\.(s)?css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!sass-loader")
      }, {
        //all images into the `img` folder
        test: /\.(jpg|jpeg|gif|png|ico)$/,
        exclude: /node_modules/,
        loader: 'file-loader?name=img/[name].[ext]'
      },
      //all data files into the `data` folder
      {
        test: /\.(csv|tsv)$/,
        exclude: /node_modules/,
        loader: 'file-loader?name=data/[name].[ext]&context=./app/images'
      },
      //load fonts (note the `version` part after the suffix, very important)
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      //emit files
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ],
    //skip parsing vendor files to optimize workflow (TODO)
    //noParse: []
  },
  plugins: [
    //combine all the .css and .sass files into `screen.css`
    new ExtractTextPlugin("screen.css")
  ],
};

module.exports = config;
