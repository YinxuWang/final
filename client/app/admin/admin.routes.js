'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider

    .state('login', {
      url:'/admin/login',
      template: require('./login/login.html'),
      controller: "AdminLoginController",
      controllerAs: "vm",
    });
}
