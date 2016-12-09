'use strict';

import angular from 'angular';
import CompanyStructureController from './structure.controller';

export default angular.module('app.company.structure', [])
  .controller('CompanyStructureController', CompanyStructureController)
  .name;
