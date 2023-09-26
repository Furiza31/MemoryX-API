const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /todo
 * method: POST
 * description: create a new todo
 * access: private
 * @returns {object} message
 */
router.post('/todo', validate([
    validator.check('title').isLength({ min: 1 }),
    validator.check('content').isLength({ min: 1 })
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the data from the request body
    const { title, content } = req.body;

    // create a new todo
    const newTodo = await prisma.todo.create({
        data: {
            title: title,
            content: content,
            userId: id
        }
    });

    // return a message
    res.status(200).json({
        message: 'Todo created successfully',
        todo: newTodo
    });
});

module.exports = router;