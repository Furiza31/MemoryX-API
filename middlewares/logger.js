const chalk = require('chalk');

const logger = (req, res, next) => {
    // Record the start time of the request processing
    req.startTime = new Date().getTime();

    // Register a listener for the 'finish' event on the response
    res.on('finish', () => {
        // Construct and display the log message using chalk colors
        console.log(
            `${chalk.green(req.method)} ${chalk.blue(req.originalUrl)} [${chalk.yellow(res.statusCode)}] - ${chalk.red(req.ip)} - ${chalk.magenta(req.get('User-Agent'))} - ${chalk.cyan(new Date().getTime() - req.startTime)}ms`
        );

        // Check if the request body is present and not empty
        if (req.body && Object.keys(req.body).length > 0) {
            // Display the request body in gray color
            console.log(chalk.gray(JSON.stringify(req.body)));
        }
    });

    // Continue to the next middleware or route handler
    next();
};

module.exports = {
    logger
}
