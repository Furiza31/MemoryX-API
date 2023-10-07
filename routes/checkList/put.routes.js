const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /checklists/:checkListId
 * method: PUT
 * description: update a checklist name
 * access: private
 * @param {number} checkListId | id of the checklist passed in the url
 * @param {string} name | name of the checklist optional
 * @returns {object} message
 */
router.put('/checklist/:checkListId', validate([
    validator.check('name').optional().isLength({ min: 1 }),
    validator.param('checkListId').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the checklist id
    const { checkListId } = req.params;

    // get user id
    const { id } = req.user;

    // get the name from the request body
    const { name } = req.body;

    try {
        // update the checklist
        await prisma.checkList.update({
            where: {
                id: checkListId,
                user: {
                    id: id
                }
            },
            data: {
                name
            }
        });
    } catch (err) {
        // if an error occured, return an error message
        return res.status(404).json({
            error: `Check list ${checkListId} not found`,
        });
    }

    // return a message
    res.status(200).json({
        message: `CheckList ${checkListId} updated successfully`
    });
});

module.exports = router;