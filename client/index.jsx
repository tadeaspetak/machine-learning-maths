import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from 'routes';

/**
 * Client gateway into the app.
 */

//styles (make sure we are in the browser before requiring these, otherwise, there shall be errors!)
if(process.env.BROWSER){
  //require fonts
  require('font-awesome/css/font-awesome.css');

  //require styles
  require('../shared/styles/screen.scss');
  require('../shared/styles/charts.scss');

  //require all images (TODO: look into this, especially the webpack config)
  require.context('../shared/media', true, /^\.\//);

  //require all data files
  require.context('../shared/data', true, /^\.\//);
}

//render the app into the `#app` element
render(
  <Router children={routes} history={browserHistory}/>,
  document.getElementById('app')
);
