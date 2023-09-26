const express = require('express');
const router = express.Router();

/**
 * path: /
 * method: GET
 * description: Welcome message
 * access: public
 * @returns {object} message and available
 */
router.get('/', (req, res) => {
    res.status(200).json({
        available: true,
        message: 'Welcome to MemoryX API'
    });
});

module.exports = router;