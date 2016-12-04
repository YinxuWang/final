'use strict';

export default class AdminLoginController {
  user = {
    phone: '13312341234',
    password: 'test1'
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state) {
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
          this.$state.go('admin.company');
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
