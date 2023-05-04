const fs = require('fs')
const chalk = require('chalk')
const log = console.log

const createRouteFile = (routeName) => {
  const filePath = `./routes/${routeName}.routes.js`
  const fileContent = `const express = require('express')
const router = express.Router()

router.get('/${routeName}', (req, res) => {
  res.status(200).json({ message: 'Connected!' })
})

module.exports = router
`

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      log(chalk.red(err))
    } else {
      log(`Route created ${chalk.green('successfully')} at ${chalk.blue(filePath)}`)
    }
  })
}

// Récupérez le nom de la route à créer depuis les arguments de ligne de commande
const args = process.argv.slice(2)
const routeName = args[0]

// Vérifiez que le nom de la route a été fourni
if (!routeName) {
  log('Please provide a route name.')
} else {
  createRouteFile(routeName)
}
