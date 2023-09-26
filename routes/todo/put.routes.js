const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /todo/:id
 * method: PUT
 * description: update a todo
 * access: private
 * @param {number} id | id of the todo passed in the url
 * @param {string} title | title of the todo optional
 * @param {string} content | content of the todo optional
 * @param {boolean} isDone | is the todo done optional
 * @returns {object} message
 */
router.put('/todo/:id', validate([
    validator.check('title').optional().isLength({ min: 1 }),
    validator.check('content').optional().isLength({ min: 1 }),
    validator.check('isDone').optional().isBoolean()
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the todo id
    const todoId = req.params.id;

    // get the title and content
    const { title, content, isDone } = req.body;

    // get the todo
    const todo = await prisma.todo.findUnique({
        where: {
            id: todoId,
            userId: id
        }
    });

    // update the todo
    await prisma.todo.update({
        where: {
            id: todoId,
            userId: id
        },
        data: {
            title: title || todo.title,
            content: content || todo.content,
            isDone: isDone || todo.isDone
        }
    });

    // return a message
    res.status(200).json({
        message: `Todo ${todoId} updated successfully`
    });
});

module.exports = router;