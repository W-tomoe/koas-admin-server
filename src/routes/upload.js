/*
 * @Description: 文件上传 路由
 * @Author: Wong
 * @Date: 2019-11-05 10:39:30
 */
const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const uuid = require('node-uuid')
const mkdir= require('../utils/mkdir')
const sillyDatetime = require('silly-datetime')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')



router.post('/api/upload', (ctx, next) => {
    const file = ctx.request.files.file

    const uid = uuid.v1()
    const uploadSuccessName = uid + path.extname(file.name)
    const uploadTime = sillyDatetime.format(new Date(), 'YYYY-MM-DD')

    mkdir(`../public/upload/${uploadTime}/`)
    //创建可读流
    const reader = fs.createReadStream(file.path)
    let filePath = path.join(__dirname, `../public/upload/${uploadTime}/`) + `/${uploadSuccessName}`

    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    

    // 可读流通过管道写入可写流
    reader.pipe(upStream)

    let filePathData
    const env = process.env.NODE_ENV
    if(env === 'dev' ) {
        filePathData = `http://localhost:8001/upload/${uploadTime}/${uploadSuccessName}`
    }else {
        filePathData = `http://localhost:8001/upload/${uploadTime}/${uploadSuccessName}`
    }

    const data = {
        fileUuid: uid,
        filePath: filePathData,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        status: 'done'
    }

    return ctx.body = new SuccessModel(data,'上传成功')
})

module.exports = router