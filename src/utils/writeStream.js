/*
 * @Description: 写入文件流
 * @Author: Wong
 * @Date: 2019-11-28 14:02:04
 * @LastEditTime: 2019-11-28 14:58:44
 */
const fs = require('fs')
const path = require('path')
const mkdir = require('./mkdir')
const sillyDatetime = require('silly-datetime')
const uuid = require('node-uuid')


function writeStream (file,outPath) {
  
    const uid = uuid.v1()

    const inPath = file.path
    const fileName = uid + (path.extname(file.name) || '.png')
    const fileSize = file.size
    const fileType = file.type
    const uploadTime = sillyDatetime.format(new Date(), 'YYYY-MM-DD')

    mkdir(`../public/upload/${uploadTime}/`)
    //创建可读流
    const readFileStream = fs.createReadStream(inPath)
    let filePath =  path.join(__dirname, `../public/upload/${uploadTime}/`) + `/${fileName}`

    // 创建可写流
    const fileStream = fs.createWriteStream(filePath)

    // 可读流通过管道写入可写流
    readFileStream.pipe(fileStream)

    return {
        uuid: uid,
        filePath: `/upload/${uploadTime}/${fileName}`,
        fileSize: fileSize,
        fileType:fileType,
        fileName: fileName
    }
}

module.exports = writeStream