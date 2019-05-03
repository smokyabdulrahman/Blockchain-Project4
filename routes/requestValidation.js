const router = require('express').Router();
const mempoolService = require('../services/mempoolService');
const check = require('express-validator/check');

router.post('/', [
    check('address').isString()
], blockchainService.createBlock);

module.exports = router;