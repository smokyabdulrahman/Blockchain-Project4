const router = require('express').Router();
const blockchainService = require('../services/blockchainService');

router.get('/:blockId', blockchainService.getBlock);
router.post('/', blockchainService.createBlock);

module.exports = router;