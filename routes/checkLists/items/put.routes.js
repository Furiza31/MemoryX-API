const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../../../middlewares/auth');
const { validate, validator } = require('../../../../middlewares/validator');
const { prisma } = require('../../../../prismaClient.js');

/**
 * path: /checklist/:checkListId/item/:itemId
 * method: PUT
 * description: update a checklist item
 * access: private
 * @param {number} checkListId | id of the checklist passed in the url
 * @param {number} itemId | id of the checklist item passed in the url
 * @param {string} name | name of the checklist item (optional)
 * @param {string} description | description of the checklist item (optional)
 * @param {date} date | date of the checklist item (optional)
 * @param {boolean} done | done status of the checklist item (optional)
 * @param {date} date | date of the checklist item (optional)
 * @returns {object} message
 */
router.put('/checklist/:checkListId/item/:itemId',
validate([
    validator.check('name').optional().isLength({ min: 1 }),
    validator.check('description').optional().isLength({ min: 1 }),
    validator.check('date').optional().isDate(),
    validator.check('done').optional().isBoolean(),
    validator.param('checkListId').isInt().toInt(),
    validator.param('itemId').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the checklist id
    const { checkListId, itemId } = req.params;

    // get the checklist item
    const checkListItem = await prisma.checkListItem.findUnique({
        where: {
            id: itemId,
            checkList: {
                id: checkListId,
                user: {
                    id
                }
            }
        }
    });

    // check if the checklist item exist
    if (!checkListItem) {
        return res.status(404).json({
            message: `Check list item ${itemId} not found`
        });
    }

    // get the checklist item data
    const { name, description, done, date } = req.body;

    // update the checklist item
    await prisma.checkListItem.update({
        where: {
            id: itemId
        },
        data: {
            name: name || checkListItem.name,
            description : description || checkListItem.description,
            done : done || checkListItem.done,
            date : date || checkListItem.date
        }
    });

    // return a message
    res.status(200).json({
        message: `Check list item ${itemId} updated successfully`,
    });
});

module.exports = router;