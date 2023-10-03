const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /checklist/:id
 * method: PUT
 * description: update a checklist name
 * access: private
 * @param {number} id | id of the checklist passed in the url
 * @param {string} name | name of the checklist optional
 * @returns {object} message
 */
router.put('/checklist/:id', validate([
    validator.check('name').optional().isLength({ min: 1 }),
]),
isAuthentificated,
async (req, res) => {
    // get the checklist id
    const checkListId = parseInt(req.params.id);

    // get the name from the request body
    const { name } = req.body;

    // get the checklist
    const checkList = await prisma.checkList.findUnique({
        where: {
            id: checkListId
        }
    });

    // check if the checklist exist
    if (!checkList) {
        return res.status(404).json({
            message: `Check list ${checkListId} not found`
        });
    }

    // update the checklist
    await prisma.checkList.update({
        where: {
            id: checkListId
        },
        data: {
            name
        }
    });

    // return a message
    res.status(200).json({
        message: `CheckList ${checkListId} updated successfully`
    });
});

module.exports = router;