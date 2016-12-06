'use strict';

import angular from 'angular';
import routes from './company.routes';

export default angular.module('app.company',['app.auth','ui.router'])
  .config(routes)
  .name;
