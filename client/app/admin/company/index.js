'use strict';

import angular from 'angular';
import AdminCompanyController from './company.controller';

export default angular.module('app.admin.company', [])
  .controller('AdminCompanyController', AdminCompanyController)
  .name;
