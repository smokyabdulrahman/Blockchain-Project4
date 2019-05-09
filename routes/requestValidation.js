const router = require('express').Router();
const mempoolService = require('../services/mempoolService');
const { check } = require('express-validator/check');

router.post('/', [
    check('address').isString()
], mempoolService.addRequestValidation);

router.post('/validate', [
    check('address').isString(),
    check('signature').isString()
], mempoolService.validateRequest);

module.exports = router;