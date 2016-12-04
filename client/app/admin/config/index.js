'use strict';

import angular from 'angular';
import AdminConfigController from './config.controller';

export default angular.module('app.admin.config', [])
  .controller('AdminConfigController', AdminConfigController)
  .name;
