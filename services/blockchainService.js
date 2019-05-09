let blockchain = require('../BlockChain');
const blockchainInstance = new blockchain.Blockchain();
const block = require('../Block');
const errors = require('../helpers/errors');

exports.getBlock = function(req, res, next) {
    blockchainInstance.getBlock(req.params.blockId)
        .then(data => res.send(data))
        .catch(err => next(new Error(errors.messages.blockNotFound)));
}

exports.createBlock = function(req, res, next) {    
    if (req.body.data === null || req.body.data === undefined || req.body.data === ''){
        next(new Error(errors.messages.blockHasNoData));
    }
    const data = req.body.data;
    const newBlock = new block.Block(data);
    blockchainInstance.addBlock(newBlock)
        .then(data => res.send(data))
        .catch(err => next(new Error(errors.messages.blockNotValid)));
}