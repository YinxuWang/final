import {Role} from '../../sqldb';
import * as RespError from '../../components/respError';

export function index(req, res, next) {
  return Role.findAll(
    {
      attributes: [
        'id', 'name'
      ]
    })
    .then(roles=> {
      res.status(200).json(roles)
    })
    .catch(RespError.handleError(res))
}

