const blockchain = require('../BlockChain');
const blockchainInstance = new blockchain.Blockchain();
const MempoolClass = require('../Mempool').Mempool;
const MempoolInstance = new MempoolClass();
const block = require('../Block');
const errors = require('../helpers/errors');

exports.getBlock = function(req, res, next) {
    blockchainInstance.getBlock(req.params.blockId)
        .then(data => {
            data = decodeStarStroy(JSON.parse(data));
            res.send(data);
        })
        .catch(err => next(new Error(errors.messages.blockNotFound)));
}

exports.getByHash = function(req, res, next) {
    const hash = req.params.hash;
    
    blockchainInstance.getByHash(hash)
        .then(data => {
            if(data.length === 0) {
                res.send({});
            } else {
                data[0] = decodeStarStroy(data[0]);
                res.send(data[0]);
            }
        })
        .catch(err => next(err));
}

exports.getByAddress = function(req, res, next) {
    const address = req.params.address;
    blockchainInstance.getByAddress(address)
        .then(data => {
            data = data.map(entry => decodeStarStroy(entry));
            res.send(data);
        })
        .catch(err => next(err));
}

exports.createBlock = function(req, res, next) {    
    const {address, star} = req.body;
    const canAddStar = MempoolInstance.canAddStar(address);
    
    if (!canAddStar) {
        next(new Error(errors.messages.addressNotConfirmed));
    }
    
    req.body.star.story = Buffer.from(req.body.star.story).toString('hex');

    const newBlock = new block.Block(req.body);
    blockchainInstance.addBlock(newBlock)
        .then(data => {
            MempoolInstance.deleteConfirmedEntry(address);
            res.send(data);
        })
        .catch(err => next(new Error(errors.messages.blockNotValid)));
}

function decodeStarStroy(block) {
    if (block.body.star) {
        if (block.body.star.story) {
            block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString();
        }
    }
    return block;
}