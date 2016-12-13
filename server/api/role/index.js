"use strict";

import {Router} from 'express';
import * as controller from './role.controller';
import * as auth from '../../auth/auth.service';
const ROLE = require('../../config/environment/shared').ROLE;

var router = new Router();

router.get('/', auth.hasRole(ROLE.SUPER_ADMIN), controller.index);

module.exports = router;
1
