'use strict';

export default class LoginController {
  user = {
    phone: 'test@taobao.com',
    password: 'test1'
  };
  errors = {
    login: undefined
  };
  submitted = false;

  constructor(Auth, $state) {
    'ngInject';
    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: "",
        phone: this.user.phone,
        password: this.user.password
      })
        .then(() => {
          this.$state.go('admin.company.list');
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
