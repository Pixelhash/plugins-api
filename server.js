require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const log = require('./logUtil');

const app = express();
const port = process.env.PORT || 8000;
const hostname = process.env.HOSTNAME || '127.0.0.1';
const apiKey = process.env.API_KEY

app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log.request(`${ip} \t ${req.method} ${req.path}`);
    next();
});
app.route('/plugins/*')
.post(function(req, res, next) {
    checkApiKey(req, res, next);
})
.delete(function(req, res, next) {
    checkApiKey(req, res, next);
})
.put(function(req, res, next) {
    checkApiKey(req, res, next);
});

require('./app/routes')(app, db);
app.listen(port, () => {
    log.server(`We are live on ${hostname}:${port}`);
});

function checkApiKey(req, res, next) {
    const sentKey = req.get('Api-Key');
    if (sentKey === apiKey) {
        next();
    } else {
        res.json({ status: 'error', message: 'Wrong or missing API key' });
    }
}