'use strict';

class _User {
  id = '';
  name = '';
  email = '';
  phone = '';
  role = '';
  $promise = undefined;
}

export function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {
  'ngInject';

  var safeCb = Util.safeCb;
  var currentUser = new _User();
  var userRoles = appConfig.userRoles || [];
  const ROLE = appConfig.ROLE;
  /**
   * Check if userRole is >= role
   * @param {String} userRole - role of current user
   * @param {Number} role - role to check against
   */
  var hasRole = function(userRole, role) {
    return userRoles.indexOf(userRole) >= userRoles.indexOf(role);
  };

  if($cookies.get('token') && $location.path() !== '/logout') {
    currentUser = User.get();
  }

  var Auth = {
    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - function(error, user)
     * @return {Promise}
     */
    login({
      phone,
      email,
      password
    }, callback) {
      return $http.post('/auth/local', {
        phone,
        email,
        password
      })
        .then(res => {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        })
        .then(user => {
          safeCb(callback)(null, user);
          return user;
        })
        .catch(err => {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
    },

    /**
     * Delete access token and user info
     */
    logout() {
      $cookies.remove('token');
      currentUser = new _User();
    },


    /**
     * Gets all available info on a user
     *
     * @param  {Function} [callback] - function(user)
     * @return {Promise}
     */
    getCurrentUser(callback) {
      var value = _.get(currentUser, '$promise') ? currentUser.$promise : currentUser;

      return $q.when(value)
        .then(user => {
          safeCb(callback)(user);
          return user;
        }, () => {
          safeCb(callback)({});
          return {};
        });
    },

    /**
     * Gets all available info on a user
     *
     * @return {Object}
     */
    getCurrentUserSync() {
      return currentUser;
    },

    /**
     * Check if a user is logged in
     *
     * @param  {Function} [callback] - function(is)
     * @return {Promise}
     */
    isLoggedIn(callback) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          let is = _.get(user, 'role');

          safeCb(callback)(is);
          return is;
        });
    },

    /**
     * Check if a user is logged in
     *
     * @return {Bool}
     */
    isLoggedInSync() {
      return !!_.get(currentUser, 'role');
    },

    /**
     * Check if a user has a specified role or higher
     *
     * @param  {Number}     role     - the role to check against
     * @param  {Function} [callback] - function(has)
     * @return {Promise}
     */
    hasRole(role, callback) {
      return Auth.getCurrentUser(undefined)
        .then(user => {
          let has = hasRole(_.get(user, 'role'), role);
          safeCb(callback)(has);
          return has;
        });
    },

    /**
     * Check if a user has a specified role or higher
     *
     * @param  {Number} role - the role to check against
     * @return {Bool}
     */
    hasRoleSync(role) {
      return hasRole(_.get(currentUser, 'role'), role);
    },

    /**
     * Check if a user is an admin
     *   (synchronous|asynchronous)
     *
     * @param  {Function|*} callback - optional, function(is)
     * @return {Bool|Promise}
     */
    isAdmin() {
      return Auth.hasRole(...[].concat.apply([ROLE.ADMIN], arguments));
    },

    /**
     * Check if a user is an admin
     *
     * @return {Bool}
     */
    isAdminSync() {
      return Auth.hasRoleSync(ROLE.ADMIN);
    },

    /**
     * Get auth token
     *
     * @return {String} - a token string used for authenticating
     */
    getToken() {
      return $cookies.get('token');
    }
  };

  return Auth;
}
