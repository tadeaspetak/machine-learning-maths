import createLocation from 'history/lib/createLocation';
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import routes from 'routes';
import {RouterContext, match} from 'react-router';
import path from 'path';
import fs from 'fs';

/**
 * Server configuration.
 */

const app = express();

// load `dev` configuration if we are not in the production environment (TODO: try removing the `default` bit below)
if (process.env.NODE_ENV === 'production') {
  console.log("PRODUCTION!");
} else {
  require('./webpack.dev').default(app);
  console.log("DEVELOPMENT!");
}

// static files in `/dist` (TODO: how does this work in the `dev` mode?)
app.use(express.static(path.join(__dirname, 'build')));

app.use((req, res) => {
  match({
    routes: routes,
    location: createLocation(req.url)
  }, (err, redirect, props) => {
    //an error occured!
    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    //page not found
    if (!props) {
      return res.status(404).end('Not found');
    }

    /**
     * Render the view.
     *
     * This function reads the `index.html` from the file system and replaces
     * the `{{appHtml}}` bit in it with the page renedered. It's isomorphic
     * (or universal?) as rendering happens on the server and the client receives
     * full HTML for the current path.
     */

    function renderView(callback) {
      fs.readFile('./shared/index.html', 'utf8', function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        var index = data;
        var html = index.replace('{{appHtml}}', renderToString((<RouterContext {...props} />)))
        callback(html);
      });
    }

    renderView(html => res.type('html').send(html));
  });
});

export default app;
