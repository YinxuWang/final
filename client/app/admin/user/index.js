'use strict';

import angular from 'angular';
import AdminUserController from './user.controller';

export default angular.module('app.admin.user', [])
  .controller('AdminUserController', AdminUserController)
  .name;
