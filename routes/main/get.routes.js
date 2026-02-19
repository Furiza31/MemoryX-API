const express = require('express');
const router = express.Router();
const docsLoader = require('../../loader/docs.js');
const path = require('path');
const fs = require('fs');

let docs = {};
try {
    const routesPath = path.join(process.cwd(), 'routes');
    if (fs.existsSync(routesPath)) {
        docs = docsLoader.init(routesPath);
    }
} catch (error) {
    docs = {};
}

const docsViewPath = path.join(process.cwd(), 'views/index.ejs');
const hasDocsView = fs.existsSync(docsViewPath);

/**
 * path: /
 * method: GET
 * description: Welcome message
 * access: public
 * @returns {object} message and available
 */
router.get('/', async (req, res) => {
    // Get client IP address from request object
    const clientIP = req.ip || req.connection.remoteAddress;

    // List of IP addresses that are considered "local"
    const localIPs = ['127.0.0.1', '::1'];

    // check if the ip is local
    const isLocal = localIPs.includes(clientIP);

    if (isLocal && hasDocsView) {
        return res.render('index', { docs });
    }

    if (isLocal) {
        return res.status(200).json({
            available: true,
            message: 'Welcome to MemoryX API',
            docs
        });
    }

    return res.status(200).json({
        available: true,
        message: 'Welcome to MemoryX API'
    });
});

module.exports = router;
