const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../../middlewares/auth');
const { validate, validator } = require('../../../middlewares/validator');
const { prisma } = require('../../../prismaClient.js');

/**
 * path: /checklist/:checkListId/item/:itemId
 * method: DELETE
 * description: delete a checklist item
 * access: private
 * @param {number} checkListId | id of the checklist passed in the url
 * @param {number} itemId | id of the item passed in the url
 * @returns {object} message
 */
router.delete('/checklist/:checkListId/item/:itemId',
validate([
    validator.param('checkListId').isInt().toInt(),
    validator.param('itemId').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the checklist id
    const { checkListId, itemId } = req.params;

    // get user id
    const { id } = req.user;

    // delete the checklist item
    await prisma.checkListItem.delete({
        where: {
            id: itemId,
            checkList: {
                userId: id
            }
        }
    });

    // return a message
    res.status(200).json({
        message: `Check list ${checkListId} deleted successfully`
    });
});

module.exports = router;