'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {},
    {
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    });
}
