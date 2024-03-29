const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate, validator } = require('../../../middlewares/validator');
const config = require('../../../config.json');
const { prisma } = require('../../../prismaClient.js');

/**
 * path: /auth/register
 * method: POST
 * description: register a new user 
 * access: public
 * @param {string} username | username of the user
 * @param {string} email | email of the user
 * @param {string} password | password of the user
 * @returns {object} message, token and user
 */
router.post('/auth/register', validate([
    validator.check('username').isString(),
    validator.check('email').isEmail(),
    validator.check('password').isLength({ min: 5 })
]),
async (req, res) => {
    // get the data from the request body
    const { username, email, password } = req.body;

    // check if the email already exists
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    
    // if the email exists, return an error
    if (user) {
        return res.status(400).json({
            error: 'Email already exists',
        });
    }

    // if the email doesn't exist, create a new user
    let hash = await bcrypt.hash(password, parseInt(config.SALT_ROUNDS));
    const newUser = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hash
        }
    });
    
    // create a token
    const token = jwt.sign({ id: newUser.id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    // return the token
    res.status(200).json({
        message: 'Account created successfully',
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        }
    });
});

module.exports = router;