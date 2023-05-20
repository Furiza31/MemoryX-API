const express = require('express')
const router = express.Router()
const validator = require('express-validator')
const Database = require('../database')
const chalk = require('chalk')
const log = console.log
const { isAuthentificated } = require('./authentification.routes')

router.get('/userInformations/:email', [
  validator.check('email').isEmail().normalizeEmail(),
  isAuthentificated
]
, (req, res) => {
  const { email } = req.params
  const db = Database.getInstance()

  db.connect().then(() => {
    db.query('SELECT * FROM users WHERE email = ?', [email]).then((users) => {
      if (users.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' })
      }
      delete users[0].password
      delete users[0].isAdmin
      res.status(200).json({ message: 'Utilisateur trouvé', user: users[0] })
    }).catch((err) => {
      res.status(500).json({ error: 'Erreur interne du serveur' })
      log(chalk.red(err))
    })
  }).catch((err) => {
    res.status(500).json({ error: 'Erreur interne du serveur' })
    log(chalk.red(err))
  })
})

module.exports = router
