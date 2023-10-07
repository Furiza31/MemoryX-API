const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /task/:checkListId
 * method: POST
 * description: create a new checklist task
 * access: private
 * @param {number} checkListId | id of the checklist passed in the url
 * @param {string} name | name of the checklist task
 * @param {string} description | description of the checklist task (optional)
 * @param {date} date | date of the checklist task
 * @returns {object} message and task
 */
router.post('/task/:checkListId',
validate([
    validator.check('name').isLength({ min: 1 }),
    validator.check('description').optional().isLength({ min: 1 }),
    validator.check('date').isDate().toDate(),
    validator.param('checkListId').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the checklist id
    const { checkListId } = req.params;

    // get the checklist
    const checkList = await prisma.checkList.findUnique({
        where: {
            id: checkListId,
            userId: id
        }
    });

    // check if the checklist exist
    if (!checkList) {
        return res.status(404).json({
            error: `Check list ${checkListId} not found`
        });
    }

    // get the checklist task data
    const { name, description, date } = req.body;

    // create the checklist task
    const task = await prisma.task.create({
        data: {
            name,
            description: description || "",
            date,
            checkListId
        }
    });

    // return a message and the checklist task
    res.status(200).json({
        message: `Check list item ${task.id} created successfully`,
        task
    });
});

module.exports = router;