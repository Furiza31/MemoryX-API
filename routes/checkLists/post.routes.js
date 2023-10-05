const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { validate, validator } = require('../../middlewares/validator');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /checklists
 * method: POST
 * description: create a new checklist
 * access: private
 * @param {string} name | name of the checklist
 * @returns {object} message and checkList
 */
router.post('/checklists', validate([
    validator.check('name').isLength({ min: 1 }),
]),
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // get the data from the request body
    const { name } = req.body;

    // create a new checklist
    const newCheckList = await prisma.checkList.create({
        data: {
            name,
            userId: id
        }
    });

    // return a message
    res.status(200).json({
        message: 'Check list created successfully',
        checkList: newCheckList
    });
});

module.exports = router;