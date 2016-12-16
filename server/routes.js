/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import {reqRouter} from "./api/mobile/index";
let bodyParser = require('body-parser');
let textParser = bodyParser.text();

export default function (app) {
  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/roles', require('./api/role'));
  app.use('/api/company', require('./api/company'));
  app.use('/api/room', require('./api/room'));
  app.use('/auth', require('./auth').default);
  app.post('/api/mobile', textParser, reqRouter);



  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
