'use strict';

import angular from 'angular';
import routes from './company.routes';
import structure from './structure';
import apply from './apply';

export default angular.module('app.company', ['app.auth', 'ui.router', structure, apply])
  .config(routes)
  .name;
