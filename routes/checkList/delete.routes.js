const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /checklists/:checkListId
 * method: DELETE
 * description: delete a checklist
 * access: private
 * @param {number} checkListId | id of the checklist passed in the url
 * @returns {object} message
 */
router.delete('/checklist/:checkListId', validate([
    validator.param('checkListId').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the checklist id
    const { checkListId } = req.params;

    // get user id
    const { id } = req.user;

    try {
        // delete the checklist
        await prisma.checkList.delete({
            where: {
                id: checkListId,
                user: {
                    id: id
                }
            }
        });
    } catch (err) {
        // if an error occured, return an error message
        return res.status(404).json({
            error: 'Check list not found',
        });
    }

    // return a message
    res.status(200).json({
        message: `Check list ${checkListId} deleted successfully`
    });
});

module.exports = router;