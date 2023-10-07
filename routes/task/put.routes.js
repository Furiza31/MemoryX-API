const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /task/:checkListId/:taskId
 * method: PUT
 * description: update a checklist task
 * access: private
 * @param {number} checkListId | id of the checklist passed in the url
 * @param {number} taskId | id of the checklist task passed in the url
 * @param {string} name | name of the checklist task (optional)
 * @param {string} description | description of the checklist task (optional)
 * @param {date} date | date of the checklist task (optional)
 * @param {boolean} done | done status of the checklist task (optional)
 * @param {date} date | date of the checklist task (optional)
 * @returns {object} message
 */
router.put('/task/:checkListId/:taskId',
validate([
    validator.check('name').optional().isLength({ min: 1 }),
    validator.check('description').optional().isLength({ min: 1 }),
    validator.check('date').optional().isDate().toDate(),
    validator.check('done').optional().isBoolean(),
    validator.param('checkListId').isInt().toInt(),
    validator.param('taskId').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the checklist id
    const { checkListId, taskId } = req.params;

    // get the checklist task
    const task = await prisma.task.findUnique({
        where: {
            id: taskId,
            checkList: {
                id: checkListId,
                user: {
                    id
                }
            }
        }
    });

    // check if the checklist task exist
    if (!task) {
        return res.status(404).json({
            error: `Check list task ${taskId} not found`
        });
    }

    // get the checklist task data
    const { name, description, done, date } = req.body;

    await prisma.task.update({
        where: {
            id: taskId
        },
        data: {
            name: name || task.name,
            description : description || task.description,
            done : done || task.done,
            date : date || task.date
        }
    });

    // return a message
    res.status(200).json({
        message: `Check list task ${taskId} updated successfully`,
    });
});

module.exports = router;