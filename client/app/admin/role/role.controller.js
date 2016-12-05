"use strict";

export default class AdminRoleController {
  gridConfig = {
    columnDefs: [
      {name: '角色Id', field: 'id', width: "10%"},
      {name: '角色名称', field: "name"},
      {name: '角色描述', field: "desc"},
      {name: '操作', field: "operation"}
    ]
  };

  constructor(Role) {
    'ngInject';

    this.gridConfig.data = Role.query();
  }
}
