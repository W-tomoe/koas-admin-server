const fs = require('fs')
const path = require('path')

function mkdir(filepathStr) {
    const targetPath = path.join(__dirname, filepathStr)
    if(!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath)
    }
}

module.exports = mkdir