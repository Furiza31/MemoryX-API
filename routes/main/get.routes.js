const express = require('express');
const router = express.Router();
const docsLoader = require('../../loader/docs.js');
const path = require('path');
const docs = docsLoader.init(path.join(__dirname, '../'))

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

    if (isLocal) {
        res.render('index', { docs });
    } else {
        res.status(200).json({
            available: true,
            message: 'Welcome to MemoryX API'
        });
    }
});

module.exports = router;