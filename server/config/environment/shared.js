'use strict';

const ROLE = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  MANAGER: 3,
  USER: 4
};

const AUDIT_STATUS = {
  PENDING: 1,
  PASS: 2,
  REJECT: 3
};

exports = module.exports = {
  // List of user roles
  ROLE: ROLE,
  AUDIT_STATUS: AUDIT_STATUS,
  userRoles: [ROLE.USER, ROLE.MANAGER, ROLE.ADMIN, ROLE.SUPER_ADMIN]
};
