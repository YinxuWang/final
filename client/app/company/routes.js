export default function routes($stateProvider, appConfig) {
  'ngInject';

  $stateProvider
    .state('company', {
      url: '/company',
      template: '<ui-view></ui-view>',
      authenticate: appConfig.ROLE.MANAGER,
      controller: function ($state) {
        'ngInject';
        $state.go('company.general')
      },
      abstract: true
    })
    .state('company.general', {
      url: '/general',
      template:require('./general/general.html')
    })
}
