import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from 'routes';

/**
 * Client gateway into the app.
 */

if(process.env.BROWSER){
  require('font-awesome/css/font-awesome.css');

  require('../shared/styles/screen.scss');
  require('../shared/styles/charts.scss');

  require.context('../shared/media', true, /^\.\//);
  require.context('../shared/data', true, /^\.\//);
}

//render the app into the `#app` element
render(
  <Router children={routes} history={browserHistory}/>,
  document.getElementById('app')
);
