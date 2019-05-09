const app = require('express')();
const bodyparser = require('body-parser');

// BodyParser Middlewares
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

// Register Blockchain router
app.use('/requestValidation', require('./routes/requestValidation'));
app.use('/message-signature', require('./routes/requestValidation'));
app.use('/block', require('./routes/blockchain'));
app.use('/star', require('./routes/blockchain'));

// Error handling
app.use(function(err, req, res, next) {
    res.status(400).send({
        message: err.message,
        code: 400
    });
});

// Set port
app.set('port', 8000);

// Launch Server
app.listen(app.get('port'), () => console.log(`Server launched at port ${app.get('port')}!`));