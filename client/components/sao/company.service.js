'use strict';

export function CompanyAuditService($resource) {
  'ngInject';

  return $resource('/api/company/audit/:id', {}, {});
}
