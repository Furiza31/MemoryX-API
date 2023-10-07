const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /task/:checkListId/:taskId
 * method: DELETE
 * description: delete a task
 * access: private
 * @param {number} checkListId | id of the checklist passed in the url
 * @param {number} itemId | id of the task passed in the url
 * @returns {object} message
 */
router.delete('/task/:checkListId/:taskId',
validate([
    validator.param('checkListId').isInt().toInt(),
    validator.param('taskId').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the checklist id
    const { checkListId, taskId } = req.params;

    // get user id
    const { id } = req.user;

    try {
        // delete the checklist task
        await prisma.task.delete({
            where: {
                id: taskId,
                checkList: {
                    user: {
                        id: id
                    },
                    id: checkListId
                }
            }
        });
    } catch (err) {
        // if an error occured, return an error message
        return res.status(404).json({
            error: 'Check list task not found',
        });
    }

    // return a message
    res.status(200).json({
        message: `Check list task ${taskId} deleted successfully`
    });
});

module.exports = router;