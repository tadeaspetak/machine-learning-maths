import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from 'app';

//pages
import Introduction from 'pages/introduction';
import Derivative from 'pages/derivative';
import CostFunction from 'pages/cost-function';
import GradientDescent from 'pages/gradient-descent';

/**
 * Route definitions.
 */

export default(
  <Route name="app" component={App} path ="/">
    <IndexRoute component={Introduction} name="introduction" />
    <Route component={Derivative} name="derivative" path="/derivative" />
    <Route component={CostFunction} name="costFunction" path="/cost-function" />
    <Route component={GradientDescent} name="gradientDescent" path="/gradient-descent" />
  </Route>
);
