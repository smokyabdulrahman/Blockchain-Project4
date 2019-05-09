const blockchain = require('../BlockChain');
const blockchainInstance = new blockchain.Blockchain();
const MempoolClass = require('../Mempool').Mempool;
const MempoolInstance = new MempoolClass();
const block = require('../Block');
const errors = require('../helpers/errors');

exports.getBlock = function(req, res, next) {
    blockchainInstance.getBlock(req.params.blockId)
        .then(data => res.send(data))
        .catch(err => next(new Error(errors.messages.blockNotFound)));
}

exports.getByHash = function(req, res, next) {
    const hash = req.params.hash;
    blockchainInstance.getByHash(hash)
        .then(data => res.send(data))
        .catch(err => next(new Error()));
}

exports.createBlock = function(req, res, next) {    
    const {address, star} = req.body;
    const canAddStar = MempoolInstance.canAddStar(address);
    
    if (!canAddStar) {
        next(new Error(errors.messages.addressNotConfirmed));
    }
    
    const newBlock = new block.Block(star);
    blockchainInstance.addBlock(newBlock)
        .then(data => {
            MempoolInstance.deleteConfirmedEntry(address);
            res.send(data);
        })
        .catch(err => next(new Error(errors.messages.blockNotValid)));
}