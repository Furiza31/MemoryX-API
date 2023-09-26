const jwt = require('jsonwebtoken')
const config = require('../config.json')

// Midleware to check if the user is authentificated
const isAuthentificated = (req, res, next) => {
    // Get the token from the header
    const token = req.headers.authorization
    // Check if there is a token
    if (!token) {
        return res.status(401).json({ error: 'No token provided', invalidToken: true })
    }
    // Verify the token
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token', invalidToken: true })
        }
        req.user = decoded
        next()
    })
}

module.exports.isAuthentificated = isAuthentificated
