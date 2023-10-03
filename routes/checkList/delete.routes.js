const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /checklist/:id
 * method: DELETE
 * description: delete a checklist
 * access: private
 * @param {number} id | id of the checklist passed in the url
 * @returns {object} message
 */
router.delete('/checklist/:id', validate([
    validator.param('id').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the checklist id
    const checkListId = req.params.id;

    // delete the todo
    await prisma.checkList.delete({
        where: {
            id: checkListId
        }
    });

    // return a message
    res.status(200).json({
        message: `Check list ${checkListId} deleted successfully`
    });
});

module.exports = router;