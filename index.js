const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const logger = require('./middlewares/logger');
const config = require('./config.json');

const routers = [
    require('./routes/auth/login/post.routes'),
    require('./routes/auth/register/post.routes'),
    require('./routes/checkList/delete.routes'),
    require('./routes/checkList/get.routes'),
    require('./routes/checkList/post.routes'),
    require('./routes/checkList/put.routes'),
    require('./routes/main/get.routes'),
    require('./routes/task/delete.routes'),
    require('./routes/task/get.routes'),
    require('./routes/task/post.routes'),
    require('./routes/task/put.routes'),
    require('./routes/user/delete.routes')
];

// load middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger.logger);

// set ejs view engine
app.set('view engine', 'ejs');

const publicPath = path.join(process.cwd(), 'public');
if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
}

// set favicon for all requests
app.get('/favicon.ico', (req, res) => {
    const faviconPath = path.join(publicPath, 'images/favicon.ico');
    if (fs.existsSync(faviconPath)) {
        return res.sendFile(faviconPath);
    }

    return res.status(204).end();
});

// load routes
routers.forEach((router) => app.use(router));

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});

// listen on port
app.listen(parseInt(config.PORT), () => {
    console.log(`API listening on http://localhost:${parseInt(config.PORT)}\nYou can access the API documentation on the root path.`);
});
