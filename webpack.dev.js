import assign from 'object-assign';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import productionConfiguration from './webpack.config.js';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

/**
 * Webpack configuration for development.
 * Using `assign`, it is derived from the production configuration.
 */

export default function(app) {
  const config = assign(productionConfiguration, {
    //add SourceMap as DataUrl to the JavaScript file
    devtool: 'inline-source-map',
    entry: [
      //allow hot swapping
      'webpack-hot-middleware/client',
      path.resolve(__dirname, './client')
    ],
    plugins: [
      //all the following three plugins are required by the webpackHotMiddleware middleware
      //assign the module and chunk ids by occurrence count -> ids that are used often get lower (shorter) ids
      new webpack.optimize.OccurrenceOrderPlugin(),
      //hot reload plugin
      new webpack.HotModuleReplacementPlugin(),
      //do not exit with a fail code on encountering an error during compilation; skip emitting phase instead
      new webpack.NoErrorsPlugin(),

      //combine all the .css and .sass files into `screen.css`
      new ExtractTextPlugin("screen.css"),
      //set the BROWSER variable to true (useful for determining context in the shared code base)
      new webpack.DefinePlugin({
        "process.env": {
            BROWSER: JSON.stringify(true)
        }
      })
    ],
  });

  const compiler = webpack(config);

  //serve the files emitted from webpack over a connect server (nothing is written to the disk)
  app.use(webpackDevMiddleware(compiler, {
    // display all info to console (not only warnings and errors)
    noInfo: false
  }));
  //allow webpack hot reloading
  app.use(webpackHotMiddleware(compiler));
}
