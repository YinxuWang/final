"use strict";

export default class AdminUserController {

  roleList = [];
  // Config Pagination Grid
  gridConfig = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    useExternalPagination: true,
    useExternalSorting: true,
    columnDefs: [
      {name: '用户ID', field: 'id'},
      {name: '用户名称', field: "name"},
      {name: '所属公司', field: "Company.name"},
      {name: '角色', field: 'Role.name'},
      {name: '邮箱', field: 'mail'},
      {name: '联系方式', field: "phone"},
    ],
    totalItems: 100
  };

  constructor($scope, Role, User) {
    'ngInject';

    let vm = this;

    vm.Role = Role;
    vm.User = User;

    vm.gridConfig.onRegisterApi = function (gridApi) {
      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
        vm.searchParams.pageNumber = newPage;
        vm.searchParams.pageSize = pageSize;
        vm.getPage();
      });
    };
    vm.roleList = vm.Role.query();
    vm.getPage();
  }

  getPage() {
    var userList = this.User.query();
    this.gridConfig.data = userList;
    this.gridConfig.totalItems = userList.length;
  }
}

