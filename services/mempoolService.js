const Mempool = require('../Mempool').Mempool.instance;
const Errors = require('../helpers/errors');
const validationResult = require('express-validator/check');

exports.addRequestValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.send(422).json({ errors: errors.array() });
    }

    // everything is fine now!
    const mempoolEntry = Mempool.addValidationRequest(req.body.address, Date.now());

    res.json(mempoolEntry);
}

exports.validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        res.send(422).json({ errors: errors.array() });
    }

    const entry = Mempool.getMempoolEntry(req.body.address);
    if (!entry) {
        res.send(400).json({ errors: {
                "message": Errors.messages.mempoolEntryNotFound
            }
        });
    }

    if(!entry.verifyTimeLeft()) {
        res.send(400).json({ errors: {
            "message": Errors.messages.mempoolEntryWindowExpired
            }
        });
    }

    // everything is fine now!
    const confirmedEntry = Mempool.validateRequest(req.body.address, req.body.signature);
    if(!confirmedEntry) {
        res.send(400).json({ errors: {
            "message": Errors.messages.signatureInvalid
            }
        });
    }

    res.send(200).json(confirmedEntry);
}