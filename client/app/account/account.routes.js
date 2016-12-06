'use strict';


export default function routes($stateProvider, appConfig) {
  'ngInject';

  $stateProvider
    .state('login', {
      url: '/login',
      template: require('./login/login.html'),
      controller: "LoginController",
      controllerAs: "vm"
    })
    .state('register', {
      url: '/register',
      template: require('./register/register.html'),
      controller: "RegisterController",
      controllerAs: "vm"
    })
    .state('forgetPass', {
      url: '/register',
      template: require('./password/forgetPassword.html'),
      controller: 'ForgetPasswordController',
      controllerAs: "vm"
    })
}
