const fs = require('fs')
const path = require('path')

function mkdir(filepathStr) {
    if(!fs.existsSync(filepathStr)) {
        fs.mkdir(path.join(__dirname, filepathStr))
    }
}

module.exports = mkdir;