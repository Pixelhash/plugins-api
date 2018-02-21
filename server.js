require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./db');
const log = require('./logUtil');

const app = express();
const port = process.env.PORT || 8000;
const hostname = process.env.HOSTNAME || '127.0.0.1';
const apiKey = process.env.API_KEY

const methods = [ "post", "put", "delete" ];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
// Handle API key check
app.use(['/plugins', '/plugins/*'], function(req, res, next) {
    const method = req.method.toLowerCase();
    if (methods.indexOf(method) === -1) {
        return next();
    }
    
    const sentKey = req.get('Api-Key');
    if (sentKey && sentKey === apiKey) {
        next();
    } else {
        res.status(401).json({ status: 'error', message: 'Wrong or missing API key' });
    }
});

require('./app/routes')(app, db);
app.listen(port, () => {
    log.server(`We are live on ${hostname}:${port}`);
});

// Handle unknown routes
app.use(function(req, res) {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

module.exports = app;