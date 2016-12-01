'use strict';

import angular from 'angular';
import routes from './admin.routes';
import login from './login';
export default angular.module('app.admin', ['app.auth', 'ui.router', login])
  .config(routes)
  .name;
