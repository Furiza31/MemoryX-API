const express = require('express')
const router = express.Router()
const validator = require('express-validator')
const Database = require('../database')
const chalk = require('chalk')
const config = require('../config.json')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const log = console.log

router.post('/authentification/signup',
  [
    validator.check('username').isString(),
    validator.check('email').isEmail(),
    validator.check('password').isLength({ min: 5 })
  ],
  (req, res) => {
    const { username, email, password } = req.body
    const db = Database.getInstance()
    // Vérifiez que le nom d'utilisateur n'est pas déjà utilisé
    db.connect().then(() => {
      db.query(`SELECT * FROM users WHERE email = '${email}'`).then((users) => {
        if (users.length > 0) {
          return res.status(409).json({ error: 'Username already used' })
        }
        // Cryptez le mot de passe
        bcrypt.hash(password, config.saltRounds).then((hash) => {
          // Ajoutez le nouvel utilisateur à la liste
          db.query(`INSERT INTO users (username, email, password) VALUES ('${username}', ${email},'${hash}')`).then(() => {
            // Créez un jeton d'authentification et renvoyez-le au client
            const token = jwt.sign({ email }, config.secretKey, { expiresIn: '1h' })
            res.status(200).json({ message: 'User created', token })
          }).catch((err) => {
            res.status(500).json({ error: 'Internal server error' })
            log(chalk.red(err))
          })
        })
      }).catch((err) => {
        res.status(500).json({ error: 'Internal server error' })
        log(chalk.red(err))
      })
    }).catch((err) => {
      res.status(500).json({ error: 'Internal server error' })
      log(chalk.red(err))
    })
  })

// Endpoint pour la connexion d'un utilisateur
router.post('/authentification/login',
  [
    validator.check('email').isEmail(),
    validator.check('password').isLength({ min: 5 })
  ],
  (req, res) => {
    const { email, password } = req.body
    const db = Database.getInstance()

    db.connect().then(() => {
      db.query(`SELECT * FROM users WHERE email = '${email}'`).then((users) => {
        if (users.length === 0) {
          return res.status(404).json({ error: 'User not found' })
        }
        const user = users[0]
        // Vérifiez que le mot de passe correspond à celui stocké
        bcrypt.compare(password, user.password).then((match) => {
          if (!match) {
            return res.status(401).json({ error: 'Invalid password' })
          }
          // Créez un jeton d'authentification et renvoyez-le au client
          const token = jwt.sign({ email }, config.secretKey, { expiresIn: '1h' })
          res.status(200).json({ message: 'Login successful', token })
        })
      }).catch((err) => {
        res.status(500).json({ error: 'Internal server error' })
        log(chalk.red(err))
      })
    }).catch((err) => {
      res.status(500).json({ error: 'Internal server error' })
      log(chalk.red(err))
    })
  })

// Endpoint pour la déconnexion d'un utilisateur
router.post('/authentification/logout',
  [
    validator.check('token').isString()
  ],
  (req, res) => {
    const { token } = req.body
    // Supprimez le jeton d'authentification du client
    jwt.destroy(token)
    res.status(200).json({ message: 'Logout successful' })
  })

// Endpoint pour la vérification de l'état de la session utilisateur
router.post('/authentification/check-session',
  [
    validator.check('token').isString()
  ]
  ,
  (req, res) => {
    const { token } = req.body
    // Vérifiez que le jeton d'authentification est valide
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' })
      }
      res.status(200).json({ message: 'Valid token' })
    })
  })

module.exports = router
