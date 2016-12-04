'use strict';

import angular from 'angular';
import routes from './admin.routes';
import login from './login';
import role from './role';
import company from './company';
import config from './config';
import user from './user';
export default angular.module('app.admin', ['app.auth', 'ui.router', login, role, config, company, user])
  .config(routes)
  .name;
