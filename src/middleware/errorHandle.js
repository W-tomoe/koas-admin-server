/*
 * @Description: 未路由拦截 中间件
 * @Author: Wong
 * @Date: 2019-10-29 14:16:04
 * @LastEditTime: 2019-11-21 16:22:06
 */
const { LoginErrorModel } = require('../model/resModel')

const errorHandle = async (ctx, next) => {
    return next().catch((err) => {
        if(err.status === 401) {
            ctx.status = 401
            return ctx.body =new LoginErrorModel('未登录')
        }else{
            throw err
        }
    })
}

module.exports = errorHandle;