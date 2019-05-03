const Mempool = require('../Mempool').Mempool.instance;
const errors = require('../helpers/errors');
const validationResult = require('express-validator/check');

exports.addRequestValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.send(422).json({ errors: errors.array() });
    }

    // everything is fine now!
    
}