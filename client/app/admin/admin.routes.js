'use strict';


export default function routes($stateProvider, appConfig) {
  'ngInject';

  $stateProvider
    .state('admin', {
      url: '/admin',
      template: '<ui-view></ui-view>',
      // authenticate: appConfig.ROLE.ADMIN,
      // controller: function ($state) {
      //   'ngInject';
      //   $state.go('admin.company.list')
      // }
    })
    .state('admin.company', {
      url: '/company',
      template: "<ui-view></ui-view>",
      authenticate: appConfig.ROLE.ADMIN
    })
    .state('admin.company.audit', {
      url: '/audit',
      template: require("./company/audit/audit.html"),
      controller: "AdminCompanyAuditController",
      controllerAs: "vm",
      // authenticate: appConfig.ROLE.ADMIN
    })
    .state('admin.company.list', {
      url: '/list',
      template: require("./company/list/list.html"),
      controller: "AdminCompanyListController",
      controllerAs: "vm",
      // authenticate: appConfig.ROLE.ADMIN
    })
    .state('admin.user', {
      url: '/user',
      template: require('./user/user.html'),
      controller: "AdminUserController",
      controllerAs: 'vm',
      // authenticate: appConfig.ROLE.ADMIN
    })
    .state("admin.config", {
      url: "/config",
      template: require("./config/config.html"),
      controller: "AdminConfigController",
      controllerAs: "vm",
      // authenticate: appConfig.ROLE.ADMIN
    })
    .state('admin.login', {
      url: '/login',
      template: require('./login/login.html'),
      controller: "AdminLoginController",
      controllerAs: "vm",
    })
    .state('admin.role', {
      url: '/role',
      template: require("./role/role.html"),
      controller: "AdminRoleController",
      controllerAs: "vm",
      // authenticate: appConfig.ROLE.ADMIN
    })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'admin.login',
      template: '',
      controller($state, Auth) {
        'ngInject';

        var referrer = $state.params.referrer || $state.current.referrer || 'main';
        Auth.logout();
        $state.go(referrer);
      }
    });
}
