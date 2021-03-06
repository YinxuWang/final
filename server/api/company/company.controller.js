import {Company} from '../../sqldb';
import * as RespError from '../../components/respError';

export function audit(req, res, next) {
  return Company.findAll(
    {
      attributes: [
        'seq', 'name', 'nickname', 'status', 'created_at', 'manager'
      ]
    })
    .then(roles=> {
      res.status(200).json(roles)
    })
    .catch(RespError.handleError(res))
}
