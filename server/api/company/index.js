'use strict';

import {Router} from 'express';
import * as controller from './company.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();
router.get('/audit', controller.audit);

module.exports = router;
