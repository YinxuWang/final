'use strict';

import angular from 'angular';
import {CompanyAuditService} from './company.service';
import {RoleService} from './role.service';

export default angular.module('app.sao', [])
  .factory('CompanyAudit', CompanyAuditService)
  .factory('Role', RoleService)
  .name;
