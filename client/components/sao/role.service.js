"use strict";

export function RoleService($resource) {
  'ngInject';

  return $resource('/api/roles/', {}, {});
}

