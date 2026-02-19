const buffer = require('buffer');

// Node.js >= 25 removed SlowBuffer, but jsonwebtoken's transitive dependency
// still expects it during module initialization.
if (typeof buffer.SlowBuffer === 'undefined') {
    buffer.SlowBuffer = Buffer;
}

module.exports = require('jsonwebtoken');
