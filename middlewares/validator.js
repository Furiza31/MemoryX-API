const validator = require('express-validator');

// sequential processing, stops running validations chain if the previous one fails.
const validate = validations => {
  return async (req, res, next) => {
    // for each validation, run it and stop if there are errors
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    // if there are no errors, continue
    const errors = validator.validationResult(req);
    if (errors.isEmpty()) return next();
    
    // else return the errors
    res.status(400).json({ errors: errors.array() });
  };
};

module.exports = {
  validate,
  validator
};