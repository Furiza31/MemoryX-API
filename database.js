const sqlite3 = require('sqlite3').verbose()
const chalk = require('chalk')
const log = console.log

class Database {
  /**
   * Constructor
   * @constructor
   * @private
   * @static
   * @description Create an instance of Database
   * @example
   * const db = new Database()
   */
  constructor () {
    if (!Database.instance) {
      Database.instance = this
    }
    return Database.instance
  }

  /**
   * Get the instance of Database
   * @static
   * @description Get the instance of Database
   * @returns {Database} The instance of Database
   * @example
   * const db = Database.getInstance()
   */
  static getInstance () {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  /**
   * Connect to the database
   * @description Connect to the database
   * @example
   * db.connect()
   */
  connect () {
    if (this.db) return Promise.resolve()
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database('./database/memoryx.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          log(chalk.red(err))
          reject(err)
        }
        log(chalk.green('Connected to the memoryx database.'))
        resolve()
      })
    })
  }

  /**
   * Disconnect from the database
   * @description Disconnect from the database
   * @example
   * db.disconnect()
   */
  disconnect () {
    this.db.close((err) => {
      if (err) {
        log(chalk.red(err))
        return
      }
      log(chalk.green('Disconnected from the memoryx database.'))
    })
  }

  /**
   * Execute a query
    * @description Execute a query
    * @param {string} sql - The SQL query
    * @param {Array} params - The parameters of the query
    * @example
    * db.request('SELECT * FROM users WHERE id = :id', { id: 1 })
   * @returns {Promise} The result of the query
   */
  query (sql, params = []) {
    return new Promise((resolve, reject) => {
      const query = this.db.prepare(sql)
      query.all(params, (err, rows) => {
        if (err) {
          log(chalk.red(err))
          reject(err)
        }
        resolve(rows)
      })
    })
  }
}

module.exports = Database
