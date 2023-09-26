const express = require('express');
const router = express.Router();
const { isAuthentificated } = require('../../middlewares/auth');
const { prisma } = require('../../prismaClient.js');

/**
 * path: /user
 * method: DELETE
 * description: delete user
 * access: private
 * @returns {object} message
 */
router.delete('/user',
isAuthentificated,
async (req, res) => {
    // get the user id
    const { id } = req.user;

    // delete the user
    await prisma.user.delete({
        where: {
            id: id
        }
    });

    // return a success message
    res.status(200).json({
        message: 'User deleted successfully'
    });
});

module.exports = router;