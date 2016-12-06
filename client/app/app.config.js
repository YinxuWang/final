'use strict';

export function routeConfig($urlRouterProvider, $locationProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/admin/login');

  $locationProvider.html5Mode(true);
}
