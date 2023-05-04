const express = require('express')
const router = express.Router()

router.get('/recipes', async (req, res) => {
  res.status(200).json({ message: 'GET /recipes' })
})

module.exports = router
