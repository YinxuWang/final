'use strict';

import angular from 'angular';
import AdminRoleController from './role.controller';

export default angular.module('app.admin.role', [])
  .controller('AdminRoleController', AdminRoleController)
  .name;
