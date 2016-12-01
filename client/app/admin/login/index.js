'use strict';

import angular from 'angular';
import AdminLoginController from './login.controller';

export default angular.module('app.admin.login', [])
  .controller('AdminLoginController', AdminLoginController)
  .name;
