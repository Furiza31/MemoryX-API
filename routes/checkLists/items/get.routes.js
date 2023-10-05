const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../../middlewares/auth');
const { prisma } = require('../../../prismaClient.js');
const { validate, validator } = require('../../../middlewares/validator');

/**
 * path: /checklist/:checklistId/items
 * method: GET
 * description: get all checklist items
 * @param {number} checklistId | the checklist id
 * access: private
 * @returns {object} message, checkList and checkListItems
 */
router.get('/checklist/:checklistId/items',
validate([
    validator.param('checklistId').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the checklist id
    const { checklistId } = req.params;

    // get the checklist items
    const checkListItems = await prisma.Item.findMany({
        where: {
            checkList: {
                id: checklistId,
                userId: id
            }
        }
    });

    // return the list
    res.status(200).json({
        message: 'Check list items fetched successfully',
        checkList,
        checkListItems
    });
});

module.exports = router;