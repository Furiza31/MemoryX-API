const Database = require('../database')
const fs = require('fs')
const chalk = require('chalk')
const log = console.log
const path = require('path')

// load database
fs.existsSync('./memoryx.db') || fs.writeFileSync(path.join(__dirname, '/memoryx.db'), '')
const db = Database.getInstance()

const tablesInit = () => {
  db.connect().then(() => {
  // create default tables
    const files = fs.readdirSync(path.join(__dirname, '/tables'))
    const queries = []

    files.forEach((file) => {
      const fileContent = fs.readFileSync(path.join(__dirname, '/tables/' + file), 'utf8')
      const fileQueries = fileContent.split(';').filter((query) => query.trim() !== '')
      queries.push(...fileQueries)
      log(chalk.blue(`Loading table: ${file.split('.')[0]}`))
    })

    return queries.reduce((previousPromise, query) => {
      return previousPromise.then(() => {
        return db.query(query).catch((err) => {
          log(chalk.red(err))
        })
      })
    }, Promise.resolve())
  }).then(() => {
    log(chalk.green('Tables initialized successfully!'))
  }).catch((err) => {
    log(chalk.red(err))
    db.disconnect()
  })
}

const init = () => {
  tablesInit()
}

module.exports = {
  init
}
