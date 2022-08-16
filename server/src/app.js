const bodyParser = require('body-parser');
const express = require('express');
const router = require('./routes/router');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '1000kb'}));
app.use(cors());
app.use(router);

module.exports = app;
