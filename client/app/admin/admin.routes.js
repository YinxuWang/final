'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider

    .state('admin', {
      url: '/admin',
      template: '<ui-view></ui-view>',
      authenticate: "admin"
    })
    .state('admin.company', {
      url: '/company',
      template: require('./company/company.html'),
      controller: "AdminCompanyController",
      controllerAs: "vm",
      authenticate: "admin"
    })
    .state('admin.user', {
      url: '/user',
      template: require('./user/user.html'),
      controller: "AdminUserController",
      controllerAs: 'vm',
      authenticate: "admin"
    })
    .state("admin.config", {
      url: "/config",
      template: require("./config/config.html"),
      controller: "AdminConfigController",
      controllerAs: "vm",
      authenticate: "admin"
    })
    .state('admin.login', {
      url: '/login',
      template: require('./login/login.html'),
      controller: "AdminLoginController",
      controllerAs: "vm",
      authenticate: "admin"
    })
    .state('admin.role',{
      url:'/role',
      template:require("./role/role.html"),
      controller:"AdminRoleController",
      controllerAs:"vm",
      authenticate: "admin"
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
