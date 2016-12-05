"use strict";

import angular from 'angular';
import AdminCompanyAuditController from './audit/audit.controller';
import AdminCompanyListController from './list/list.controller';

export default angular.module('app.admin.company', [])
  .controller('AdminCompanyListController', AdminCompanyListController)
  .controller('AdminCompanyAuditController', AdminCompanyAuditController)
  .name;
