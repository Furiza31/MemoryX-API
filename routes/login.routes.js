const express = require('express')
const router = express.Router()
const validator = require('express-validator')

router.post('/login', [
  validator.check('email').isEmail(),
  validator.check('password').isLength({ min: 5 })
], (req, res) => {
  res.status(200).json({ message: 'Connected!' })
})

module.exports = router
