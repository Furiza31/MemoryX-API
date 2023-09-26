const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /todo
 * method: GET
 * description: get all todos
 * access: private
 * @returns {object} message and a list of todos
 */
router.get('/todo',
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get all todos
    const todos = await prisma.todo.findMany({
        where: {
            userId: id
        }
    });

    // return the todos
    res.status(200).json({
        message: 'Todos fetched successfully',
        todos
    });
});

module.exports = router;