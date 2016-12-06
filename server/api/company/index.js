'use strict';

import {Router} from 'express';
import * as controller from './company.controller';
import * as auth from '../../auth/auth.service';
const ROLE = require('../../config/environment/shared').ROLE;


var router = new Router();
router.get('/audit', auth.hasRole(ROLE.ADMIN), controller.audit);


module.exports = router;
