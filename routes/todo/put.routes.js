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
 * @returns {object} message
 */
router.put('/todo/:id', validate([
    validator.check('title').isLength({ min: 1 }),
    validator.check('content').isLength({ min: 1 }),
    validator.check('isDone').isBoolean()
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the todo id
    const todoId = req.params.id;

    // get the title and content
    const { title, content, isDone } = req.body;

    // update the todo
    await prisma.todo.update({
        where: {
            id: todoId,
            userId: id
        },
        data: {
            title,
            content,
            isDone
        }
    });

    // return a message
    res.status(200).json({
        message: `Todo ${todoId} updated successfully`
    });
});

module.exports = router;