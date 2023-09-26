const path = require('path');
const fs = require('fs');
const esprima = require('esprima');

const extractComments = (routePath) => {
    const comments = [];
    const files = fs.readdirSync(routePath);

    files.forEach((file) => {
        let current = path.join(routePath, file);

        if (fs.statSync(current).isDirectory()) {
            comments.push(...extractComments(current));
        } else {
            if (file.toLowerCase().indexOf('routes.js') >= 0) {
                try {
                    const fileContents = fs.readFileSync(current, 'utf8');
                    const parsed = esprima.parseScript(fileContents, {
                        comment: true,
                    });

                    let routeName = routePath.split(path.sep).pop();
                    const routeComments = parsed.comments.filter((comment) =>
                        comment.value.includes('* path:')
                    );

                    routeName = routeName.charAt(0).toUpperCase() + routeName.slice(1)

                    comments.push({
                        routeName,
                        routeComments: routeComments.map((comment) =>
                            parseComment(comment.value)
                        ),
                    });
                } catch (error) {
                    console.error(
                        'Error extracting comments for',
                        routeName,
                        error
                    );
                }
            }
        }
    });

    return comments;
};

const parseComment = (comment) => {
    const lines = comment.split('\n');
    const commentObject = {
        path: '',
        method: '',
        description: '',
        access: '',
        params: [],
        return: '',
    };

    for (const line of lines) {
        let parts = line.split(':').map((part) => part.trim());
        parts[0] = parts[0].substring(2);

        

        if (parts.length >= 2) {
            const key = parts[0];
            parts.shift();
            const value = parts.join(':');

            if (commentObject.hasOwnProperty(key)) {
                commentObject[key] = value;
            }
        } else if (parts.length === 1) {
            if (parts[0].includes('@returns')) {
                let returnParts = parts[0].split(' ');
                returnParts.shift();
                commentObject['return'] = returnParts.join(' ');
            }
            if (parts[0].includes('@param')) {
                let paramParts = parts[0].split(' ');
                paramParts.shift();
                let fullParam = paramParts.join(' ');
                let paramName = fullParam.split('|')[0].trim();
                let paramDescription = fullParam.split('|')[1].trim();
                paramDescription = paramDescription.charAt(0).toUpperCase() + paramDescription.slice(1)
                commentObject.params.push({
                    name: paramName,
                    description: paramDescription,
                });
            }
        }
    }
    return commentObject;
};

const init = (routePath) => {
    const comments = extractComments(routePath);

    const jsonComments = comments.reduce((acc, comment) => {
        const { routeName, routeComments } = comment;
        acc[routeName] = acc[routeName] || [];
        acc[routeName].push(...routeComments);
        return acc;
    }, {});

    return jsonComments;
};

module.exports = {
    init,
};
