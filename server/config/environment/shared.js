'use strict';

const ROLE = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  MANAGER: 3,
  USER: 4
};

exports = module.exports = {
  // List of user roles
  ROLE: ROLE,
  userRoles: [ROLE.USER, ROLE.MANAGER, ROLE.ADMIN, ROLE.SUPER_ADMIN]
};
