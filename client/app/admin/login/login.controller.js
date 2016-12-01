'use strict';

export default class AdminLoginController {
  user = {
    phone: '13333333333',
    password: 'test'
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
          console.log('success');
          debugger;
          // Logged in, redirect to home
          this.$state.go('main');
        })
        .catch(err => {
          console.log('fail')
          debugger;
          this.errors.login = err.message;
        });
    }
  }
}
