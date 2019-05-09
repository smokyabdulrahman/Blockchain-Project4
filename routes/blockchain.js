const router = require('express').Router();
const blockchainService = require('../services/blockchainService');
const { check } = require('express-validator/check');

router.get('/:blockId', blockchainService.getBlock);
router.post('/', [
    check('address').isString(),
    check('star').isJSON()
], 
blockchainService.createBlock);
router.get('hash::hash', blockchainService.getByHash);

module.exports = router;