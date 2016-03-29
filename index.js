'use strict';
require('babel-core/register')({});

//this is the server side, delete the `BROWSER` variable (set in webpack configuration)
//necessary in order for the stylesheets not to be loaded in the `./client/index.jsx`
delete process.env.BROWSER;

//start up the server
var server = require('./server').default;
const port = process.env.PORT || 3002;
server.listen(port, function () {
  console.log(`Server listening on: ${port}.`);
});
