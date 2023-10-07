const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { prisma } = require('../../prismaClient.js');
const { validate, validator } = require('../../middlewares/validator');

/**
 * path: /task/:checkListId
 * method: GET
 * description: get all tasks
 * @param {number} checklistId | the checklist id
 * access: private
 * @returns {object} message, checkList and tasks
 */
router.get('/task/:checklistId',
validate([
    validator.param('checklistId').isInt().toInt()
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the checklist id
    const { checklistId } = req.params;

    let tasks = [];
    let checkList = {};
    // get the checklist
    checkList = await prisma.checkList.findUnique({
        where: {
            id: checklistId,
            user: {
                id: id
            }
        }
    });

    // check if the checklist exists
    if (!checkList) {
        return res.status(404).json({
            error: 'Check list items not found'
        });
    }

    // get the checklist tasks
    tasks = await prisma.task.findMany({
        where: {
            checkList: {
                id: checklistId,
                user: {
                    id: id
                }
            }
        }
    });

    // return the list
    res.status(200).json({
        message: 'Check list tasks fetched successfully',
        checkList,
        tasks
    });
});

module.exports = router;