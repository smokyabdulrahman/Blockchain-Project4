const router = require('express').Router();
const blockchainService = require('../services/blockchainService');
const { check } = require('express-validator/check');

router.get('/hash::hash', blockchainService.getByHash);
router.get('/address::address', blockchainService.getByAddress);
router.get('/:blockId', blockchainService.getBlock);
router.post('/', [
    check('address').isString(),
    check('star').isJSON()
], 
blockchainService.createBlock);

module.exports = router;