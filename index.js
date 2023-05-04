const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
// const sqlite3 = require('sqlite3').verbose()
// const db = new sqlite3.Database('./db/memoryx.db')
const config = require('./config.json')
const fs = require('fs')
const chalk = require('chalk')
const log = console.log

app.use(morgan('dev', ':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(bodyParser.json())

fs.readdirSync('./routes').forEach((file) => {
  log('-'.repeat(50))
  log(`Loading route: ${chalk.blue(file)}`)
  const router = require('./routes/' + file)
  app.use(router)
  // log all routes declared in router
  router.stack.forEach((r) => {
    if (r.route) {
      log(`Route: ${chalk.blue(r.route.stack[0].method.toUpperCase())} -> ${chalk.yellow(r.route.path)}${chalk.gray(' | http://localhost:3000' + r.route.path)}`)
    }
  })
})

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(config.port, () => {
  log(chalk.green(`API listening on http://localhost:${config.port}`))
})
