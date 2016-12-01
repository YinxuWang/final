'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: '公司管理',
    state: 'admin.company'
  },
    {
      title: "用户管理",
      state: 'admin.user'
    },
    {
      title: "角色管理",
      state: "admin.role"
    }, {
      title: "运行配置",
      state: "admin.config"
    }];

  isCollapsed = true;

  constructor(Auth) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
