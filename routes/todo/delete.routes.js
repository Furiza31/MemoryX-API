const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /todo/:id
 * method: DELETE
 * description: delete a todo
 * access: private
 * @returns {object} message
 */
router.delete('/todo/:id', validate([
    validator.param('id').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the todo id
    const todoId = req.params.id;

    // delete the todo
    await prisma.todo.delete({
        where: {
            id: todoId,
            userId: id
        }
    });

    // return a message
    res.status(200).json({
        message: `Todo ${todoId} deleted successfully`
    });
});

module.exports = router;