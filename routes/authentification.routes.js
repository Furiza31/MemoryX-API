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
      db.query('SELECT * FROM users WHERE email = ?', [email]).then((users) => {
        if (users.length > 0) {
          return res.status(409).json({ error: 'Email déjà utilisé' })
        }
        // Cryptez le mot de passe
        bcrypt.hash(password, config.saltRounds).then((hash) => {
          // Ajoutez le nouvel utilisateur à la liste
          db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]).then(() => {
            // Créez un jeton d'authentification et renvoyez-le au client
            const token = jwt.sign({ email }, config.secretKey, { expiresIn: '30m' })
            res.status(200).json({ message: 'Compte créer avec succès', token })
          }).catch((err) => {
            res.status(500).json({ error: 'Erreur interne du serveur' })
            log(chalk.red(err))
          })
        })
      }).catch((err) => {
        res.status(500).json({ error: 'Erreur interne du serveur' })
        log(chalk.red(err))
      })
    }).catch((err) => {
      res.status(500).json({ error: 'Erreur interne du serveur' })
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
      db.query('SELECT * FROM users WHERE email = ?', [email]).then((users) => {
        if (users.length === 0) {
          return res.status(404).json({ error: 'Informations invalide' })
        }
        const user = users[0]
        // Vérifiez que le mot de passe correspond à celui stocké
        bcrypt.compare(password, user.password).then((match) => {
          if (!match) {
            return res.status(401).json({ error: 'Informations invalide' })
          }
          // Créez un jeton d'authentification et renvoyez-le au client
          const token = jwt.sign({ email }, config.secretKey, { expiresIn: '30m' })
          res.status(200).json({ message: 'Connexion réussie', token })
        })
      }).catch((err) => {
        res.status(500).json({ error: 'Erreur interne du serveur' })
        log(chalk.red(err))
      })
    }).catch((err) => {
      res.status(500).json({ error: 'Erreur interne du serveur' })
      log(chalk.red(err))
    })
  })

// Midleware pour vérifier le jeton d'authentification
const isAuthentificated = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'Aucun jeton d\'authentification fourni' })
  }
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Jeton d\'authentification invalide' })
    }
    next()
  })
}

module.exports = router
module.exports.isAuthentificated = isAuthentificated
