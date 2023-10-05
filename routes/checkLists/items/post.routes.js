const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../../../middlewares/auth');
const { validate, validator } = require('../../../../middlewares/validator');
const { prisma } = require('../../../../prismaClient.js');

/**
 * path: /checklist/:checkListId/item
 * method: POST
 * description: create a new checklist item
 * access: private
 * @param {number} checkListId | id of the checklist passed in the url
 * @param {string} name | name of the checklist item
 * @param {string} description | description of the checklist item (optional)
 * @param {date} date | date of the checklist item
 * @returns {object} message and checkListItem
 */
router.post('/checklist/:checkListId/item',
validate([
    validator.check('name').isLength({ min: 1 }),
    validator.check('description').optional().isLength({ min: 1 }),
    validator.param('date').isDate(),
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
            message: `Check list ${checkListId} not found`
        });
    }

    // get the checklist item data
    const { name, description, date, done } = req.body;

    // create the checklist item
    const checkListItem = await prisma.checkListItem.create({
        data: {
            name,
            description: description || "",
            date,
            checkListId
        }
    });

    // return a message and the checklist item
    res.status(200).json({
        message: `Check list item ${checkListItem.id} created successfully`,
        checkListItem
    });
});

module.exports = router;