const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./loader/routes');
const path = require('path');
const logger = require('./middlewares/logger');
const config = require('./config.json');

// load middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger.logger);

// set ejs view engine
app.set('view engine', 'ejs');

// set static public folder
app.use(express.static(path.join(__dirname, '/public')));

// set favicon for all requests
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/images/favicon.ico'))
});

// load routes
routes.init(app, path.join(__dirname, '/routes'));

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});

// listen on port
app.listen(parseInt(config.PORT), () => {
    console.log(`API listening on http://localhost:${parseInt(config.PORT)}`);
});