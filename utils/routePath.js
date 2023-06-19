const path = require('path');

const routhPath = path.dirname(process.mainModule.filename)
console.log(routhPath);

module.exports = routhPath
