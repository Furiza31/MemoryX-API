const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const config = require('./config.json')
const DatabaseInitializer = require('./database/initializer')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const log = console.log

// load midlewares
app.use(morgan('dev', ':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// load database
DatabaseInitializer.init()

// load all routes
fs.readdirSync(path.join(__dirname, '/routes')).forEach((file) => {
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

// listen on port
app.listen(config.port, () => {
  log(chalk.green(`API listening on http://localhost:${config.port}`))
})
