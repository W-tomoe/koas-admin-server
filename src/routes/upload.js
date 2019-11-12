const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')



router.post('/api/upload', (ctx, next) => {
    const file = ctx.request.files.file
    //创建可读流
    const reader = fs.createReadStream(file.path)
    let filePath = path.join(__dirname, '../public/upload/') + `/${file.name}`

    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    const env = process.env.NODE_ENV

    // 可读流通过管道写入可写流
    reader.pipe(upStream)

    let filePathData
    if(env === 'dev' ) {
        filePathData = `http://localhost:8001/upload/${file.name}`
    }else {
        filePathData = `http://localhost:8001/upload/${file.name}`
    }

    const data = {
        filePath: filePathData,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
    }

    return ctx.body = new SuccessModel(data,'上传成功')
})

module.exports = router