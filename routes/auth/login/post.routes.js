const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate, validator } = require('../../../middlewares/validator');
const config = require('../../../config.json');
const { prisma } = require('../../../prismaClient.js');

/**
 * path: /auth/login
 * method: POST
 * description: login a user
 * access: public
 * @returns {object} message and token
 */
router.post('/auth/login', validate([
    validator.check('email').isEmail(),
    validator.check('password').isLength({ min: 5 })
]),
async (req, res) => {
    // get the data from the request body
    const { email, password } = req.body;

    // check if the email exists
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    // if the email doesn't exist, return an error
    if (!user) {
        return res.status(404).json({
            error: 'Invalid informations'
        });
    }
    
    // check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);

    // if the password is incorrect, return an error
    if (!validPassword) return res.status(404).json({
        error: 'Invalid informations'
    });

    // create a token
    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '1h' });

    // return the token
    res.status(200).json({
        message: 'Logged in successfully',
        token
    });
});

module.exports = router;