import angular from 'angular';
import routes from './account.routes';
import login from './login';

export default angular.module('app.account', ['app.auth', 'ui.router', login])
  .config(routes)
  .name;
