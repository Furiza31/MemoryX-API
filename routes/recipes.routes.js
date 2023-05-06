const express = require('express')
const router = express.Router()
const validator = require('express-validator')
const chalk = require('chalk')
const { searchRecipes, MarmitonQueryBuilder, RECIPE_PRICE, RECIPE_DIFFICULTY, RECIPE_TYPE } = require('marmiton-api')
const qb = new MarmitonQueryBuilder()

router.get('/recipes/:search/:difficulty/:price/:type',
  [
    validator.param('search').isString(),
    validator.param('difficulty').isString(),
    validator.param('price').isString()
  ],
  async (req, res) => {
    const difficulty = getDifficulty(req.params.difficulty)
    const price = getPrice(req.params.price)
    const type = getType(req.params.type)
    const query = qb
      .withTitleContaining(req.params.search)
      .withPrice(price)
      .withDifficulty(difficulty)
      .withType(type)
      .withoutOven()
      .build()
    searchRecipes(query).then((recipes) => {
      res.status(200).json(recipes)
    }).catch((err) => {
      console.log(chalk.red(err))
      res.status(400).json(err)
    })
  })

function getDifficulty (params) {
  switch (params) {
    case 'very-easy':
      return RECIPE_DIFFICULTY.VERY_EASY
    case 'easy':
      return RECIPE_DIFFICULTY.EASY
    case 'medium':
      return RECIPE_DIFFICULTY.MEDIUM
    case 'hard':
      return RECIPE_DIFFICULTY.HARD
    default:
      return RECIPE_DIFFICULTY.EASY
  }
}

function getPrice (params) {
  switch (params) {
    case 'cheap':
      return RECIPE_PRICE.CHEAP
    case 'medium':
      return RECIPE_PRICE.MEDIUM
    case 'expensive':
      return RECIPE_PRICE.EXPENSIVE
    default:
      return RECIPE_PRICE.CHEAP
  }
}

function getType (params) {
  switch (params) {
    case 'advice':
      return RECIPE_TYPE.ADVICE
    case 'dessert':
      return RECIPE_TYPE.DESSERT
    case 'side-dish':
      return RECIPE_TYPE.SIDE_DISH
    case 'beverage':
      return RECIPE_TYPE.BEVERAGE
    case 'main-course':
      return RECIPE_TYPE.MAIN_COURSE
    case 'starter':
      return RECIPE_TYPE.STARTER
    case 'candy':
      return RECIPE_TYPE.CANDY
    case 'sauce':
      return RECIPE_TYPE.SAUCE
    default:
      return RECIPE_TYPE.MAIN_COURSE
  }
}

module.exports = router
