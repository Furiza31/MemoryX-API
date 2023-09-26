// Import necessary modules
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const init = (app, routePath) => {
    // Read the contents of the routePath directory
    fs.readdirSync(routePath).forEach((file) => {
        let current = path.join(routePath, file);
        // Check if the current item is a directory
        if (fs.statSync(current).isDirectory()) {
            // If it's a directory, recursively call the init function with the current directory
            init(app, current);
        } else {
            // If it's a file, check if it contains the name "routes.js"
            if (file.toLowerCase().indexOf('routes.js') >= 0) {
                // Extract the route name from the path
                let routeName = routePath.split(path.sep);
                routeName = routeName[routeName.length - 1];
                try {
                    console.log(chalk.yellow('Loading routes') + ' ' + chalk.cyan(`${routeName}`));
                    // Load the route module
                    let router = require(current);
                    // Use the route in the Express application
                    app.use(router);
                    // Display a success message
                    console.log(chalk.green('Routes') + ' ' + chalk.cyan(`${routeName}`) + ' ' + chalk.green('loaded'));
                } catch (error) {
                    // In case of an error while loading the route, display an error message
                    console.log(chalk.red('Error loading routes') + ' ' + chalk.cyan(`${routeName}`));
                    console.log(chalk.red(error));
                }
            }
        }
    });
}

module.exports = {
    init
}