const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /checklist
 * method: GET
 * description: get all checklist of a user
 * access: private
 * @returns {object} message and a list of checklist
 */
router.get('/checklist',
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get all lists
    const checkLists = await prisma.checkList.findMany({
        where: {
            userId: id
        }
    });

    // return the list
    res.status(200).json({
        message: 'Check lists fetched successfully',
        checkLists
    });
});

module.exports = router;